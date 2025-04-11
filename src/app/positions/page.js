'use client'
import { supabase } from "@/utils/supabase/client";
import styles from "../page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Positions() {
  const [positionData, setPositionData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('positions')
          .select();

        if (error) {
          setError(error);
          return;
        }

        setPositionData(data || []);
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
          <h1>Welcome to Positions</h1>
          {/* <p>Post: {router.query.id}</p> */}
          {positionData.map((position) => (
            <p key={position.id}>
              <Link href={`/positions/${position.id}`}>
                {position.title}
              </Link>
            </p>
          ))}
        </main>
      </div>
    );
  }
  
