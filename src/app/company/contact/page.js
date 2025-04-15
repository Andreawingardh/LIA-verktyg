"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "../../components/form/FormContext";
import { supabase } from "../../../utils/supabase/client";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";
import "../company.css";
import { ProgressIndicator } from "../../components/form/ProgressIndicator";
import CancelConfirmationPopup from "../../components/form/CancelConfirmationPopup";


const PLACEHOLDER_DISPLAY_IMAGE = "/images/company-placeholder-hero.png";

export default function ContactPage() {
  return (
    <FormProvider>
      <ContactForm />
    </FormProvider>
  );
}

function ContactForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  // Convert to object-based error handling
  const [errors, setErrors] = useState({
    website: "",
    contactEmail: "",
    general: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [initialized, setInitialized] = useState(false);
 
  useEffect(() => {
    if (showCancelPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCancelPopup]);

  useEffect(() => {
    // Only run this check once to prevent redirect loops
    if (!initialized && !authLoading) {
      setInitialized(true);

      const registrationStep = localStorage.getItem("registrationStep");
      const description = localStorage.getItem("companyDescription");
      const location = localStorage.getItem("companyLocation");
      const email = localStorage.getItem("registrationEmail");

      if ((user || email) && description && location) {
        if (registrationStep !== "contact") {
          localStorage.setItem("registrationStep", "contact");
        }
        
        if (email && !contactEmail) {
          setContactEmail(email);
        }
        
        setLoading(false);
      } else if (!location) {
        router.push("/company/description");
      } else {
        setLoading(false);
      }
    }
  }, [authLoading, contactEmail, router, initialized, user]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { website: "", contactEmail: "", general: "" };

    // Validate website (required field)
    if (!website.trim()) {
      newErrors.website = "Hemsida är obligatoriskt";
      isValid = false;
    } else {
      // Simple URL validation
      try {
        new URL(website);
      } catch (e) {
        newErrors.website = "Vänligen ange en giltig URL (t.ex. https://example.com)";
        isValid = false;
      }
    }

    // Validate contact email
    if (!contactEmail.trim()) {
      isValid = true;
    } else {
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        newErrors.contactEmail = "Vänligen ange en giltig e-postadress";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (redirecting || isSubmitting) {
      return;
    }

    // Validate form first
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({ website: "", contactEmail: "", general: "" });

    try {
      const email = localStorage.getItem("registrationEmail");
      const password = localStorage.getItem("registrationPassword");
      const companyName = localStorage.getItem("companyName");
      const description = localStorage.getItem("companyDescription");
      const location = localStorage.getItem("companyLocation");
      const logoUrl = localStorage.getItem("logoUrl");
      const displayImageUrl = localStorage.getItem("displayImageUrl");

      if (!user) {
        // Only try to sign up if we don't already have a user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          if (signUpError.message.includes("Email")) {
            setErrors(prev => ({...prev, general: "Ett problem uppstod med e-postadressen: " + signUpError.message}));
          } else if (signUpError.message.includes("Password")) {
            setErrors(prev => ({...prev, general: "Ett problem uppstod med lösenordet: " + signUpError.message}));
          } else {
            throw signUpError;
          }
          setIsSubmitting(false);
          return;
        }
      }

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id || user?.id;

      if (!userId) {
        throw new Error("Kunde inte hämta användarinformation");
      }

      const { data: insertData, error: insertError } = await supabase
        .from("companies")
        .insert([
          {
            user_id: userId,
            name: companyName,
            description: description,
            location: location,
            website: website,
            email: contactEmail,
            logo_url: logoUrl || null,
            display_image_url: displayImageUrl || null,
          },
        ]);

      if (insertError) {
        // Handle specific database errors
        if (insertError.code === "23505") { // Unique constraint violation
          setErrors(prev => ({...prev, general: "Ett företag med samma namn finns redan registrerat"}));
          setIsSubmitting(false);
          return;
        }
        throw insertError;
      }

      // Set a flag in localStorage to show completion popup on dashboard
      localStorage.setItem("showCompletionPopup", "true");

      // Clear registration data from localStorage
      localStorage.removeItem("registrationStep");
      localStorage.removeItem("registrationEmail");
      localStorage.removeItem("registrationPassword");
      localStorage.removeItem("companyName");
      localStorage.removeItem("companyDescription");
      localStorage.removeItem("companyLocation");
      localStorage.removeItem("hasLogo");
      localStorage.removeItem("hasDisplayImage");
      localStorage.removeItem("useDefaultDisplayImage");
      localStorage.removeItem("logoUrl");
      localStorage.removeItem("displayImageUrl");

      // Mark that we're redirecting
      setRedirecting(true);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Error in Contact:", err);
      setErrors(prev => ({...prev, general: err.message || "Ett fel uppstod när profilen skulle skapas"}));
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    setShowCancelPopup(true);
  };

  const handleGoBack = () => {
    router.push("/company/description");
  };

  if (loading || authLoading) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="container">
      <form className="contentWrapper" onSubmit={handleSubmit} noValidate>
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

        <header className="contentHeader">
          <h1 className="title">Skapa företagsprofil</h1>
          <ProgressIndicator currentStep="contact" />
        </header>

        <article className="inputSingle">
          <label className="popupTitle" htmlFor="website">
            Hemsida <span className="asterix">*</span>
          </label>
          <input
            id="website"
            name="website"
            type="url"
            className={`profileInputs ${errors.website ? "error-input" : ""}`}
            required
            value={website}
            onChange={(e) => {
              setWebsite(e.target.value);
              // Clear error when user types
              setErrors(prev => ({...prev, website: "", general: ""}));
            }}
            disabled={isSubmitting}
            placeholder="Skriv länken till eran hemsida"
          />
          {errors.website && <p className="error-message">{errors.website}</p>}
        </article>

        <article className="inputSingle">
          <label className="popupTitle" htmlFor="contactEmail">
            Kontaktmail
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            className="profileInputs"
            required
            value={contactEmail}
            onChange={(e) => {
              setContactEmail(e.target.value);
              // Clear error when user types
              setErrors(prev => ({...prev, contactEmail: "", general: ""}));
            }}
            disabled={isSubmitting}
            placeholder="Skriv företagets kontaktmail"
          />
          <p>
            Kontaktmail kommer synas på eran företagssida.
          </p>
        </article>

        {errors.general && <p className="error-message">{errors.general}</p>}

        <footer className="buttonGroup">
          <button
            className="profileSubmitButton"
            type="submit"
            disabled={isSubmitting || redirecting}
          >
            {isSubmitting ? "Skapar profil..." : "Slutför Företagsprofil"}
          </button>

          <button
            type="button"
            className="cancelButton"
            onClick={handleCancelClick}
            disabled={isSubmitting || redirecting}
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