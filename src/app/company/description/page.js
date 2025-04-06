"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "../../components/form/FormContext";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";
import { ProgressIndicator } from "../../components/form/ProgressIndicator";
import CancelConfirmationPopup from "../../components/form/CancelConfirmationPopup";
import "../company.css";

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
  const [showCancelPopup, setShowCancelPopup] = useState(false);

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

  const handleCancelClick = () => {
    setShowCancelPopup(true);
  };

  const handleGoBack = () => {
    router.push("/company/baseInfo");
  };

  if (loading || authLoading) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="container">
      <form className="contentWrapper" onSubmit={handleSubmit}>
        <header className="contentHeader">
          <button type="button" className="goBackButton" onClick={handleGoBack}>
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
                d="M8.47124 2.86177C8.73159 3.12212 8.73159 3.54423 8.47124 3.80458L4.94265 7.33316H12.6665C13.0347 7.33316 13.3332 7.63164 13.3332 7.99983C13.3332 8.36802 13.0347 8.66649 12.6665 8.66649H4.94264L8.47124 12.1951C8.73159 12.4555 8.73159 12.8776 8.47124 13.1379C8.21089 13.3983 7.78878 13.3983 7.52843 13.1379L2.86177 8.47123C2.73674 8.34621 2.6665 8.17664 2.6665 7.99983C2.6665 7.82302 2.73674 7.65345 2.86177 7.52842L7.52843 2.86177C7.78878 2.60142 8.21089 2.60142 8.47124 2.86177Z"
                fill="#0F1314"
              />
            </svg>
            Gå tillbaka
          </button>
          <h2 className="title">Skapa företagsprofil</h2>
          <ProgressIndicator currentStep="description" />
        </header>

        <article className="inputSingle">
          <label className="popupTitle" htmlFor="location">
            Kontorsort
          </label>
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
          <label className="popupTitle" htmlFor="description">
            Företagsbeskrivning
          </label>
          <textarea
            id="description"
            name="description"
            className="profileInputs"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            style={{ height: "150px" }}
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

          <button
            type="button"
            className="cancelButton"
            onClick={handleCancelClick}
          >
            Avbryt Registrering
          </button>
        </footer>
      </form>

      {/* Cancel Confirmation Popup */}
      <CancelConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
      />
    </div>
  );
}
