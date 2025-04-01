"use client";
import { supabase } from "@/utils/supabase/client";
import styling from "../page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../components/form/position/position.module.css";

export default function Companies() {
  const [companiesData, setCompaniesData] = useState([]);
  const [error, setError] = useState(null);
  const [skillsData, setSkillsData] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [selectedSkills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from("companies").select("*");
        // const { data: webbutvecklareSkills, error: webbutvecklareError } =
        //   await supabase.from("skills_webbutvecklare").select();
        // const { data: digitaldesignerSkills, error: digitaldesignerError } =
        //   await supabase.from("skills_digitaldesigner").select();
        if (error) {
          setError(error);
          return;
        }
        // setSkillsData({
        //   webbutvecklare: webbutvecklareSkills,
        //   digitaldesigner: digitaldesignerSkills,
        // });
        setCompaniesData(data || []);
      } catch (e) {
        setError(e);
        console.error(e);
      }
    }

    fetchData();
  }, []); // Empty dependency array means this runs once on component mount

  async function handleSearch(e) {
    e.preventDefault();
    const searchValues = e.target.elements[0].value;
    const { data, error } = await supabase
      .from("companies")
      .select()
      .textSearch("name", searchValues);
    console.log(data);
    setCompaniesData(data);
  }

  async function handleTitleChange(e) {
    e.preventDefault();
    setSkills([])

    setSelectedTable(e.target.name);
    try {
      setLoading(true);

      const { data: skillData, error: skillsError } = await supabase
        .from("skills_" + e.target.name)
        .select("*");

      if (skillsError) {
        // Throw the actual errors
        throw skillsError;
      }
      console.log("Fetched data:", { skillData });
      setSkillsData(skillData);
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
    fetchCompaniesWithMatchingPositions();
  }

  const isSkillSelected = (skillId) => {
    return selectedSkills.some((skill) => skill.id === skillId);
  };

  async function fetchCompaniesWithMatchingPositions() {
    // Define the skill ID you want to check

    const skillIds = selectedSkills.map((skill) => skill.id);

    // Step 1: Fetch positions that match the skill ID through the webbutvecklare_skill_id table
    const { data: positions, error: positionsError } = await supabase
      .from("webbutvecklare_skill_position") // Assuming this is the linking table
      .select("positions(*)") // Fetch positions related to the skill
      .in("skills_id", skillIds); // Assuming 'skill_id' is the column in the linking table

    console.log({ matchingpositions: positions });
    if (positionsError) {
      console.error("Error fetching positions:", positionsError);
    } else {
      // Step 2: Extract user_ids from the positions
      const userIds = positions
        .filter((item) => item.positions && item.positions.user_id)
        .map((item) => item.positions.user_id); // Extract user_ids from positions

      // Step 3: Fetch companies for the retrieved user_ids
      const { data: matchingCompanies, error: companiesError } = await supabase
        .from("companies")
        .select("*")
        .in("user_id", userIds); // Fetch companies where user_id matches

      console.log({ matchingcompanies: matchingCompanies });
      if (companiesError) {
        console.error("Error fetching companies:", companiesError);
        // } else {
        //   // Combine positions with their corresponding companies
        //   const combinedData = positions.flatMap(position =>
        //     position.positions.map(pos => {
        //       const company = companies.find(company => company.user_id === pos.user_id);
        //       return {
        //         ...pos,
        //         company: company ? company : null, // Attach company data to position
        //       };
        //     }
        // )
        //   );
      }
      setFilteredCompanies(matchingCompanies);
      console.log(filteredCompanies)

   
    }
  }

  if (error) {
    return <div>Error loading companies: {error.message}</div>;
  }

  console.log(selectedSkills);
  console.log(filteredCompanies);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Hitta din nya LIA-plats</h1>
        <p>Filtrera och hitta matchande LIA-platser från anslutna företag.</p>
        <form onSubmit={handleSearch}>
          <input placeholder="Sök efter företag" name="input-search" />
          <button type="submit">Sök</button>
          <button
            name="webbutvecklare"
            value="Webbutvecklare"
            onClick={handleTitleChange}
            className={styles.tabButton}
          >
            Webbutvecklare
          </button>
          <button
            name="digitaldesigner"
            value="Digital designer"
            onClick={handleTitleChange}
          >
            Digital designer
          </button>

          {skillsData.length > 0 && (
            <div className={styles.skillsSection}>
              <h3>Huvudkunskaper</h3>
              <div className={styles.skillsGrid}>
                {skillsData
                  .filter((item) => item.type === "Skills")
                  .map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      className={
                        isSkillSelected(skill.id)
                          ? styles.selectedSkillButton
                          : styles.skillButton
                      }
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill.skills_name}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {skillsData.length > 0 && (
            <div className={styles.skillsSection}>
              <h3>Verktyg</h3>
              <div className={styles.skillsGrid}>
                {skillsData
                  .filter((item) => item.type === "Software") // Only include items with type "skills"
                  .map((software) => (
                    <button
                      key={software.id}
                      type="button"
                      className={
                        isSkillSelected(software.id)
                          ? styles.selectedSkillButton
                          : styles.skillButton
                      }
                      onClick={() => handleSkillToggle(software)}
                    >
                      {software.skills_name}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* <ul>
            {skillsData &&
              skillsData
                .filter((item) => item.type === "Skills") // Only include items with type "skills"
                .map((skill) => <li key={skill.id}>{skill.skills_name}</li>)}
          </ul>
          <label>Verktyg</label>
          <ul>
            {skillsData &&
              skillsData
                .filter((item) => item.type === "Software") // Only include items with type "skills"
                .map((skill) => <li key={skill.id}>{skill.skills_name}</li>)}
          </ul> */}
        </form>
        <h1>Matchande företag</h1>
        {filteredCompanies.map((company) => (
          <div key={company.id}>
            <Link href={`/companies/${company.id}`}>{company.name}:</Link>
            <p>Currently
            {company.position_count ? company.position_count : 0} positions</p>
            <p>Matches with you</p>
          </div>
        ))}
        <h2>Alla företag</h2>
        {companiesData.map((company) => (
          <p key={company.id}>
            <Link href={`/companies/${company.id}`}>
              {company.name}: Currently
              {company.position_count ? company.position_count : 0} positions
            </Link>
          </p>
        ))}
      </main>
    </div>
  );
}
