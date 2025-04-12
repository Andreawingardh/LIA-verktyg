"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "../../hook/useSupabaseAuth";
import { supabase } from "../../utils/supabase/client";
import EditProfileButton from "../components/profile/EditProfileButton";
import CompletionConfirmationPopup from "../components/form/CompletionConfirmationPopup";
import styles from "./dashboard.module.css";
import AddPositionButton from "../components/profile/addPositionButton";
import AddPositionOverlay from "../components/profile/addPositionOverlay";
import PositionCard from "../components/cards/PositionCard";
import { PositionsBanner } from "../components/cards/PositionsBanner";
import Link from "next/link";

const formatWebsiteForDisplay = (url) => {
  if (!url) return "www.acmeagency.com";

  try {
    // Create URL object to parse the url
    const urlObj = new URL(url);
    // Get hostname part without protocol
    let hostname = urlObj.hostname;

    // Add www. prefix if it doesn't already have it
    if (!hostname.startsWith("www.")) {
      hostname = "www." + hostname;
    }

    return hostname;
  } catch (e) {
    // If it's not a valid URL, ensure it has www. prefix
    if (!url.startsWith("www.") && !url.startsWith("http")) {
      return "www." + url;
    }
    return url;
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showAddPositionOverlay, setShowAddPositionOverlay] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      fetchCompanyProfile();
      fetchPositions();

      const shouldShowPopup = localStorage.getItem("showCompletionPopup");
      if (shouldShowPopup === "true") {
        setShowCompletionPopup(true);
        localStorage.removeItem("showCompletionPopup");
      }
    } else if (!authLoading && !user) {
      window.location.href = "/";
    }
  }, [user, authLoading]);

  const fetchCompanyProfile = async () => {
    try {
      const { data, fetchError } = await supabase
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
      const { data, fetchError } = await supabase
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

  const handleAddLiaPosition = () => {
    setShowCompletionPopup(false);
    setShowAddPositionOverlay(true);
  };

  if (authLoading || loading) {
    return <div className="loading">Laddar...</div>;
  }

  return (
    <main className={styles["main-content"]}>
      {/* Company Header Banner */}
      {companyProfile &&
        companyProfile.display_image_url &&
        companyProfile.display_image_url !== "pending" && (
          <div className={styles["cover-image"]}>
            <div className={styles.coverWrapper}>
              <img src={companyProfile.display_image_url} alt="Omslagsbild" />
            </div>
          </div>
        )}

      <div className={styles["dashboard-container"]}>
        <div className={styles.contentWrapper}>
          {error ? (
            <p className="error-message">{error}</p>
          ) : companyProfile ? (
            <>
              {/* Company Profile Section */}
              <div className={styles.profileWrapper}>
                <div className={styles["profile-content"]}>
                  <div className={styles["profile-header"]}>
                    {companyProfile.logo_url &&
                    companyProfile.logo_url !== "pending" ? (
                      <div className={styles["company-logo"]}>
                        <img
                          src={companyProfile.logo_url}
                          alt={`${companyProfile.name} logotyp`}
                        />
                      </div>
                    ) : (
                      <div className={styles["company-logo"]}>
                        <div>
                          {companyProfile.name
                            ? companyProfile.name.charAt(0)
                            : "A"}
                        </div>
                      </div>
                    )}
                    <div className={styles["company-details"]}>
                      <h2>{companyProfile.name || "Acme Agency"}</h2>
                    </div>
                  </div>

                  <p className={styles.location}>
                    {companyProfile.location || "Göteborg"}
                  </p>

                  <div className={styles.description}>
                    <p>
                      {companyProfile.description ||
                        "Acme Inc är en designbyrå sedan 10 år tillbaka. Vi arbetar med främst med kommunikation och varumärkesutveckling. Vi söker främst praktikanter som fokuserar på rörligt. Som praktikant hos oss får man inte bara frilöst, utan även jobba skarpt mot kund och mycket frihet."}
                    </p>
                  </div>
                </div>

                {/* Website Button*/}
                <button type="button" className={styles.website}>
                  <a
                    href={companyProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formatWebsiteForDisplay(companyProfile.website)}
                  </a>
                </button>

                {/* Edit Profile Button */}
                <div className={styles["profile-actions"]}>
                  <EditProfileButton
                    companyId={companyProfile.id}
                    onProfileUpdate={fetchCompanyProfile}
                    className="primary-button"
                  >
                    Redigera profil
                  </EditProfileButton>
                </div>
              </div>

              {/* Position Cards Section */}
              <div className={styles["positions-section"]}>
                <PositionCard />
              </div>
            </>
          ) : (
            <div className={styles["no-profile"]}>
              <p>Du har inte skapat någon företagsprofil ännu.</p>
              <Link href="/company/register" className="primary-button">
                Skapa Företagsprofil
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Completion Confirmation Popup */}
      <CompletionConfirmationPopup
        isOpen={showCompletionPopup}
        onClose={() => setShowCompletionPopup(false)}
        onAddLiaPosition={handleAddLiaPosition}
      />

      {/* Add Position Overlay */}
      <AddPositionOverlay
        isOpen={showAddPositionOverlay}
        onClose={() => setShowAddPositionOverlay(false)}
        onAddLiaPosition={handleAddLiaPosition}
      />

      {/* <PositionsBanner /> */}
      <PositionsBanner />
    </main>
  );
}
