"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase/client";
import styles from "../../dashboard/dashboard.module.css";
import "../cards/positioncard.css";
import Link from "next/link";
import { PositionsBanner } from "../cards/PositionsBanner";

const formatWebsiteForDisplay = (url) => {

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

export default function PublicDashboardPage({ companyData, positionsData }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [positions, setPositions] = useState([]);
  const [positionSkills, setPositionSkills] = useState({});

  useEffect(() => {
    if (companyData) {
      setLoading(false);
    }

    if (positionsData && positionsData.length > 0) {
      // Add softwareExpanded property to each position
      const positionsWithExpanded = positionsData.map((position) => ({
        ...position,
        softwareExpanded: false, // Default to collapsed
      }));

      setPositions(positionsWithExpanded);
      fetchSkillsForPositions(positionsData);
    } else if (companyData?.user_id) {
      // If positions aren't provided but we have company data, fetch positions
      fetchPositions(companyData.user_id);
    }
  }, [companyData, positionsData]);

  const fetchPositions = async (userId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("positions")
        .select("*")
        .eq("user_id", userId);

      if (fetchError) throw fetchError;

      // Add softwareExpanded property to each position
      const positionsWithExpanded = (data || []).map((position) => ({
        ...position,
        softwareExpanded: false, // Default to collapsed
      }));

      setPositions(positionsWithExpanded);

      // After fetching positions, fetch skills for each position
      if (data && data.length > 0) {
        fetchSkillsForPositions(data);
      }
    } catch (err) {
      console.error("Error fetching positions:", err);
      setError("Kunde inte hämta positioner");
    }
  };

  const fetchSkillsForPositions = async (positionsList) => {
    try {
      const skillsMap = {};

      for (const position of positionsList) {
        // Determine which table to query based on position title
        const tablePrefix =
          position.title === "Webbutvecklare"
            ? "webbutvecklare"
            : "digitaldesigner";
        const tableName = `${tablePrefix}_skill_position`;

        // Fetch skills for this position
        const { data: skillsRelations, error: relationsError } = await supabase
          .from(tableName)
          .select("*")
          .eq("position_id", position.id);

        if (relationsError) throw relationsError;

        if (skillsRelations && skillsRelations.length > 0) {
          // Get the actual skill details
          const skillIds = skillsRelations.map(
            (relation) => relation.skills_id
          );

          const { data: skillsData, error: skillsError } = await supabase
            .from(`skills_${tablePrefix}`)
            .select("*")
            .in("id", skillIds);

          if (skillsError) throw skillsError;

          // Store skills for this position
          skillsMap[position.id] = skillsData || [];
        } else {
          skillsMap[position.id] = [];
        }
      }

      setPositionSkills(skillsMap);
    } catch (err) {
      console.error("Error fetching skills for positions:", err);
      setError("Kunde inte hämta kunskaper för positioner");
    }
  };

  const toggleCardExpanded = (positionId) => {
    // Prevent any default navigation behavior
    setPositions((prevPositions) =>
      prevPositions.map((pos) =>
        pos.id === positionId
          ? { ...pos, softwareExpanded: !pos.softwareExpanded }
          : pos
      )
    );
    return false; // Explicitly return false to prevent default behavior
  };

  if (loading && !companyData) {
    return <div className="loading">Laddar...</div>;
  }

  return (
    <>
      {/* Company Header Banner */}
      {companyData &&
        companyData.display_image_url &&
        companyData.display_image_url !== "pending" && (
          <div className={styles["cover-image"]}>
            <div className={styles.coverWrapper}>
              <img src={companyData.display_image_url} alt="Omslagsbild" />
            </div>
          </div>
        )}

      <div className={styles["dashboard-container"]}>
        <div className={styles.contentWrapper}>
          {error ? (
            <p className="error-message">{error}</p>
          ) : companyData ? (
            <>
              {/* Company Profile Section */}
              <div className={styles.profileWrapper}>
                <div className={styles["profile-content"]}>
                  <div className={styles["profile-header"]}>
                    {companyData.logo_url &&
                    companyData.logo_url !== "pending" ? (
                      <div className={styles["company-logo"]}>
                        <img
                          src={companyData.logo_url}
                          alt={`${companyData.name} logotyp`}
                        />
                      </div>
                    ) : (
                      <div className={styles["company-logo"]}>
                        <div>
                          
                        </div>
                      </div>
                    )}
                    <div className={styles["company-details"]}>
                      <h1>{companyData.name || ""}</h1>
                    </div>
                  </div>

                  <p className={styles.location}>
                    {companyData.location || ""}
                  </p>

                  <div className={styles.description}>
                    <p>{companyData.description || ""}</p>
                  </div>
                </div>

                {/* Website Button*/}
                {companyData.website && (
                  <a
                    className={styles.website}
                    href={companyData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formatWebsiteForDisplay(companyData.website)}
                  </a>
                )}

                {companyData.email && (
                  <div className={styles["profile-actions"]}>
                    <a
                      href={`mailto:${companyData.email}`}
                      className={styles["contact-button"]}
                    >
                      Kontakta företaget
                    </a>
                  </div>
                )}
              </div>

              {/* Position Cards Section */}
              <div className={styles["positions-section"]}>
                <PublicPositionCards
                  positions={positions}
                  positionSkills={positionSkills}
                  toggleCardExpanded={toggleCardExpanded}
                />
              </div>
            </>
          ) : (
            <div className={styles["no-profile"]}>
              <p>Företagsprofilen kunde inte hittas.</p>
            </div>
          )}
        </div>
      </div>
      {/* <PositionsBanner /> */}
      <PositionsBanner />
    </>
  );
}

