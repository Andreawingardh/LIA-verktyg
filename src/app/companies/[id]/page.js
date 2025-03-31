'use client'
import { supabase } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import styling from './company-page.css'


export default function CompanyDetailPage() {
  const [companyData, setCompanyData] = useState([]);
  const [error, setError] = useState(null);
  const params = useParams();
  const id = params.id

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: company, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .single();
        
          if (error) {
            setError(error);
            return;
          }
          console.log(company.name)
          setCompanyData(company || []);
        } catch (e) {
          setError(e);
          console.error(e);
        }
      }
  
      fetchData();
    }, []);
  console.log(companyData)

  if (error) {
    return <div>Error loading companies: {error.message}</div>;
  }
  return (
    <div>
      <img src="" />
      <img src="" className="logo"/>
      <h3>{companyData.name}</h3>
      <h5>{companyData.location}</h5>
      <p>{companyData.description}</p>
      <a href={companyData.website}>{ companyData.website }</a>
      <button>Kontakta företaget</button>
    </div>
  );
}