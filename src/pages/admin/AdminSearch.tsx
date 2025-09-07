import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api, Customer } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Search, LogOut, User } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const AdminSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"id" | "phone" | "name">("id");
  const [results, setResults] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const performSearch = useCallback(async (query: string, type: "id" | "phone" | "name") => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await api.searchCustomers(type, query);
      setResults(searchResults);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Could not search customers. Please try again.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    performSearch(debouncedSearchQuery, searchType);
  }, [debouncedSearchQuery, searchType, performSearch]);

  const handleLogout = () => {
    auth.removeToken();
    navigate("/admin/login");
  };

  const handleCustomerClick = (customerId: string) => {
    navigate(`/admin/customer/${customerId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white border-b shadow-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary">EasyClaims Admin</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Customer Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={searchType} onValueChange={(value) => setSearchType(value as "id" | "phone" | "name")}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="id">By ID</TabsTrigger>
                <TabsTrigger value="phone">By Phone</TabsTrigger>
                <TabsTrigger value="name">By Name</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <Input
                  placeholder={`Search by ${searchType}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <TabsContent value={searchType} className="mt-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((customer) => (
                          <TableRow key={customer.id} className="hover:bg-muted/50">
                            <TableCell className="font-mono text-sm">{customer.id}</TableCell>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phone}</TableCell>
                            <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
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
                ) : searchQuery && !isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No customers found matching your search.</p>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSearch;