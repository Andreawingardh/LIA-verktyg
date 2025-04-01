"use client";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import React from "react";
import styles from './position.module.css';

export default function CreatePositionForm({ user }) {
  const [formData, setFormData] = useState({
    user_id: user.id,
    spots: 1
  });

  const [selectedTable, setSelectedTable] = useState([]);

  const [skillsOptions, setSkillsOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const [selectedSkills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      // Prepare skills data for insertion
      const skillsToInsert = selectedSkills.map((skill) => ({
        position_id: positionId,
        skills_id: skill.id,
      }));

      // Insert into skills_digitaldesigner table
      const { data: skillsData, error: skillsError } = await supabase
        .from(selectedTable + "_skill_position")
        .insert(skillsToInsert);

      if (skillsError) throw skillsError;

      console.log("Skills inserted successfully");

      // Reset form or show success message
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
      setLoading(true);

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
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }

  function handleSkillToggle(skill) {
    setSkills((prevSkills) => {
      // Check if the skill is already selected
      const isAlreadySelected = prevSkills.some((s) => s.id === skill.id);
      
      if (isAlreadySelected) {
        // Remove the skill if it's already selected
        return prevSkills.filter((s) => s.id !== skill.id);
      } else {
        // Add the skill if it's not already selected
        return [...prevSkills, skill];
      }
    });
  }

  // Helper function to check if a skill is selected
  const isSkillSelected = (skillId) => {
    return selectedSkills.some((skill) => skill.id === skillId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        Welcome, {user.email} with id {user.id}
      </h2>
      <h2>Lägg in LIA-position</h2>
      <div className={styles.positionButtons}>
        <button
          className={formData.title === "Webbutvecklare" ? styles.activeButton : styles.button}
          name="webbutvecklare"
          value="Webbutvecklare"
          onClick={handleTitleChange}
        >
          Webbutvecklare
        </button>
        <button
          className={formData.title === "Digital designer" ? styles.activeButton : styles.button}
          name="digitaldesigner"
          value="Digital designer"
          onClick={handleTitleChange}
        >
          Digital designer
        </button>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Antal platser</label>
        <div className={styles.tabGroup}>
          {[1, 2, 3, 4, 5].map((number) => (
            <button
              key={number}
              type="button"
              name="spots"
              value={number}
              onClick={handleChange}
              className={formData.spots == number ? styles.activeTab : styles.tab}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {skillsOptions.length > 0 && (
        <div className={styles.skillsSection}>
          <h3>Huvudkunskaper</h3>
          <div className={styles.skillsGrid}>
            {skillsOptions.map((skill) => (
              <button
                key={skill.id}
                type="button"
                className={isSkillSelected(skill.id) ? styles.selectedSkillButton : styles.skillButton}
                onClick={() => handleSkillToggle(skill)}
              >
                {skill.skills_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {softwareOptions.length > 0 && (
        <div className={styles.skillsSection}>
          <h3>Verktyg</h3>
          <div className={styles.skillsGrid}>
            {softwareOptions.map((software) => (
              <button
                key={software.id}
                type="button"
                className={isSkillSelected(software.id) ? styles.selectedSkillButton : styles.skillButton}
                onClick={() => handleSkillToggle(software)}
              >
                {software.skills_name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button type="submit" className={styles.submitButton}>Lägg till position</button>
    </form>
  );
}