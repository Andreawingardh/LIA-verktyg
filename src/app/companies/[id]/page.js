"use client";
import { supabase } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";

export default function CompanyDetailPage() {
  const [companyData, setCompanyData] = useState([]);
  const [positionsData, setPositionsData] = useState([])
  const [error, setError] = useState(null);
  const params = useParams();
  const id = params.id;


  useEffect(() => {
    async function fetchData() {
      try {
        const { data: company, error } = await supabase
          .from("companies")
          .select("*")
          .eq("id", id)
          .single();
        
        console.log({ company })

        const { data: positions, error: listingsError } = await supabase
          .from("positions")
          .select('*')
          .eq("user_id", company.user_id);
        
        console.log(positions)

        if (error) {
          setError(error);
          return;
        }
        console.log(company.name);
        setCompanyData(company || []);
        setPositionsData(positions || [])
      } catch (e) {
        setError(e);
        console.error(e);
      }
    }

    fetchData();
  }, []);
  console.log(companyData);

  if (error) {
    return <div>Error loading companies: {error.message}</div>;
  }
  return (
    <div>
      {/* <img src="" />
      <img src="" className="logo" /> */}
      <h3>{companyData.name}</h3>
      <h5>{companyData.location}</h5>
      <p>{companyData.description}</p>
      <a href={companyData.website}>{companyData.website}</a>
      <button>Kontakta företaget</button>
      <h3>Lia-positioner</h3>
      {positionsData.map((listing) => (
          <p key={listing.id}>
            <Link href={`/companies/${listing.id}`}>{listing.title}</Link>
          </p>
        ))}
    </div>
  );
}
