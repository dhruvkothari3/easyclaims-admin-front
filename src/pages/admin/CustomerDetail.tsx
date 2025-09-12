import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { api, Customer, Plan } from "@/lib/api";
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, FileText, LogOut } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuthStore } from "@/stores/auth";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('company_id');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [policies, setPolicies] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearToken } = useAuthStore();

  useEffect(() => {
    if (!id || !companyId) {
      navigate("/admin/search");
      return;
    }

    loadCustomerData();
  }, [id, companyId, navigate]);

  const loadCustomerData = async () => {
    try {
      setIsLoading(true);
      
      // Load customer and policies in parallel
      const [customerData, policiesData] = await Promise.all([
        api.getCustomer(id!, companyId!),
        api.getPolicies(id!, companyId!)
      ]);
      
      setCustomer(customerData);
      setPolicies(policiesData);
    } catch (error) {
      toast({
        title: "Load Error",
        description: error instanceof Error ? error.message : "Failed to load customer data. Please try again.",
        variant: "destructive"
      });
      navigate("/admin/search");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '-';
    return phone.startsWith('+91') ? phone : phone;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading customer data...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!customer) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Customer not found.</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

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
                <h1 className="text-xl font-bold text-primary">Customer Details</h1>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Customer Information Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </CardTitle>
                <CardDescription>Basic customer details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Customer ID</div>
                    <div className="font-mono text-sm bg-muted/30 px-3 py-2 rounded">{customer.id}</div>
                  </div>
                  {customer.external_id && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">External ID</div>
                      <div className="font-mono text-sm bg-muted/30 px-3 py-2 rounded">{customer.external_id}</div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                    <div className="font-semibold">{customer.full_name}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </div>
                    <div>{customer.email || '-'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      Phone
                    </div>
                    <div>{formatPhone(customer.phone_e164)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      City
                    </div>
                    <div>{customer.city || '-'}</div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last updated: {formatDate(customer.updated_at)}
                </div>
              </CardContent>
            </Card>

            {/* Policies Table */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Plans & Policies ({policies.length})
                </CardTitle>
                <CardDescription>
                  All plans and policies associated with this customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                {policies.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plan ID</TableHead>
                          <TableHead>Plan Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {policies.map((policy) => (
                          <TableRow key={policy.id}>
                            <TableCell className="font-mono text-sm">{policy.external_plan_id}</TableCell>
                            <TableCell className="font-medium">{policy.plan_name || '-'}</TableCell>
                            <TableCell>{policy.plan_type || '-'}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(policy.status)}>
                                {policy.status || 'Unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(policy.start_date)}</TableCell>
                            <TableCell>{formatDate(policy.end_date)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No plans found for this customer.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Card */}
            {policies.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Plan Summary</CardTitle>
                  <CardDescription>Overview of customer's insurance portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="text-3xl font-bold text-primary">{policies.length}</div>
                      <div className="text-sm text-muted-foreground">Total Plans</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-3xl font-bold text-green-600">
                        {policies.filter(p => p.status?.toLowerCase() === 'active').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Plans</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CustomerDetail;