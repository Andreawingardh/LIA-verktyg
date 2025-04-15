"use client";
import { supabase } from "@/utils/supabase/client";
import styling from "../page.module.css";
import { useState, useEffect } from "react";
import { CardCompany } from "../components/cards/CompanyCard";
import "./companies.css";
import { useRouter } from "next/navigation";
import "@/app/components/form/popup.css";
import { Button } from "../components/buttons/Button";
import "@/app/components/form/popup.css";
import "@/app/components/buttons/button.css";
import "@/app/components/form/popup.css";
import CreateCompanyProfileBanner from "../components/cards/CreateCompanyProfileBanner";
import { useDebouncedCallback } from 'use-debounce';

export default function Companies() {
  const router = useRouter();

  const [companiesData, setCompaniesData] = useState([]);
  const [error, setError] = useState(null);
  const [skillsData, setSkillsData] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [selectedSkills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [skillsExpanded, setSkillsExpanded] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchCompaniesWithMatchingPositions();
  }, [selectedSkills]);

  async function fetchData() {
    try {
      const { data, error } = await supabase.from("companies").select("*");

      if (error) {
        setError(error);
        return;
      }

      setCompaniesData(data || []);
    } catch (e) {
      setError(e);
      console.error(e);
    }
  }

  /*These functions handle search and filtering */
  async function handleSearch(e) {
    setLoading(true);
    e.preventDefault();

    try {
      const searchValues = e.target.elements[0].value.trim() + ":*";
      console.log(searchValues);
      const { data: searchData, error } = await supabase
        .from("companies")
        .select()
        .textSearch("name", searchValues);

      if (error) throw new Error();

      console.log(searchData);
      setCompaniesData(searchData);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  }

  const handleSearchInputChange = async (e) => {
    // If the input is empty, fetch all companies
    if (!e.target.value.trim()) {
      fetchData();
    }
  };

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

      setSkillsData(skillData);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }

  function handleSkillToggle(skill) {
    setSkills(prevSkills => {
      const isAlreadySelected = prevSkills.some(s => s.id === skill.id);
      
      const newSkills = isAlreadySelected
        ? prevSkills.filter(s => s.id !== skill.id)
        : [...prevSkills, skill];
      
      return newSkills;
    });
  }

  const isSkillSelected = (skillId) => {
    return selectedSkills.some((skill) => skill.id === skillId);
  };

  const fetchCompaniesWithMatchingPositions = useDebouncedCallback(async () => {
    if (selectedSkills.length === 0) {
      setFilteredCompanies([]);
      return;
    }

    try {
      setLoading(true);
      const skillIds = selectedSkills.map((skill) => skill.id);

      /* This creates an inner join between the selectedTable's junction table and the position table. This is done in order to get the positions.id*/
      const { data: positions, error: positionsError } = await supabase
        .from(selectedTable + "_skill_position")
        .select("positions(*)")
        .in("skills_id", skillIds);

      if (positionsError) {
        throw new Error(
          "Misslyckades med att hämta LIA-positioner:",
          positionsError
        );
      }

      /* If none are selected, this sets filteredcompanies to an empty array. */
      if (!positions || positions.length === 0) {
        setFilteredCompanies([]);
        setLoading(false);
        return;
      }

      /* This looks through positions to get the matching userid. */
      const userIds = positions
        .filter((item) => item.positions && item.positions.user_id)
        .map((item) => item.positions.user_id);

      /* This fetches the data from the companies table with the selected user ids. */
      const { data: matchingCompanies, error: companiesError } = await supabase
        .from("companies")
        .select("*")
        .in("user_id", userIds);

      if (companiesError) {
        throw new Error("Misslyckades med att hämta företag:", companiesError);
      }

      setFilteredCompanies(matchingCompanies);
    } catch (e) {
      setError(e.message || "Ett fel uppstod vid filtreringen.");
    } finally {
      setLoading(false);
    }
  }, 300)

  /* The functions handle scripts on the page */

  const toggleFilter = () => {
    setIsVisible((prev) => !prev);
  };

  const cancelFilter = () => {
    setSkills([]);

    setFilteredCompanies([]);

    setSelectedTable([]);

    setIsVisible(false);

    router.refresh();
  };

  if (error) {
    return <div>Error loading companies: {error.message}</div>;
  }

  return (
    <>
      <div className="cover-wrapper">
        <div className="image-wrapper">
          <img
            src="/images/companies-page-hero.png"
            alt="Illustration av personer som samarbetar med programmering."
          />
        </div>
      </div>
      <div className="main-wrapper">
        <div className="content-wrapper">
          <section className="search-bar-and-filter-wrapper">
            <h1>Hitta din nya LIA-plats</h1>
            <p>
              Filtrera och hitta matchande LIA-platser från anslutna företag.
            </p>
            <form className="input-wrapper" onSubmit={handleSearch}>
              <input
                placeholder="Sök efter företag"
                id="input-search"
                onChange={handleSearchInputChange}
              />
              <label htmlFor="input-search">
                <Button
                  id="input-search"
                  text="Sök"
                  className="primary-button"
                  hasIcon={true}
                  leftIcon={
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
              </label>
            </form>

            <Button
              className="light-filter-button"
              onClick={toggleFilter}
              text={
                isVisible ? "Stäng filtrering" : "Filtrera efter positioner"
              }
              hasIcon={true}
              rightIcon={
                isVisible ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1rem"
                    height="1rem"
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
                    width="1rem"
                    height="1rem"
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
                <section className="tabs">
                  <button
                    className={
                      selectedTable === "webbutvecklare"
                        ? "activeTitleButton"
                        : "title-button"
                    }
                    name="webbutvecklare"
                    value="Webbutvecklare"
                    onClick={handleTitleChange}
                  >
                    Webbutvecklare
                  </button>
                  <button
                    className={
                      selectedTable === "digitaldesigner"
                        ? "activeTitleButton"
                        : "title-button"
                    }
                    name="digitaldesigner"
                    value="Digital designer"
                    onClick={handleTitleChange}
                  >
                    Digital designer
                  </button>
                </section>

                <div
                  className={`skills-container ${
                    skillsExpanded ? "expanded" : ""
                  }`}
                >
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
                          {isSkillSelected(skill.id) ? (
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
                  {!skillsExpanded && skillsData.length > 6 && (
                    <div className="skills-fade"></div>
                  )}
                </div>

                {skillsData.filter((item) => item.type === "Software").length >
                  6 && (
                  <button
                    type="button"
                    onClick={() => setSkillsExpanded(!skillsExpanded)}
                    className={`show-more-btn ${
                      skillsExpanded ? "expanded" : ""
                    }`}
                  >
                    {skillsExpanded ? "Visa färre" : "Visa flera"}
                  </button>
                )}

                <div
                  className={`skills-container ${
                    skillsExpanded ? "expanded" : ""
                  }`}
                >
                  <div className="skillsGrid">
                    {skillsData
                      .filter((item) => item.type === "Software")
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
                          <img
                            src={`/images/software-icons/${skill.skills_name.toLowerCase().replace(/\s+/g, '')}.svg`}
                            alt={skill.skills_name}
                          />
                          {skill.skills_name}
                          {isSkillSelected(skill.id) ? (
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
                  {!skillsExpanded && skillsData.length > 6 && (
                    <div className="skills-fade"></div>
                  )}
                </div>

                {skillsData.filter((item) => item.type === "Software").length >
                  6 && (
                  <button
                    type="button"
                    onClick={() => setSkillsExpanded(!skillsExpanded)}
                    className={`show-more-btn ${
                      skillsExpanded ? "expanded" : ""
                    }`}
                  >
                    {skillsExpanded ? "Visa färre" : "Visa flera"}
                  </button>
                )}
                <button onClick={cancelFilter} className="button">
                  Nollställ filtrering
                </button>
              </section>
            )}
          </section>

          {/* LIST OF COMPANIES */}
          <section className="companies-list">

            {error && (<div>{error}</div>)}

            {filteredCompanies.length > 0 && (
              <h1 className="matching-companies">
                Företag med matchande positioner
              </h1>
            )}
            {loading && (<img className="svg-loader" src="images/Rolling@1x-5.9s-50px-50px.svg"/>)}
            {filteredCompanies.map((company) => (
              <div key={company.id}>
                <CardCompany
                  logoUrl={company.logo_url}
                  applyNowClassName="card-company-2"
                  className="card-company-instance"
                  company={company.name}
                  headerClassName="design-component-instance-node"
                  location={company.location}
                  statusProperty="internship-matching"
                  id={company.id}
                  companyPositions={
                    company.position_count
                      ? company.position_count + " lediga positioner"
                      : ""
                  }
                  showApply={true}
                  showLogotype={true}
                />
              </div>
            ))}

            {companiesData && <h2 className="all-companies">Alla företag</h2>}

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
        </div>
      </div>
      <CreateCompanyProfileBanner />
    </>
  );
}
