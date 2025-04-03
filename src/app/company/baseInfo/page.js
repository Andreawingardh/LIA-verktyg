"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "../../components/form/FormContext";
import { supabase } from "../../../utils/supabase/client";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";
import "../company.css";
import { ProgressIndicator } from "../../components/form/ProgressIndicator";

export default function RegisterPage() {
  return (
    <FormProvider>
      <BaseInfoForm />
    </FormProvider>
  );
}

function BaseInfoForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user || localStorage.getItem("registrationEmail")) {
        setLoading(false);
      } else {
        router.push("/login");
      }
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      localStorage.setItem("companyName", companyName);

      if (logo) {
        localStorage.setItem("hasLogo", "true");
      }

      if (displayImage) {
        localStorage.setItem("hasDisplayImage", "true");
      }

      localStorage.setItem("registrationStep", "description");

      router.push("/company/description");
    } catch (err) {
      console.error("Error in BaseInfo:", err);
      setError("Ett fel uppstod när informationen skulle sparas");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleDisplayImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDisplayImage(e.target.files[0]);
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
          <ProgressIndicator currentStep="baseInfo" />
        </header>
        <article className="inputSingle">
          <label className="popupTitle" htmlFor="companyName">
            Företagsnamn
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            className="profileInputs"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={isSubmitting}
          />
        </article>

        <article className="inputSingle">
          <label className="popupTitle" htmlFor="logo">
            Logga
          </label>

          <div className="profileFileInputs">
            <input
              id="logo"
              name="logo"
              type="file"
              onChange={handleLogoChange}
              disabled={isSubmitting}
            />
          </div>
        </article>

        <article className="inputSingle">
          <label className="popupTitle" htmlFor="displayImage">
            Omslagsbild
          </label>

          <div className="profileFileInputs">
            <input
              id="displayImage"
              name="displayImage"
              type="file"
              onChange={handleDisplayImageChange}
              disabled={isSubmitting}
            />
          </div>
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
