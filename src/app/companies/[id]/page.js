"use client";
import { supabase } from "@/utils/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import PublicDashboardPage from "../../components/publicdashboard/PublicDashboardPage";
import CreateCompanyProfileBanner from "@/app/components/cards/CreateCompanyProfileBanner";

export default function CompanyDetailPage() {
  const [companyData, setCompanyData] = useState(null);
  const [positionsData, setPositionsData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { data: company, error } = await supabase
          .from("companies")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          setError(error);
          setLoading(false);
          return;
        }

        // If we successfully got company data, fetch positions
        const { data: positions, error: listingsError } = await supabase
          .from("positions")
          .select("*")
          .eq("user_id", company.user_id);

        if (listingsError) {
          console.error("Error fetching positions:", listingsError);
        }

        setCompanyData(company);
        setPositionsData(positions || []);
      } catch (e) {
        setError(e);
        console.error(e);
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
    <>
      <PublicDashboardPage
        companyData={companyData}
        positionsData={positionsData}
      />
      <CreateCompanyProfileBanner />
    </>
  );
}
