"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "../../components/form/FormContext";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";
import { ProgressIndicator } from "../../components/form/ProgressIndicator";
import "../company.css"

export default function DescriptionPage() {
  return (
    <FormProvider>
      <DescriptionForm />
    </FormProvider>
  );
}

function DescriptionForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      const registrationStep = localStorage.getItem("registrationStep");
      const companyName = localStorage.getItem("companyName");

      if (registrationStep === "description" && companyName) {
        setLoading(false);
      } else {
        router.push("/company/baseInfo");
      }
    }
  }, [authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      localStorage.setItem("companyDescription", description);
      localStorage.setItem("companyLocation", location);

      localStorage.setItem("registrationStep", "contact");

      router.push("/company/contact");
    } catch (err) {
      console.error("Error in Description:", err);
      setError("Ett fel uppstod när informationen skulle sparas");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="container">
      <form className="contentWrapper" onSubmit={handleSubmit}>
        <header className="contentHeader">
          <h2 className="title">Skapa företagsprofil</h2>
          
          {/* Add the progress indicator component */}
          <ProgressIndicator currentStep="description" />
        </header>
        
        <article className="inputSingle">
          <label className="popupTitle" htmlFor="location">Kontorsort</label>
          <input
            id="location"
            name="location"
            type="text"
            className="profileInputs"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isSubmitting}
          />
        </article>

        <article className="inputSingle">
          <label className="popupTitle" htmlFor="description">Företagsbeskrivning</label>
          <textarea
            id="description"
            name="description"
            className="profileInputs"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            style={{ height: '150px' }}
          />
        </article>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <footer className="buttonGroup">
          <button
            className="profileSubmitButton"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sparar..." : "Fortsätt till nästa steg"}
          </button>

          <button type="button" className="cancelButton">
            Avbryt Registrering
          </button>
        </footer>
      </form>
    </div>
  );
}