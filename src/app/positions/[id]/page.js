"use client";
import { supabase } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import styling from "../positions.css"

export default function PositionDetailPage() {
  const [positionData, setPositionData] = useState([]);
  const [error, setError] = useState(null);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: position, error } = await supabase
          .from("positions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          setError(error);
          return;
        }
        setPositionData(position || []);
      } catch (e) {
        setError(e);
        console.error(e);
      }
    }

    fetchData();
  }, []);
 

  if (error) {
    return <div>Error loading companies: {error.message}</div>;
  }
  return (
    <div>
      <h3>{positionData.title}</h3>
      <button>Kontakta företaget</button>
    </div>
  );
}
