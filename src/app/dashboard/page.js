// pages/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useSupabaseAuth } from "../../hook/useSupabaseAuth";
import { supabase } from "../../utils/supabase/client";
import EditProfileButton from "../components/profile/EditProfileButton";
import "./dashboard.css";
import AddPositionButton from "../components/profile/addPositionButton";
import PositionCard from "../components/cards/PositionCard";

export default function DashboardPage() {
  const { user, loading: authLoading } = useSupabaseAuth();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && !authLoading) {
      fetchCompanyProfile();
      fetchPositions();
    } else if (!authLoading && !user) {
      // Redirect to login if not authenticated
      window.location.href = "/";
    }
  }, [user, authLoading]);

  const fetchCompanyProfile = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError) throw fetchError;
      setCompanyProfile(data);
    } catch (err) {
      console.error("Error fetching company profile:", err);
      setError("Kunde inte hämta företagsprofil");
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("positions")
        .select("*")
        .eq("user_id", user.id);

      if (fetchError) throw fetchError;
      setPositions(data || []);
    } catch (err) {
      console.error("Error fetching positions:", err);
      setError("Kunde inte hämta positioner");
    }
  };

  const refreshPositions = () => {
    fetchPositions();
  };

  if (authLoading || loading) {
    return <div className="loading">Laddar...</div>;
  }

  return (
    <main>
      <div className="container dashboard-container">
        <h1>Företagsprofil Dashboard</h1>

        {error ? (
          <p className="error-message">{error}</p>
        ) : companyProfile ? (
          <div className="profile-card">
            <div className="profile-header">
              {companyProfile.display_image_url &&
                companyProfile.display_image_url !== "pending" && (
                  <div className="cover-image">
                    <img
                      src={companyProfile.display_image_url}
                      alt="Omslagsbild"
                    />
                  </div>
                )}

              <div className="profile-info">
                {companyProfile.logo_url &&
                  companyProfile.logo_url !== "pending" && (
                    <div className="company-logo">
                      <img
                        src={companyProfile.logo_url}
                        alt={`${companyProfile.name} logotyp`}
                      />
                    </div>
                  )}

                <div className="company-details">
                  <h2>{companyProfile.name}</h2>
                  <p className="location">{companyProfile.location}</p>
                </div>
              </div>
            </div>

            <div className="profile-content">
              <div className="description">
                <h3>Om företaget</h3>
                <p>{companyProfile.description}</p>
              </div>

              <div className="contact-info">
                <h3>Kontaktinformation</h3>
                <p>
                  <strong>Hemsida:</strong>{" "}
                  <a
                    href={companyProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {companyProfile.website}
                  </a>
                </p>
                <p>
                  <strong>E-post:</strong>{" "}
                  <a href={`mailto:${companyProfile.email}`}>
                    {companyProfile.email}
                  </a>
                </p>
                <div className="profile-actions">
                  <EditProfileButton
                    companyId={companyProfile.id}
                    onProfileUpdate={fetchCompanyProfile}
                  />
                </div>

                <PositionCard />
              </div>
            </div>
          </div>
        ) : (
          <div className="no-profile">
            <p>Du har inte skapat någon företagsprofil ännu.</p>
            <a href="/company/register" className="primary-button">
              Skapa Företagsprofil
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
