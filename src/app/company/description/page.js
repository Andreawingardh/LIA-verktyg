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
  const [redirecting, setRedirecting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only run this check once to prevent redirect loops
    if (!initialized && !authLoading) {
      setInitialized(true);
      
      const registrationStep = localStorage.getItem("registrationStep");
      const companyName = localStorage.getItem("companyName");
      
      if ((user || localStorage.getItem("registrationEmail")) && 
          registrationStep === "description" && companyName) {
        setLoading(false);
      } else if (companyName) {
        // If we have a company name but wrong step, correct the step
        localStorage.setItem("registrationStep", "description");
        setLoading(false);
      } else {
        router.push("/company/baseInfo");
      }
    }
  }, [authLoading, router, initialized, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (redirecting) {
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      localStorage.setItem("companyDescription", description);
      localStorage.setItem("companyLocation", location);
      localStorage.setItem("registrationStep", "contact");
      
      // Mark that we're redirecting to prevent multiple redirects
      setRedirecting(true);
      
      // Add a small delay before redirecting
      setTimeout(() => {
        router.push("/company/contact");
      }, 100);
      
    } catch (err) {
      console.error("Error in Description:", err);
      setError("Ett fel uppstod när informationen skulle sparas");
      setIsSubmitting(false);
      setRedirecting(false);
    }
  };

  const handleCancelClick = () => {
    setShowCancelPopup(true);
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
            disabled={isSubmitting || redirecting}
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