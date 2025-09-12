import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api, Customer } from "@/lib/api";
import { Search, LogOut, User, Upload } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { AuthGuard } from "@/components/AuthGuard";
import { useCompanies } from "@/hooks/use-companies";
import { useAuthStore } from "@/stores/auth";

const AdminSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearToken } = useAuthStore();
  const { companies, selectedCompany, selectCompany, isLoading: companiesLoading } = useCompanies();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const performSearch = useCallback(async (query: string, companyId: string) => {
    if (!query.trim() || !companyId) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await api.searchCustomers(query, companyId);
      setResults(searchResults);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Could not search customers. Please try again.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (selectedCompany) {
      performSearch(debouncedSearchQuery, selectedCompany);
    }
  }, [debouncedSearchQuery, selectedCompany, performSearch]);

  const handleLogout = () => {
    clearToken();
    navigate("/admin/login");
  };

  const handleCustomerClick = (customerId: string) => {
    navigate(`/admin/customers/${customerId}?company_id=${selectedCompany}`);
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '-';
    // Format E.164 phone number for display
    return phone.startsWith('+91') ? phone : phone;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-primary">EasyClaims Admin</h1>
                <nav className="flex space-x-4">
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/admin/upload')}
                  >
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Customer Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
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

              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search by name, phone, email, or plan ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                  disabled={!selectedCompany}
                />
              </div>

              {/* Results */}
              <div className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((customer) => (
                          <TableRow key={customer.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{customer.full_name}</TableCell>
                            <TableCell>{customer.email || '-'}</TableCell>
                            <TableCell>{formatPhone(customer.phone_e164)}</TableCell>
                            <TableCell>{customer.city || '-'}</TableCell>
                            <TableCell>{new Date(customer.updated_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleCustomerClick(customer.id)}
                                className="bg-primary hover:bg-primary/90"
                              >
                                <User className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : searchQuery && selectedCompany && !isLoading ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No customers found</p>
                    <p className="text-sm text-muted-foreground">
                      Try searching by name, email, phone digits, or plan number
                    </p>
                  </div>
                ) : !selectedCompany && !companiesLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Please select a company to search</p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminSearch;