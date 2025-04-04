"use client";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import React from "react";
import "../popup.css";

export default function CreatePositionForm({ user, onClose }) {
  const [formData, setFormData] = useState({
    user_id: user.id,
    spots: 1,
  });

  const [selectedTable, setSelectedTable] = useState([]);

  const [skillsOptions, setSkillsOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);
  // Separate state for main skills and software
  const [selectedMainSkills, setSelectedMainSkills] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add states for skills and software expansion
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const [softwareExpanded, setSoftwareExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Insert into positions table
      const { data: insertData, error: insertError } = await supabase
        .from("positions")
        .insert(formData)
        .select(); // Use select to get the inserted record back

      if (insertError) throw insertError;

      console.log("Position inserted successfully", insertData);

      // Assuming insertData is an array with the inserted row
      const positionId = insertData[0].id;
      console.log(positionId);

      // Prepare skills data for insertion (combine both arrays)
      const allSelectedSkills = [...selectedMainSkills, ...selectedSoftware];

      const skillsToInsert = allSelectedSkills.map((skill) => ({
        position_id: positionId,
        skills_id: skill.id,
      }));

      // Insert into skills_digitaldesigner table
      const { data: skillsData, error: skillsError } = await supabase
        .from(selectedTable + "_skill_position")
        .insert(skillsToInsert);

      if (skillsError) throw skillsError;

      console.log("Skills inserted successfully");

      setTimeout(() => {
        if (typeof onClose === "function") {
          onClose();
        }
      }, 0);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function handleTitleChange(e) {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      title: e.target.value,
    }));
    setSelectedTable(e.target.name);
    try {

      const { data: skillData, error: skillsError } = await supabase
        .from("skills_" + e.target.name)
        .select("*")
        .eq("type", "Skills");

      const { data: softwareData, error: softwareError } = await supabase
        .from("skills_" + e.target.name)
        .select("*")
        .eq("type", "Software");

      if (skillsError || softwareError) {
        throw skillsError || softwareError;
      }
      console.log("Fetched data:", { skillData, softwareData });
      setSkillsOptions(skillData);
      setSoftwareOptions(softwareData);
      // Reset selected skills when changing title
      setSelectedMainSkills([]);
      setSelectedSoftware([]);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }

  function handleMainSkillToggle(skill) {
    setSelectedMainSkills((prevSkills) => {
      // Check if the skill is already selected
      const isAlreadySelected = prevSkills.some((s) => s.id === skill.id);

      if (isAlreadySelected) {
        // Remove the skill if it's already selected
        return prevSkills.filter((s) => s.id !== skill.id);
      } else {
        // Only add the skill if we haven't hit the limit of 3
        if (prevSkills.length < 3) {
          return [...prevSkills, skill];
        }
        // Otherwise, don't add it
        return prevSkills;
      }
    });
  }

  function handleSoftwareToggle(software) {
    setSelectedSoftware((prevSoftware) => {
      // Check if the software is already selected
      const isAlreadySelected = prevSoftware.some((s) => s.id === software.id);

      if (isAlreadySelected) {
        // Remove the software if it's already selected
        return prevSoftware.filter((s) => s.id !== software.id);
      } else {
        // Add the software if it's not already selected
        return [...prevSoftware, software];
      }
    });
  }

  // Helper functions to check if a skill is selected
  const isMainSkillSelected = (skillId) => {
    return selectedMainSkills.some((skill) => skill.id === skillId);
  };

  const isSoftwareSelected = (softwareId) => {
    return selectedSoftware.some((software) => software.id === softwareId);
  };

  return (
    <form className="contentWrapper" onSubmit={handleSubmit}>
      <div className="positionButtons">
        <h3 className="role-text">Roll</h3>
        <section className="tabs">
          <button
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
              className={formData.spots == number ? "activeTab" : "tab"}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

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
                ><img src={`/images/software-icons/${software.skills_name}.svg`} alt={software.skills_name} />
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
      <footer className="footer-positions">
        <button type="submit" className="submitButton">
          Lägg till position
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={(e) => {
            setTimeout(() => {
              if (typeof onClose === "function") {
                onClose();
              }
            }, 0);
          }}
        >
          Avbryt
        </button>
      </footer>
    </form>
  );
}
