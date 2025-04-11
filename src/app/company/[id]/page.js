"use client";
import { supabase } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PublicDashboardPage from '@/app/components/publicdashboard/PublicDashboardPage';

export default function CompanyDetailPage() {
  const [companyData, setCompanyData] = useState(null);
  const [positionsData, setPositionsData] = useState([])
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch company data
        const { data: company, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", id)
          .single();
        
        if (companyError) {
          setError(companyError);
          setLoading(false);
          return;
        }

        setCompanyData(company);
        
        // Fetch positions for this company
        if (company && company.user_id) {
          const { data: positions, error: positionsError } = await supabase
            .from("positions")
            .select('*')
            .eq("user_id", company.user_id);
          
          if (positionsError) {
            console.error("Error fetching positions:", positionsError);
          } else {
            setPositionsData(positions || []);
          }
        }
      } catch (e) {
        setError(e);
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div>Laddar...</div>;
  }

  if (error) {
    return <div>Error loading company: {error.message}</div>;
  }

  return (
    <PublicDashboardPage
      companyData={companyData}
      positionsData={positionsData}
    />
  );
}