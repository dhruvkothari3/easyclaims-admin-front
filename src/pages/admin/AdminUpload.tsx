import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Upload, FileText, Download, ArrowLeft, LogOut, Search } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { useCompanies } from "@/hooks/use-companies";
import { useAuthStore } from "@/stores/auth";
import type { IngestRecord } from "@/types/api";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface ParsedRow {
  [key: string]: string;
}

interface FieldMapping {
  external_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  'plans[0].external_plan_id': string;
  'plans[0].plan_name': string;
  'plans[0].plan_type': string;
  'plans[0].status': string;
  'plans[0].start_date': string;
  'plans[0].end_date': string;
}

const DEFAULT_MAPPING: FieldMapping = {
  external_id: 'Customer Unique ID',
  full_name: 'Name of the Customer', 
  email: 'Customer Email ID',
  phone: 'Customer Phone number',
  city: 'Customer Location (City/Town)',
  'plans[0].external_plan_id': 'Loan ID',
  'plans[0].plan_name': 'Plan Name',
  'plans[0].plan_type': 'Plan Type',
  'plans[0].status': 'Status',
  'plans[0].start_date': 'Loan Start Date',
  'plans[0].end_date': 'Loan End Date',
};

const AdminUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<FieldMapping>(DEFAULT_MAPPING);
  const [normalizePhone, setNormalizePhone] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<any>(null);
  const [errorRows, setErrorRows] = useState<any[]>([]);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearToken } = useAuthStore();
  const { companies, selectedCompany, selectCompany, isLoading: companiesLoading } = useCompanies();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    parseFile(file);
  }, []);

  const parseFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = results.data as ParsedRow[];
          const validData = data.filter(row => Object.values(row).some(val => val?.trim()));
          setParsedData(validData);
          setHeaders(Object.keys(validData[0] || {}));
          
          // Try to auto-map common headers
          const autoMapping = { ...DEFAULT_MAPPING };
          const fileHeaders = Object.keys(validData[0] || {});
          
          Object.entries(DEFAULT_MAPPING).forEach(([field, defaultHeader]) => {
            const matchingHeader = fileHeaders.find(h => 
              h.toLowerCase().includes(defaultHeader.toLowerCase()) ||
              defaultHeader.toLowerCase().includes(h.toLowerCase())
            );
            if (matchingHeader) {
              autoMapping[field as keyof FieldMapping] = matchingHeader;
            }
          });
          
          setMapping(autoMapping);
        },
        error: (error) => {
          toast({
            title: "Parse Error",
            description: `Failed to parse CSV: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as ParsedRow[];
          
          const validData = jsonData.filter(row => Object.values(row).some(val => val?.toString().trim()));
          setParsedData(validData);
          setHeaders(Object.keys(validData[0] || {}));
          
          // Try to auto-map common headers
          const autoMapping = { ...DEFAULT_MAPPING };
          const fileHeaders = Object.keys(validData[0] || {});
          
          Object.entries(DEFAULT_MAPPING).forEach(([field, defaultHeader]) => {
            const matchingHeader = fileHeaders.find(h => 
              h.toLowerCase().includes(defaultHeader.toLowerCase()) ||
              defaultHeader.toLowerCase().includes(h.toLowerCase())
            );
            if (matchingHeader) {
              autoMapping[field as keyof FieldMapping] = matchingHeader;
            }
          });
          
          setMapping(autoMapping);
        } catch (error) {
          toast({
            title: "Parse Error",
            description: `Failed to parse Excel file: ${error}`,
            variant: "destructive"
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast({
        title: "Unsupported File",
        description: "Please select a CSV or Excel (.xlsx/.xls) file",
        variant: "destructive"
      });
    }
  };

  const normalizePhoneNumber = (phone: string): string => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Handle Indian phone numbers
    if (digits.length === 10) {
      return `+91${digits}`;
    } else if (digits.length === 12 && digits.startsWith('91')) {
      return `+${digits}`;
    } else if (digits.length === 13 && digits.startsWith('091')) {
      return `+${digits.substring(1)}`;
    }
    
    return phone; // Return original if format not recognized
  };

  const transformData = (): IngestRecord[] => {
    return parsedData.map(row => {
      const record: IngestRecord = {
        external_id: row[mapping.external_id]?.toString() || undefined,
        full_name: row[mapping.full_name]?.toString() || '',
        email: row[mapping.email]?.toString() || undefined,
        phone: row[mapping.phone]?.toString() || undefined,
        city: row[mapping.city]?.toString() || undefined,
      };

      // Normalize phone if enabled
      if (record.phone && normalizePhone) {
        record.phone = normalizePhoneNumber(record.phone);
      }

      // Add plans if mapped
      const planId = row[mapping['plans[0].external_plan_id']]?.toString();
      if (planId) {
        record.plans = [{
          external_plan_id: planId,
          plan_name: row[mapping['plans[0].plan_name']]?.toString() || undefined,
          plan_type: row[mapping['plans[0].plan_type']]?.toString() || undefined,
          status: row[mapping['plans[0].status']]?.toString() || undefined,
          start_date: row[mapping['plans[0].start_date']]?.toString() || undefined,
          end_date: row[mapping['plans[0].end_date']]?.toString() || undefined,
        }];
      }

      return record;
    });
  };

  const handleUpload = async () => {
    if (!selectedCompany || !parsedData.length) {
      toast({
        title: "Upload Error",
        description: "Please select a company and upload a valid file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResults(null);
    setErrorRows([]);

    try {
      const transformedData = transformData();
      const batchSize = 500;
      const batches = [];
      
      for (let i = 0; i < transformedData.length; i += batchSize) {
        batches.push(transformedData.slice(i, i + batchSize));
      }

      let totalInserted = 0;
      let totalUpdated = 0;
      let totalLinked = 0;
      let totalErrors = 0;
      const allErrorRows: any[] = [];

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const response = await api.ingestBatch({ records: batch }, selectedCompany);
        
        totalInserted += response.counts.inserted;
        totalUpdated += response.counts.updated;
        totalLinked += response.counts.linked;
        totalErrors += response.counts.errors;
        
        if (response.error_rows) {
          allErrorRows.push(...response.error_rows.map(err => ({
            ...err,
            index: err.index + (i * batchSize) // Adjust index for batch offset
          })));
        }

        setUploadProgress(((i + 1) / batches.length) * 100);
      }

      setUploadResults({
        inserted: totalInserted,
        updated: totalUpdated,
        linked: totalLinked,
        errors: totalErrors
      });
      
      setErrorRows(allErrorRows);

      toast({
        title: "Upload Complete",
        description: `Processed ${transformedData.length} rows successfully`,
      });

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Upload failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadErrorReport = () => {
    if (!errorRows.length) return;

    const errorData = errorRows.map(err => ({
      'Row Index': err.index + 1,
      'Error': err.reason,
      'Original Data': JSON.stringify(parsedData[err.index] || {})
    }));

    const csv = Papa.unparse(errorData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'upload-errors.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    clearToken();
    navigate("/admin/login");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => navigate("/admin/search")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Button>
                <h1 className="text-xl font-bold text-primary">Bulk Upload</h1>
                <nav className="flex space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/admin/search')}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </nav>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Upload Configuration */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                File Upload Configuration
              </CardTitle>
              <CardDescription>
                Upload CSV or Excel files to import customer and plan data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Company *</label>
                <Select 
                  value={selectedCompany} 
                  onValueChange={selectCompany}
                  disabled={companiesLoading}
                >
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">File *</label>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="max-w-md"
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="normalize-phone"
                  checked={normalizePhone}
                  onCheckedChange={(checked) => setNormalizePhone(checked === true)}
                />
                <label htmlFor="normalize-phone" className="text-sm font-medium">
                  Normalize phone numbers (assume India +91)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Field Mapping */}
          {headers.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Field Mapping</CardTitle>
                <CardDescription>
                  Map your file columns to the expected fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(mapping).map(([field, header]) => (
                    <div key={field} className="space-y-2">
                      <label className="text-sm font-medium">
                        {field.includes('plans') ? `Plan ${field.split('.')[1]}` : field.replace('_', ' ')}
                      </label>
                      <Select
                        value={header}
                        onValueChange={(value) => setMapping(prev => ({ ...prev, [field]: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-- Not mapped --</SelectItem>
                          {headers.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Preview */}
          {parsedData.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                  First 25 rows of your data (Total: {parsedData.length} rows)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-auto max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {headers.slice(0, 8).map(header => (
                          <TableHead key={header} className="whitespace-nowrap">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(0, 25).map((row, index) => (
                        <TableRow key={index}>
                          {headers.slice(0, 8).map(header => (
                            <TableCell key={header} className="max-w-32 truncate">
                              {row[header]?.toString() || '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Ready to upload {parsedData.length} records
                  </p>
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedCompany || isUploading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Data
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Upload Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  Processing batch {Math.ceil(uploadProgress / 100 * Math.ceil(parsedData.length / 500))} of {Math.ceil(parsedData.length / 500)}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Upload Results */}
          {uploadResults && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Upload Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{uploadResults.inserted}</div>
                    <div className="text-sm text-muted-foreground">Inserted</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{uploadResults.updated}</div>
                    <div className="text-sm text-muted-foreground">Updated</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">{uploadResults.linked}</div>
                    <div className="text-sm text-muted-foreground">Plans Linked</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-2xl font-bold text-red-600">{uploadResults.errors}</div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                </div>

                {errorRows.length > 0 && (
                  <Button onClick={downloadErrorReport} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Error Report
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminUpload;