'use client'
import { supabase } from "@/utils/supabase/client";
import styles from "../page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Companies() {
  const [companiesData, setCompaniesData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select();

        if (error) {
          setError(error);
          return;
        }

        setCompaniesData(data || []);
      } catch (e) {
        setError(e);
        console.error(e);
      }
    }

    fetchData();
  }, []); // Empty dependency array means this runs once on component mount

  if (error) {
    return <div>Error loading companies: {error.message}</div>;
  }
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>Welcome to company</h1>
          {/* <p>Post: {router.query.id}</p> */}
          {companiesData.map((company) => (
            <p key={company.id}>
              <Link href={`/companies/${company.id}`}>
                {company.name}
              </Link>
            </p>
          ))}
        </main>
      </div>
    );
  }
  
