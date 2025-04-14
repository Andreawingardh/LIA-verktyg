"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "../../components/form/FormContext";
import { supabase } from "../../../utils/supabase/client";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";
import "../company.css";
import { ProgressIndicator } from "../../components/form/ProgressIndicator";
import CancelConfirmationPopup from "../../components/form/CancelConfirmationPopup";

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
  const [uploadStatus, setUploadStatus] = useState({ logo: "", display: "" });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [displayImageUrl, setDisplayImageUrl] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Add effect to prevent scrolling when popup is shown
  useEffect(() => {
    if (showCancelPopup) {
      // Prevent scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCancelPopup]);

  const fileUpload = async (file, type) => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;
      const filePath = `company-logos/${fileName}`; // Path in the storage bucket

      //Here the file is uploaded
      const { error: uploadError } = await supabase.storage
        .from("images") // Your storage bucket name
        .upload(filePath, file);

      //If there is an error with the upload, it's thrown here
      if (uploadError) {
        throw new Error(uploadError.message);
      }

      //Here we get the URL for the image
      const { data, error: urlError } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      //If there is an error with the URL, we get it here
      if (urlError) {
        throw new Error(urlError.message);
      }

      //Here we get the success message
      setSuccess(`${type} uploaded successfully!`);

      //Here we add the file into local storage
      if (type === "logo") {
        localStorage.setItem("logoUrl", data.publicUrl);
        setLogoUrl(data.publicUrl);
      } else if (type === "display") {
        localStorage.setItem("displayImageUrl", data.publicUrl);
        setDisplayImageUrl(data.publicUrl);
      }

      return data.publicUrl;
    } catch (err) {
      setError(err.message || "File upload failed");
      console.error("Error uploading file:", err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    // Only run this check once to prevent redirect loops
    if (!initialized && !authLoading) {
      setInitialized(true);

      const registrationStep = localStorage.getItem("registrationStep");
      const registrationEmail = localStorage.getItem("registrationEmail");

      if (user || (registrationEmail && registrationStep === "baseInfo")) {
        setLoading(false);
      } else if (!registrationEmail) {
        // Only redirect if there's no registration email at all
        router.push("/login");
      }
    }
  }, [authLoading, user, router, initialized]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (redirecting) {
      return;
    }

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

      // Mark that we're redirecting to prevent multiple redirects
      setRedirecting(true);

      // Add a small delay before redirecting
      setTimeout(() => {
        router.push("/company/description");
      }, 100);
    } catch (err) {
      console.error("Error in BaseInfo:", err);
      setError("Ett fel uppstod när informationen skulle sparas");
      setIsSubmitting(false);
      setRedirecting(false);
    }
  };

  const handleLogoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      const fileUrl = await fileUpload(file, "logo");
    }
  };

  const handleDisplayImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDisplayImage(file);

      const fileUrl = await fileUpload(file, "display");
    } else {
      console.error("No file selected");
    }
  };

  const handleCancelClick = () => {
    setShowCancelPopup(true);
  };

  const handleGoBack = () => {
    router.push("/");
  };

  if (loading || authLoading) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="container">
      <form className="contentWrapper" onSubmit={handleSubmit}>
        <header className="contentHeader">
          <h1 className="title">Skapa företagsprofil</h1>
          <ProgressIndicator currentStep="baseInfo" />
        </header>

        <article className="inputSingle">
          <label className="popupTitle" htmlFor="companyName">
            Företagsnamn <span className="asterix">*</span>
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
            placeholder="Skriv företagets namn"
          />
        </article>

        <article className="inputSingle">
          <label className="popupTitle" htmlFor="logo">
            Logga
          </label>

          <input
            id="logo"
            name="logo"
            type="file"
            className="profileFileInputs"
            onChange={handleLogoChange}
            disabled={isSubmitting}
          />
          {logoUrl && <p className="success-message">Logga uppladdad</p>}
        </article>

        <article className="inputSingle">
          <label className="popupTitle" htmlFor="displayImage">
            Omslagsbild
          </label>

          <input
            id="displayImage"
            name="displayImage"
            type="file"
            className="profileFileInputs"
            onChange={handleDisplayImageChange}
            disabled={isSubmitting}
          />
          {displayImageUrl && (
            <p className="success-message">Omslagsbild uppladdad</p>
          )}
        </article>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="buttonGroup">
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
        </div>
      </form>

      {/* Cancel Confirmation Popup */}
      <CancelConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
      />
    </div>
  );
}
