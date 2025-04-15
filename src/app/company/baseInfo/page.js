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
  // Convert simple error to object-based error state
  const [errors, setErrors] = useState({
    companyName: "",
    logo: "",
    displayImage: "",
    general: ""
  });
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
  const [useDefaultImage, setUseDefaultImage] = useState(false);

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
    // Clear error states when starting upload
    setErrors(prev => ({...prev, [type === 'logo' ? 'logo' : 'displayImage']: "", general: ""}));
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
        // When a real image is uploaded, make sure we're not using default
        setUseDefaultImage(false);
        localStorage.setItem("useDefaultDisplayImage", "false");
        localStorage.setItem("displayImageUrl", data.publicUrl);
        setDisplayImageUrl(data.publicUrl);
      }

      return data.publicUrl;
    } catch (err) {
      // Set specific error based on file type
      if (type === "logo") {
        setErrors(prev => ({...prev, logo: `Logga: ${err.message || "Filuppladdning misslyckades"}`}));
      } else {
        setErrors(prev => ({...prev, displayImage: `Omslagsbild: ${err.message || "Filuppladdning misslyckades"}`}));
      }
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
      const savedUseDefaultImage = localStorage.getItem("useDefaultDisplayImage");
      
      // Initialize useDefaultImage from localStorage if it exists
      if (savedUseDefaultImage === "true") {
        setUseDefaultImage(true);
      }

      if (user || (registrationEmail && registrationStep === "baseInfo")) {
        setLoading(false);
      } else if (!registrationEmail) {
        // Only redirect if there's no registration email at all
        router.push("/login");
      }
    }
  }, [authLoading, user, router, initialized]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { companyName: "", logo: "", displayImage: "", general: "" };

    // Validate company name - more strict validation
    if (!companyName || !companyName.trim()) {
      newErrors.companyName = "Företagsnamn är obligatoriskt";
      isValid = false;
    } else if (companyName.trim().length < 2) {
      newErrors.companyName = "Företagsnamnet får inte vara kortare än 2 tecken";
      isValid = false;
    } else if (companyName.trim().length > 25) {
      newErrors.companyName = "Företagsnamnet får inte vara längre än 25 tecken";
      isValid = false;
    }


    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (redirecting) {
      return;
    }

    // Validate form first - validation should be enforced
    const isValid = validateForm();
    if (!isValid) {
      return; // Stop form submission if validation fails
    }

    setIsSubmitting(true);
    setErrors({ companyName: "", logo: "", displayImage: "", general: "" });

    try {
      localStorage.setItem("companyName", companyName);

      if (logo) {
        localStorage.setItem("hasLogo", "true");
      }

      // Handle display image setting
      if (displayImage) {
        localStorage.setItem("hasDisplayImage", "true");
        localStorage.setItem("useDefaultDisplayImage", "false");
      } else if (!displayImageUrl) {
        // If no display image was uploaded, use the placeholder
        localStorage.setItem("useDefaultDisplayImage", "true");
        localStorage.setItem("displayImageUrl", PLACEHOLDER_DISPLAY_IMAGE); // Store the placeholder path
        localStorage.setItem("hasDisplayImage", "true"); // Still mark as having a display image
      }

      localStorage.setItem("registrationStep", "description");

      // Mark that we're redirecting to prevent multiple redirects
      setRedirecting(true);

      // Add a small delay before redirecting
      setTimeout(() => {
        router.push("/company/description");
      }, 100);
    } catch (err) {
      setErrors(prev => ({...prev, general: "Ett fel uppstod när informationen skulle sparas"}));
      setIsSubmitting(false);
      setRedirecting(false);
    }
  };

  const MAX_LOGO_FILE_SIZE = 2 * 1024 * 1024;

  const handleLogoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Clear logo error when user tries again
      setErrors(prev => ({...prev, logo: "", general: ""}));

      if (file.size > MAX_LOGO_FILE_SIZE) {
        setErrors(prev => ({...prev, logo: "Filen överstiger 2MB. Var vänlig och välj en annan fil."}));
        return;
      }

      setLogo(file);
      const fileUrl = await fileUpload(file, "logo");
    }
  };

  const MAX_DISPLAY_FILE_SIZE = 10 * 1024 * 1024;

  const handleDisplayImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Clear display image error when user tries again
      setErrors(prev => ({...prev, displayImage: "", general: ""}));

      if (file.size > MAX_DISPLAY_FILE_SIZE) {
        setErrors(prev => ({...prev, displayImage: "Filen överstiger 10MB. Var vänlig och välj en annan fil."}));
        return;
      }

      setDisplayImage(file);
      // Set useDefaultImage to false when uploading a custom image
      setUseDefaultImage(false);
      const fileUrl = await fileUpload(file, "display");
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
      <form className="contentWrapper" onSubmit={handleSubmit} noValidate>
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
            className={`profileInputs ${errors.companyName ? "error-input" : ""}`}
            required="required"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              // Clear error when user types
              setErrors(prev => ({...prev, companyName: "", general: ""}));
            }}
            disabled={isSubmitting}
            placeholder="Skriv företagets namn"
          />
          {errors.companyName && <p className="error-message">{errors.companyName}</p>}
        </article>

        <article className="inputSingle">
          <label className="popupTitle" htmlFor="logo">
            Logga
          </label>

          <input
            id="logo"
            name="logo"
            type="file"
            className={`profileFileInputs ${errors.logo ? "error-input" : ""}`}
            onChange={handleLogoChange}
            disabled={isSubmitting}
          />
          {errors.logo && <p className="error-message">{errors.logo}</p>}
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
            className={`profileFileInputs ${errors.displayImage ? "error-input" : ""}`}
            onChange={handleDisplayImageChange}
            disabled={isSubmitting}
          />
          {errors.displayImage && <p className="error-message">{errors.displayImage}</p>}
          {displayImageUrl && (
            <p className="success-message">Omslagsbild uppladdad</p>
          )}
        </article>

        {errors.general && <p className="error-message">{errors.general}</p>}

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