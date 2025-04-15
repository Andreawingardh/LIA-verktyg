import { supabase } from "../../../utils/supabase/client";
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";
import "./positioncard.css";
import RemovePositionButton from "../buttons/RemovePositionButton";
import EditPositionOverlay from "../profile/EditPositionOverlay";
import AddPositionButton from "../profile/addPositionButton";

export default function PositionCard() {
  const [positions, setPositions] = useState([]);
  const { user, loading: authLoading } = useSupabaseAuth();
  const [error, setError] = useState("");
  const [positionSkills, setPositionSkills] = useState({});
  const [editingPositionId, setEditingPositionId] = useState(null);
  const [editOverlayOpen, setEditOverlayOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    if (user && !authLoading) {
      fetchPositions();
    }
  }, [user, authLoading]);

  const fetchPositions = async () => {
    try {
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from("positions")
        .select("*")
        .eq("user_id", user.id);

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
      setError("Kunde inte hämta kunskaper för positioner");
    }
  };

  const refreshPositions = () => {
    fetchPositions();
    setEditOverlayOpen(false);
  };

  const toggleCardExpanded = (positionId) => {
    // Don't toggle if currently editing
    if (editingPositionId === positionId || editOverlayOpen) {
      return;
    }

    setPositions((prevPositions) =>
      prevPositions.map((pos) =>
        pos.id === positionId
          ? { ...pos, softwareExpanded: !pos.softwareExpanded }
          : pos
      )
    );
  };
  
  const handleEditClick = (position, e) => {
    e.stopPropagation();
    setSelectedPosition(position);
    setEditOverlayOpen(true);
  };

  return (
    <div className="positions-section">
      <p className="title">Öppna LIA-platser</p>
      <p className="subTitle">Våra lediga platser inför LIA-perioden i november.</p>

      {positions.length > 0 ? (
        <div className="positions-grid">
          {positions.map((position) => (
            <div
              key={position.id}
              className="position-card"
              onClick={() => toggleCardExpanded(position.id)}
              style={{ cursor: "pointer" }}
            >
              <article className="headerCard">
                <div className="subHeading">
                  <h3 className="headerTitle">{position.title}</h3>

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
                      positionSkills[position.id].filter(skill => skill.type === "Software").length > 0 && (
                        <div className="cardFooter">
                          Se {positionSkills[position.id].filter(skill => skill.type === "Software").length} valda verktyg och redigera
                        </div>
                    )}
  
                    {/* Only show action buttons when card is expanded */}
                    {position.softwareExpanded && (
                      <div className="button-footer">
                        <div
                          className="position-actions"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <button
                            className="secondary-button"
                          onClick={(e) => handleEditClick(position, e)}
                          aria-label="Redigera position"
                          >
                            Redigera
                          </button>
                        </div>
                        <div
                          className="position-actions"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <RemovePositionButton
                            position={position}
                            onPositionUpdate={refreshPositions}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}            
            </div>
          ))}
        </div>
      ) : (
        <p className="no-positions">
          Du har inte lagt till några positioner ännu. Använd Lägg till
          position för att skapa din första position.
        </p>
      )}
      
      {/* Add Position Button */}
      <div className="add-position-container">
        <AddPositionButton 
          companyId={user?.id} 
          onProfileUpdate={refreshPositions} 
        />
      </div>
      
      {/* Edit Position Overlay */}
      <EditPositionOverlay
        isOpen={editOverlayOpen}
        onClose={() => setEditOverlayOpen(false)}
        position={selectedPosition}
        onPositionUpdate={refreshPositions}
      />
    </div>
  );
}