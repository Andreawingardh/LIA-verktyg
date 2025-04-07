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

      console.log("Uploading to:", filePath);

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
      console.log("Uploaded file:", data.publicUrl);

      //Here we add the file into local storage
      if (type === "logo") {
        localStorage.setItem("logoUrl", data.publicUrl);
        setLogoUrl(data.publicUrl);
        console.log(data.publicUrl);
      } else if (type === "display") {
        console.log(data.publicUrl);
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
      console.log(fileUrl);
      console.log(error);
    }
  };

  const handleDisplayImageChange = async (e) => {
    console.log("handleDisplayImageChange triggered");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDisplayImage(file);
      console.log("Selected file:", file);

      const fileUrl = await fileUpload(file, "display");
      console.log("Returned URL:", fileUrl);
      console.log("Upload Error:", error);
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

          <div className="profileFileInputs">
            <input
              id="logo"
              name="logo"
              type="file"
              onChange={handleLogoChange}
              disabled={isSubmitting}
            />
            {logoUrl && <p className="success-message">Logga uppladdad</p>}
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
            {displayImageUrl && (
              <p className="success-message">Omslagsbild uppladdad</p>
            )}
          </div>
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
