import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Company } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const companiesData = await api.getCompanies();
      setCompanies(companiesData);
      
      // Try to restore last selected company
      const lastSelected = localStorage.getItem('easyclaims-selected-company');
      if (lastSelected && companiesData.some(c => c.id === lastSelected)) {
        setSelectedCompany(lastSelected);
      } else if (companiesData.length > 0) {
        setSelectedCompany(companiesData[0].id);
      }
    } catch (error) {
      toast({
        title: "Failed to load companies",
        description: "Could not fetch company list. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectCompany = (companyId: string) => {
    setSelectedCompany(companyId);
    localStorage.setItem('easyclaims-selected-company', companyId);
  };

  return {
    companies,
    selectedCompany,
    selectCompany,
    isLoading,
  };
};