// Public version of PositionCard component without edit functionality
function PublicPositionCards({
  positions,
  positionSkills,
  toggleCardExpanded,
}) {
  return (
    <div className="positions-section">
      <p className="title">Öppna LIA-platser</p>
      <p className="subTitle">Lediga platser inför LIA-perioden.</p>

      {positions.length > 0 ? (
        <div className="positions-grid">
          {positions.map((position) => (
            <div
              key={position.id}
              className="position-card"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCardExpanded(position.id);
              }}
              style={{ cursor: "pointer" }}
            >
              <article className="headerCard">
                <div className="subHeading">
                  <div className="headerTitle">
                    <Link
                      href={`/positions/${position.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {position.title}
                    </Link>
                  </div>

                  <p className="openPositions">
                    Antal platser: {position.spots}
                  </p>
                </div>
                {/* Arrow indicator for collapsed state */}
                {!position.softwareExpanded && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                {position.softwareExpanded && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{
                      transform: "rotate(180deg)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </article>

              {/* Display skills for this position */}
              {positionSkills[position.id] &&
                positionSkills[position.id].length > 0 && (
                  <div className="tagsContainer">
                    <div className="position-skills">
                      {/* Main skills section - only show title when expanded */}
                      {position.softwareExpanded && (
                        <section className="skillsHeader">
                          <h3 className="skills-title">Huvudkunskaper</h3>
                        </section>
                      )}
                      <div className="skillsGrid">
                        {positionSkills[position.id]
                          .filter((skill) => skill.type === "Skills")
                          .map((skill) => (
                            <button
                              key={skill.id}
                              type="button"
                              className="selectedSkillsButton"
                              disabled
                              onClick={(e) => e.stopPropagation()}
                            >
                              {skill.skills_name}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Tools/Software section with dropdown */}
                    {position.softwareExpanded &&
                      positionSkills[position.id].filter(
                        (skill) => skill.type === "Software"
                      ).length > 0 && (
                        <div
                          className="skillsSection"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="skillsHeader">
                            <h3 className="skills-title">Verktyg</h3>
                          </div>

                          <div className="skillsGrid">
                            {positionSkills[position.id]
                              .filter((skill) => skill.type === "Software")
                              .map((skill) => (
                                <button
                                  key={skill.id}
                                  type="button"
                                  className="selectedSkillsButton"
                                  disabled
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {skill.skills_name}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Count of tools when collapsed */}
                    {!position.softwareExpanded &&
                      positionSkills[position.id].filter(
                        (skill) => skill.type === "Software"
                      ).length > 0 && (
                        <div className="cardFooter">
                          Se{" "}
                          {
                            positionSkills[position.id].filter(
                              (skill) => skill.type === "Software"
                            ).length
                          }{" "}
                          verktyg
                        </div>
                      )}
                  </div>
                )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-positions">
          Det finns inga tillgängliga positioner för detta företag.
        </p>
      )}
    </div>
  );
}
