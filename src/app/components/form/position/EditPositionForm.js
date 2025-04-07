"use client";
import { supabase } from "@/utils/supabase/client";
import { useState, useEffect, useRef } from "react";
import React from "react";
import "../popup.css";

export default function EditPositionForm({
  position,
  onPositionUpdate,
  onClose,
}) {
  const [formData, setFormData] = useState({
    id: position?.id || "",
    user_id: position?.user_id || "",
    title: position?.title || "",
    spots: position?.spots || 1,
  });

  const [selectedTable, setSelectedTable] = useState("");
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const [selectedMainSkills, setSelectedMainSkills] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const [softwareExpanded, setSoftwareExpanded] = useState(false); 
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  
  const initializedRef = useRef(false);

  
  useEffect(() => {
    console.log("Current state - selectedMainSkills:", selectedMainSkills);
  }, [selectedMainSkills]);

  useEffect(() => {
    console.log("Current state - selectedSoftware:", selectedSoftware);
  }, [selectedSoftware]);

 
  useEffect(() => {
    if (position && position.id && !initializedRef.current) {
      console.log("Loading position data:", position);
      initializedRef.current = true;

      
      setFormData({
        id: position.id,
        user_id: position.user_id,
        title: position.title,
        spots: position.spots || 1,
      });

   
      const tableName = getTableNameFromTitle(position.title);
      console.log("Determined table name:", tableName);

      setSelectedTable(tableName);

      
      if (tableName) {
        loadPositionData(tableName);
      } else {
        console.error(
          "Could not determine table name from position title:",
          position.title
        );
        setLoading(false);
      }
    }
  }, [position]);

 
  const getTableNameFromTitle = (title) => {
    if (title === "Webbutvecklare") return "webbutvecklare";
    if (title === "Digital designer") return "digitaldesigner";
    return "";
  };

  
  const loadPositionData = async (tableName) => {
    try {
      setLoading(true);
      console.log(
        `Loading position data for position ID ${position.id} from table ${tableName}`
      );

     
      await loadSkillsOptions(tableName);

     
      const { data: positionSkills, error: skillsError } = await supabase
        .from(`${tableName}_skill_position`)
        .select(
          `
          skills_id,
          skills_${tableName}(*)
        `
        )
        .eq("position_id", position.id);

      if (skillsError) {
        console.error("Error fetching position skills:", skillsError);
        throw skillsError;
      }

      console.log(
        `Fetched ${positionSkills?.length || 0} position skills:`,
        positionSkills
      );

      
      const mainSkills = [];
      const software = [];

      if (positionSkills && positionSkills.length > 0) {
        positionSkills.forEach((item) => {
          const skill = item[`skills_${tableName}`];
          if (skill) {
            if (skill.type === "Skills") {
              if (mainSkills.length < 3) {
                mainSkills.push(skill);
              }
            } else if (skill.type === "Software") {
              software.push(skill);
            }
          }
        });
      }

      console.log("Parsed main skills:", mainSkills);
      console.log("Parsed software:", software);

      setSelectedMainSkills(mainSkills);
      setSelectedSoftware(software);
    } catch (err) {
      console.error("Error loading position data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSkillsOptions = async (tableName) => {
    try {
      console.log(`Loading skills options from skills_${tableName}`);

      const { data: skillData, error: skillsError } = await supabase
        .from(`skills_${tableName}`)
        .select("*")
        .eq("type", "Skills");

      const { data: softwareData, error: softwareError } = await supabase
        .from(`skills_${tableName}`)
        .select("*")
        .eq("type", "Software");

      if (skillsError) {
        console.error("Error fetching skills:", skillsError);
        throw skillsError;
      }

      if (softwareError) {
        console.error("Error fetching software:", softwareError);
        throw softwareError;
      }

      console.log(
        `Fetched ${skillData?.length || 0} skills and ${
          softwareData?.length || 0
        } software options`
      );

      setSkillsOptions(skillData || []);
      setSoftwareOptions(softwareData || []);
    } catch (err) {
      console.error("Error loading skills options:", err);
      setError(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      alert("Du måste välja en roll");
      return;
    }

    if (!selectedTable) {
      alert("Ett fel uppstod. Kontrollera rollval.");
      return;
    }

    if (selectedMainSkills.length > 3) {
      alert("Du kan bara välja max 3 huvudkunskaper.");
      return;
    }

    try {
      setIsSaving(true);
      console.log("Submitting position update with data:", formData);
      console.log("Selected skills:", selectedMainSkills);
      console.log("Selected software:", selectedSoftware);

      const transaction = async () => {
        const { data: updateData, error: updateError } = await supabase
          .from("positions")
          .update({
            title: formData.title,
            spots: formData.spots,
          })
          .eq("id", position.id)
          .select();

        if (updateError) {
          console.error("Error updating position:", updateError);
          throw updateError;
        }

        console.log("Position record updated successfully:", updateData);

        const { error: deleteError } = await supabase
          .from(`${selectedTable}_skill_position`)
          .delete()
          .eq("position_id", position.id);

        if (deleteError) {
          console.error("Error deleting existing skills:", deleteError);
          throw deleteError;
        }

        console.log("Deleted existing skill associations");

        const { data: remainingSkills, error: verifyError } = await supabase
          .from(`${selectedTable}_skill_position`)
          .select()
          .eq("position_id", position.id);

        if (verifyError) {
          console.error("Error checking remaining skills:", verifyError);
        }

        if (remainingSkills && remainingSkills.length > 0) {
          console.warn(
            "Some skills may not have been deleted:",
            remainingSkills
          );
        } else {
          console.log("Verified all existing skill associations were deleted");
        }

        const limitedMainSkills = selectedMainSkills.slice(0, 3);
        const allSelectedSkills = [...limitedMainSkills, ...selectedSoftware];

        if (allSelectedSkills.length > 0) {
          const skillsToInsert = allSelectedSkills.map((skill) => ({
            position_id: position.id,
            skills_id: skill.id,
          }));

          console.log(
            `Inserting ${skillsToInsert.length} skills:`,
            skillsToInsert
          );

          const { data: insertedSkills, error: skillsError } = await supabase
            .from(`${selectedTable}_skill_position`)
            .insert(skillsToInsert)
            .select();

          if (skillsError) {
            console.error("Error inserting skills:", skillsError);
            throw skillsError;
          }

          console.log("Skills inserted successfully:", insertedSkills);

          const { data: finalSkills, error: verifyInsertError } = await supabase
            .from(`${selectedTable}_skill_position`)
            .select(
              `
              skills_id,
              skills_${selectedTable}(*)
            `
            )
            .eq("position_id", position.id);

          if (verifyInsertError) {
            console.error(
              "Error verifying skill insertion:",
              verifyInsertError
            );
          } else {
            console.log("Verified skills were inserted:", finalSkills);

            if (finalSkills.length !== skillsToInsert.length) {
              console.warn("Not all skills were inserted correctly");
            }
          }
        } else {
          console.log("No skills to insert");
        }

        return { success: true, position: updateData[0] };
      };

      const result = await transaction();

      if (result.success) {
        setSuccessMessage("Positionen har uppdaterats");

        if (onPositionUpdate && typeof onPositionUpdate === "function") {
          console.log("Calling onPositionUpdate callback with updated data");

          onPositionUpdate({
            ...position,
            ...formData,
            mainSkills: selectedMainSkills.slice(0, 3),
            software: selectedSoftware,
            updatedAt: new Date().toISOString(),
          });
        } else {
          console.warn("onPositionUpdate is not a function or not provided");
        }
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating position:", error);
      alert(
        "Ett fel uppstod när positionen skulle uppdateras: " + error.message
      );
      setError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setIsSaving(true);
      console.log(`Deleting position ID: ${position.id}`);

      const { data, error } = await supabase.rpc(
        "delete_position_in_all_tables",
        { delete_position: position.id }
      );

      if (error) {
        console.error("Error deleting position:", error);
        throw error;
      }

      console.log("Position and related entries deleted successfully");

  
      setSuccessMessage("Positionen har tagits bort");

      if (onPositionUpdate && typeof onPositionUpdate === "function") {
        console.log("Calling onPositionUpdate callback after deletion");
        onPositionUpdate(null);
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error deleting position:", error);
      alert("Ett fel uppstod när positionen skulle tas bort: " + error.message);
      setError(error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field change: ${name} = ${value}`);

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTitleChange = async (e) => {
    e.preventDefault();
    const newTitle = e.target.value;
    const newTableName = e.target.name;

    console.log(`Changing title to: ${newTitle}, table name: ${newTableName}`);

    setFormData((prevState) => ({
      ...prevState,
      title: newTitle,
    }));

    setSelectedTable(newTableName);

    try {

      await loadSkillsOptions(newTableName);

      if (position.title !== newTitle) {
        console.log("Role changed, resetting selected skills");
        setSelectedMainSkills([]);
        setSelectedSoftware([]);
      }
    } catch (err) {
      console.error("Error in handleTitleChange:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMainSkillToggle = (skill) => {
    setSelectedMainSkills((prevSkills) => {
      const isAlreadySelected = prevSkills.some((s) => s.id === skill.id);

      if (isAlreadySelected) {
        const newSkills = prevSkills.filter((s) => s.id !== skill.id);
        console.log(
          `Removed skill: ${skill.skills_name}, New skills:`,
          newSkills
        );
        return newSkills;
      } else {
        if (prevSkills.length < 3) {
          const newSkills = [...prevSkills, skill];
          console.log(
            `Added skill: ${skill.skills_name}, New skills:`,
            newSkills
          );
          return newSkills;
        } else {
          alert("Du kan välja max 3 huvudkunskaper");
          return prevSkills;
        }
      }
    });
  };
  const handleSoftwareToggle = (software) => {
    setSelectedSoftware((prevSoftware) => {
      const isAlreadySelected = prevSoftware.some((s) => s.id === software.id);

      if (isAlreadySelected) {
        const newSoftware = prevSoftware.filter((s) => s.id !== software.id);
        console.log(
          `Removed software: ${software.skills_name}, New software:`,
          newSoftware
        );
        return newSoftware;
      } else {
        const newSoftware = [...prevSoftware, software];
        console.log(
          `Added software: ${software.skills_name}, New software:`,
          newSoftware
        );
        return newSoftware;
      }
    });
  };
  const isMainSkillSelected = (skillId) => {
    return selectedMainSkills.some((skill) => skill.id === skillId);
  };

  const isSoftwareSelected = (softwareId) => {
    return selectedSoftware.some((software) => software.id === softwareId);
  };

  if (loading) {
    return <div className="loading">Laddar...</div>;
  }

  return (
    <form className="contentWrapper" onSubmit={handleSubmit}>
      {/* Success message */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {/* Role selection */}
      <div className="positionButtons">
        <h3 className="role-text">Roll</h3>
        <section className="tabs">
          <button
            type="button"
            className={
              formData.title === "Webbutvecklare" ? "activeButton" : "button"
            }
            name="webbutvecklare"
            value="Webbutvecklare"
            onClick={handleTitleChange}
          >
            Webbutvecklare
          </button>
          <button
            type="button"
            className={
              formData.title === "Digital designer" ? "activeButton" : "button"
            }
            name="digitaldesigner"
            value="Digital designer"
            onClick={handleTitleChange}
          >
            Digital designer
          </button>
        </section>
      </div>

      {/* Number of spots */}
      <div className="formGroup">
        <label className="formLabel">Antal platser</label>
        <div className="tabGroup">
          {[1, 2, 3, 4, 5].map((number) => (
            <button
              key={number}
              type="button"
              name="spots"
              value={number}
              onClick={handleChange}
              className={
                Number(formData.spots) === number ? "activeTab" : "tab"
              }
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* Main skills selection */}
      {skillsOptions.length > 0 && (
        <div className="skillsSection">
          <section className="skillsHeader">
            <h3 className="skills-title">Huvudkunskaper</h3>
            <span className="skillsPicked">{selectedMainSkills.length}/3</span>
          </section>
          <div
            className={`skills-container ${skillsExpanded ? "expanded" : ""}`}
          >
            <div className="skillsGrid">
              {skillsOptions.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  className={
                    isMainSkillSelected(skill.id)
                      ? "selectedSkillButton"
                      : "skillButton"
                  }
                  onClick={() => handleMainSkillToggle(skill)}
                  disabled={
                    selectedMainSkills.length >= 3 &&
                    !isMainSkillSelected(skill.id)
                  }
                >
                  {skill.skills_name}
                  {isMainSkillSelected(skill.id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.64645 3.64645C3.84171 3.45118 4.15829 3.45118 4.35355 3.64645L8 7.29289L11.6464 3.64645C11.8417 3.45118 12.1583 3.45118 12.3536 3.64645C12.5488 3.84171 12.5488 4.15829 12.3536 4.35355L8.70711 8L12.3536 11.6464C12.5488 11.8417 12.5488 12.1583 12.3536 12.3536C12.1583 12.5488 11.8417 12.5488 11.6464 12.3536L8 8.70711L4.35355 12.3536C4.15829 12.5488 3.84171 12.5488 3.64645 12.3536C3.45118 12.1583 3.45118 11.8417 3.64645 11.6464L7.29289 8L3.64645 4.35355C3.45118 4.15829 3.45118 3.84171 3.64645 3.64645Z"
                        fill="#283236"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.00015 2.83301C8.27629 2.83301 8.50015 3.05687 8.50015 3.33301V7.49966H12.6668C12.943 7.49966 13.1668 7.72352 13.1668 7.99966C13.1668 8.27581 12.943 8.49966 12.6668 8.49966H8.50015V12.6663C8.50015 12.9425 8.27629 13.1663 8.00015 13.1663C7.72401 13.1663 7.50015 12.9425 7.50015 12.6663V8.49966H3.3335C3.05735 8.49966 2.8335 8.27581 2.8335 7.99966C2.8335 7.72352 3.05735 7.49966 3.3335 7.49966H7.50015V3.33301C7.50015 3.05687 7.72401 2.83301 8.00015 2.83301Z"
                        fill="#495B62"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            {!skillsExpanded && skillsOptions.length > 6 && (
              <div className="skills-fade"></div>
            )}
          </div>

          {skillsOptions.length > 6 && (
            <button
              type="button"
              onClick={() => setSkillsExpanded(!skillsExpanded)}
              className={`show-more-btn ${skillsExpanded ? "expanded" : ""}`}
            >
              {skillsExpanded ? "Visa färre" : "Visa flera"}
            </button>
          )}
        </div>
      )}

      {/* Software selection */}
      {softwareOptions.length > 0 && (
        <div className="skillsSection">
          <h3 className="skills-title">Verktyg</h3>
          <div
            className={`skills-container ${softwareExpanded ? "expanded" : ""}`}
          >
            <div className="skillsGrid">
              {softwareOptions.map((software) => (
                <button
                  key={software.id}
                  type="button"
                  className={
                    isSoftwareSelected(software.id)
                      ? "selectedSkillButton"
                      : "skillButton"
                  }
                  onClick={() => handleSoftwareToggle(software)}
                >
                  {software.skills_name}
                  {isSoftwareSelected(software.id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.64645 3.64645C3.84171 3.45118 4.15829 3.45118 4.35355 3.64645L8 7.29289L11.6464 3.64645C11.8417 3.45118 12.1583 3.45118 12.3536 3.64645C12.5488 3.84171 12.5488 4.15829 12.3536 4.35355L8.70711 8L12.3536 11.6464C12.5488 11.8417 12.5488 12.1583 12.3536 12.3536C12.1583 12.5488 11.8417 12.5488 11.6464 12.3536L8 8.70711L4.35355 12.3536C4.15829 12.5488 3.84171 12.5488 3.64645 12.3536C3.45118 12.1583 3.45118 11.8417 3.64645 11.6464L7.29289 8L3.64645 4.35355C3.45118 4.15829 3.45118 3.84171 3.64645 3.64645Z"
                        fill="#283236"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.00015 2.83301C8.27629 2.83301 8.50015 3.05687 8.50015 3.33301V7.49966H12.6668C12.943 7.49966 13.1668 7.72352 13.1668 7.99966C13.1668 8.27581 12.943 8.49966 12.6668 8.49966H8.50015V12.6663C8.50015 12.9425 8.27629 13.1663 8.00015 13.1663C7.72401 13.1663 7.50015 12.9425 7.50015 12.6663V8.49966H3.3335C3.05735 8.49966 2.8335 8.27581 2.8335 7.99966C2.8335 7.72352 3.05735 7.49966 3.3335 7.49966H7.50015V3.33301C7.50015 3.05687 7.72401 2.83301 8.00015 2.83301Z"
                        fill="#495B62"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            {!softwareExpanded && softwareOptions.length > 6 && (
              <div className="skills-fade"></div>
            )}
          </div>

          {softwareOptions.length > 6 && (
            <button
              type="button"
              onClick={() => setSoftwareExpanded(!softwareExpanded)}
              className={`show-more-btn ${softwareExpanded ? "expanded" : ""}`}
            >
              {softwareExpanded ? "Visa färre" : "Visa flera"}
            </button>
          )}
        </div>
      )}

      {/* Form buttons */}
      <footer className="footer-positions">
        <button type="submit" className="submitButton" disabled={isSaving}>
          {isSaving ? "Sparar..." : "Spara ändringar"}
        </button>
        <button
          type="button"
          className="deleteButton"
          onClick={handleDelete}
          disabled={isSaving}
        >
          {confirmDelete ? "Bekräfta borttagning" : "Ta bort position"}
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
          disabled={isSaving}
        >
          Avbryt
        </button>
      </footer>
    </form>
  );
}