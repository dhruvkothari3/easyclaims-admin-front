import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { api, Customer, Policy } from "@/lib/api";
import { auth } from "@/lib/auth";
import { ArrowLeft, User, Phone, Mail, Calendar, FileText, IndianRupee } from "lucide-react";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }

    if (!id) {
      navigate("/admin/search");
      return;
    }

    loadCustomerData();
  }, [id, navigate]);

  const loadCustomerData = async () => {
    try {
      setIsLoading(true);
      
      // Get customer policies
      const customerPolicies = await api.getCustomerPolicies(id!);
      setPolicies(customerPolicies);
      
      // Find customer from search results (mock implementation)
      // In a real app, you'd have a separate endpoint to get customer by ID
      const searchResults = await api.searchCustomers("id", id!);
      const foundCustomer = searchResults.find(c => c.id === id);
      
      if (foundCustomer) {
        setCustomer(foundCustomer);
      } else {
        toast({
          title: "Customer Not Found",
          description: "The requested customer could not be found.",
          variant: "destructive"
        });
        navigate("/admin/search");
      }
    } catch (error) {
      toast({
        title: "Load Error",
        description: "Failed to load customer data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success";
      case "Expired":
        return "bg-warning";
      case "Cancelled":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading customer data...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Customer not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white border-b shadow-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/search")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
              <h1 className="text-xl font-bold text-primary">Customer Details</h1>
            </div>
            <Button variant="outline" onClick={() => {
              auth.removeToken();
              navigate("/admin/login");
            }}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Customer Information Card */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </CardTitle>
              <CardDescription>Basic customer details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Customer ID</div>
                  <div className="font-mono text-sm bg-muted/30 px-2 py-1 rounded">{customer.id}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                  <div className="font-semibold">{customer.name}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </div>
                  <div>{customer.email}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone
                  </div>
                  <div>{customer.phone}</div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Customer since: {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policies Table */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Policies & Plans ({policies.length})
              </CardTitle>
              <CardDescription>
                All insurance policies and plans associated with this customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {policies.length > 0 ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Policy Number</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Premium</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {policies.map((policy) => (
                        <TableRow key={policy.id}>
                          <TableCell className="font-mono text-sm">{policy.policyNumber}</TableCell>
                          <TableCell className="font-medium">{policy.type}</TableCell>
                          <TableCell className="text-right font-semibold">
                            <div className="flex items-center justify-end">
                              <IndianRupee className="h-4 w-4 mr-1" />
                              {formatCurrency(policy.premium)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(policy.status)}>
                              {policy.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(policy.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(policy.endDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No policies found for this customer.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          {policies.length > 0 && (
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Policy Summary</CardTitle>
                <CardDescription>Overview of customer's insurance portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{policies.length}</div>
                    <div className="text-sm text-muted-foreground">Total Policies</div>
                  </div>
                  <div className="text-center p-4 bg-success/5 rounded-lg">
                    <div className="text-2xl font-bold text-success">
                      {policies.filter(p => p.status === 'Active').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Policies</div>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      {formatCurrency(policies.reduce((sum, p) => sum + p.premium, 0))}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Premium</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;