"use client";
import { supabase } from "@/utils/supabase/client";
import styling from "../page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CardCompany } from "../components/cards/CompanyCard-new";
import "./companies.css";
import { useRouter } from "next/navigation";
import "@/app/components/form/popup.css";
import { Button } from "../components/button/Button";
import "@/app/components/form/popup.css";
import "@/app/components/button/button.css";

export default function Companies() {
  const router = useRouter();

  const [companiesData, setCompaniesData] = useState([]);
  const [error, setError] = useState(null);
  const [skillsData, setSkillsData] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [selectedSkills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

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

  /*These functions handle search and filtering */
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
    setSkills([]);

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
      console.log(filteredCompanies);
    }
  }

  /* The functions handle scripts on the page */

  const toggleFilter = () => {
    setIsVisible((prev) => !prev);
  };

  const handleRefresh = () => {
    router.refresh(); // Only works in App Router (app/)
  };

  const cancelFilter = () => {
    setSkills([]);
    setIsVisible(false);
    handleRefresh();
  };

  if (error) {
    return <div>Error loading companies: {error.message}</div>;
  }

  return (
    <section className="content-wrapper">
      <h1>Hitta din nya LIA-plats</h1>
      <p>Filtrera och hitta matchande LIA-platser från anslutna företag.</p>
      <form className="input-wrapper" onSubmit={handleSearch}>
        <input placeholder="Sök efter företag" name="input-search" />
        <Button
          text="Sök"
          className="primary-button"
          hasIcon={true}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.33333 2.81543C4.66396 2.81543 2.5 4.97939 2.5 7.64876C2.5 10.3181 4.66396 12.4821 7.33333 12.4821C8.64044 12.4821 9.82637 11.9632 10.6964 11.1202C10.7113 11.0998 10.728 11.0803 10.7465 11.0619C10.7649 11.0435 10.7844 11.0268 10.8048 11.0118C11.6478 10.1418 12.1667 8.95587 12.1667 7.64876C12.1667 4.97939 10.0027 2.81543 7.33333 2.81543ZM11.7966 11.4049C12.6515 10.3901 13.1667 9.07958 13.1667 7.64876C13.1667 4.4271 10.555 1.81543 7.33333 1.81543C4.11167 1.81543 1.5 4.4271 1.5 7.64876C1.5 10.8704 4.11167 13.4821 7.33333 13.4821C8.76415 13.4821 10.0747 12.967 11.0895 12.112L13.6465 14.669C13.8417 14.8643 14.1583 14.8643 14.3536 14.669C14.5488 14.4737 14.5488 14.1572 14.3536 13.9619L11.7966 11.4049Z"
                fill="white"
              />
            </svg>
          }
          type="submit"
        ></Button>
      </form>

      <Button
        className="light-button"
        onClick={toggleFilter}
        text={isVisible ? "Stäng filtrering" : "Öppna filtrering"}
        hasIcon={true}
        rightIcon={
          isVisible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5rem"
              height="1.5rem"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.4697 8.46967C11.7626 8.17678 12.2374 8.17678 12.5303 8.46967L18.5303 14.4697C18.8232 14.7626 18.8232 15.2374 18.5303 15.5303C18.2374 15.8232 17.7626 15.8232 17.4697 15.5303L12 10.0607L6.53033 15.5303C6.23744 15.8232 5.76256 15.8232 5.46967 15.5303C5.17678 15.2374 5.17678 14.7626 5.46967 14.4697L11.4697 8.46967Z"
                fill="#0F1314"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5rem"
              height="1.5rem"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.46967 8.46967C5.76256 8.17678 6.23744 8.17678 6.53033 8.46967L12 13.9393L17.4697 8.46967C17.7626 8.17678 18.2374 8.17678 18.5303 8.46967C18.8232 8.76256 18.8232 9.23744 18.5303 9.53033L12.5303 15.5303C12.2374 15.8232 11.7626 15.8232 11.4697 15.5303L5.46967 9.53033C5.17678 9.23744 5.17678 8.76256 5.46967 8.46967Z"
                fill="#0F1314"
              />
            </svg>
          )
        }
      ></Button>
      {isVisible && (
        <section className="filter-settings-wrapper">
          <h4>Filtrera positioner</h4>
          <button
            name="webbutvecklare"
            value="Webbutvecklare"
            onClick={handleTitleChange}
            className="tabButton"
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
            /* @TODO: Set toggle to show all tags and less tags */
            <div className="skillsSection tags-container">
              <h3>Huvudkunskaper</h3>
              <div className="skillsGrid">
                {skillsData
                  .filter((item) => item.type === "Skills")
                  .map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      className={
                        isSkillSelected(skill.id)
                          ? "selectedSkillButton"
                          : "skillButton"
                      }
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill.skills_name}
                    </button>
                  ))}
              </div>
              <div>Visa flera</div>
            </div>
          )}

          {skillsData.length > 0 && (
            <div className="skillsSection tags-container">
              <h3>Verktyg</h3>
              <div className="skillsGrid">
                {skillsData
                  .filter((item) => item.type === "Software") // Only include items with type "skills"
                  .map((software) => (
                    <button
                      key={software.id}
                      type="button"
                      className={
                        isSkillSelected(software.id)
                          ? "selectedSkillButton"
                          : "skillButton"
                      }
                      onClick={() => handleSkillToggle(software)}
                    ><img src={`/images/software-icons/${software.skills_name}.svg`} alt={software.skills_name} />
                      {software.skills_name}
                    </button>
                  ))}
              </div>
              <div>Visa flera</div>
            </div>
          )}
          <button onClick={cancelFilter}>Nollställ filtrering</button>
        </section>
      )}
      <section className="companies-list">
        <h1>Matchande företag</h1>
        {filteredCompanies.map((company) => (
          <div key={company.id} className="card-company matching">
            <CardCompany
              logoUrl={company.logoUrl}
              applyNowClassName="card-company-2"
              className="card-company-instance"
              company={company.name}
              headerClassName="design-component-instance-node"
              location={company.location}
              statusProperty="internship-matching"
              // statusProperty= {company.position_count > 0 ?"positions-open" : "application-closed" }
              id={company.id}
              companyPositions={
                company.position_count
                  ? company.position_count + " lediga positioner"
                  : ""
              }
              showApply={true}
              showLogotype={true}
            />

            {/* <Link href={`/companies/${company.id}`}>
              {company.name}: Currently
              {company.position_count ? company.position_count : 0} positions
            </Link> */}
          </div>
        ))}
        <h2>Alla företag</h2>
        {companiesData.map((company) => (
          <div key={company.id}>
            <CardCompany
              logoUrl={company.logo_url}
              applyNowClassName="card-company-2"
              className="card-company-instance"
              company={company.name}
              headerClassName="design-component-instance-node"
              id={company.id}
              location={company.location}
              statusProperty="positions-open"
              showLogotype={company.logo_url != null ? true : false}
              companyPositions={
                company.position_count
                  ? company.position_count + " lediga positioner"
                  : ""
              }
              showApply={company.position_count > 0 ? true : false}
            />
          </div>
        ))}
      </section>
    </section>
  );
}
