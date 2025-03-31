"use client";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import { useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { useStyleRegistry } from "styled-jsx";
import { useSupabaseAuth } from "@/hook/useSupabaseAuth";

export default function CreateListingForm({ user }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        user_id: user.id,
        // other initial form fields
    });
    console.log(formData);
    
    const [selectedTable, setSelectedTable] = useState([])

  const [skillsOptions, setSkillsOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const [selectedSkills, setSkills] = useState([]);

  //   const [lastPositionId, setLastPositionId] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         setLoading(true);
  //         const { data: toolsData, error: toolsError } = await supabase
  //           .from("skills_webbutvecklare")
  //           .select("*");

  //         const { data: digitalDesignerData, error: skillsError } = await supabase
  //           .from("skills_digitaldesigner")
  //           .select("*");

  //         if (toolsError || skillsError) throw error;

  //         setSkillsOptions(digitalDesignerData); // Store all skills in options
  //         setLoading(false);
  //       } catch (err) {
  //         setError(err);
  //         setLoading(false);
  //       }
  //     };

  //     fetchData();
  //   }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

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
        console.log(positionId)

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
      setSelectedTable(e.target.name)
    try {
      setLoading(true);

      const { data: skillData, error: skillsError } = await supabase
        .from("skills_" + e.target.name)
        .select("*")
        .eq("type", "Skills");

      const { data: softwareData, error: softwareError } = await supabase
        .from("skills_" + e.target.name)
        .select("*")
        .eq("type", "Software"); // Changed to query for software type

      if (skillsError || softwareError) {
        // Throw the actual errors
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

  function setSkillsChange(e) {
    const { value, checked } = e.target;
    const skillId = parseInt(e.target.dataset.skillId); // Get the skill ID from a data attribute

    if (checked) {
      // Find the full skill object from skillsOptions
      const skillObject = skillsOptions.find((skill) => skill.id === skillId);
      setSkills((prevSkills) => [...prevSkills, skillObject]);
    } else {
      setSkills((prevSkills) =>
        prevSkills.filter((skill) => skill.id !== skillId)
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        Welcome, {user.email} with id {user.id}
      </h2>
      <h2>Lägg in LIA-position</h2>
      <button name="webbutvecklare" value="Webbutvecklare" onClick={handleTitleChange}>
        Webbutvecklare
      </button>
      <button name="digitaldesigner" value="Digital designer" onClick={handleTitleChange}>
        Digital designer
      </button>
      <label htmlFor="spots">Antal platser</label>
      <select
        name="spots"
        value={formData.spots}
        onChange={handleChange}
        required
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <ul>
        {console.log({ skilloptions: selectedSkills })}
        <label>Huvudkunskaper</label>
        {skillsOptions.map((skill) => (
          <li key={skill.id}>
            <input
              type="checkbox"
              id={`skill-${skill.id}`}
              name="skills"
              value={skill.skills_name}
              data-skill-id={skill.id} // Add the skill ID as a data attribute
              onChange={setSkillsChange}

            />
            <label htmlFor={`skill-${skill.id}`}>{skill.skills_name}</label>
          </li>
        ))}
      </ul>
      <ul>
        <label>Verktyg</label>
        {softwareOptions.map((software) => (
          <li key={software.id}>
            <input
              type="checkbox"
              id={`skill-${software.id}`}
              name="skills"
              value={software.skills_name}
              data-skill-id={software.id} // Add the skill ID as a data attribute
              onChange={setSkillsChange}
            />
            <label htmlFor={`skill-${software.id}`}>
              {software.skills_name}
            </label>
          </li>
        ))}
      </ul>

      <button type="submit">Submit</button>
    </form>
  );
}
