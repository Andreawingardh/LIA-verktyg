"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "../../components/form/FormContext";
import { supabase } from "../../../utils/supabase/client";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";

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
  const [imageUrl, setImageUrl] = useState();
  const [uploadStatus, setUploadStatus] = useState({ logo: "", display: "" });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [file, setFile] = useState();

  const fileUpload = async (file) => {
      setFile(file);
  
      if (!file) return;

      setUploading(true);
      setError(null);
      setSuccess(null);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;
      const filePath = `company-logos/${fileName}`; // Path in the storage bucket

      const { error: uploadError } = await supabase.storage
        .from("images") // Your storage bucket name
        .upload(filePath, file);

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return; // Exit early if there's an error
      }

      const { data, error: urlError } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      if (urlError) {
        setError(urlError.message);
      } else {
        setImageUrl(data.publicUrl);
        setSuccess("Image uploaded successfully!");
        console.log("Uploaded file:", data, data.publicUrl);
      }

      setUploading(false);
    };

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
      try {
        fileUpload(logo);
        console.log(imageUrl);
        localStorage.setItem("logoUrl", imageUrl);
      } catch (e) {
        console.log(e)
      }
      
    
    }
  };

  const handleDisplayImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDisplayImage(e.target.files[0]);
      try {
      fileUpload(displayImage);
        localStorage.setItem("displayImageUrl", imageUrl);
      } catch (e) {
        console.log(e)
      }
    }
  };

  if (loading || authLoading) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="container">
      <h2>Skapa företagsprofil</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="companyName">Företagsnamn</label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          disabled={isSubmitting}
        />

        <label htmlFor="logo">Logga</label>
        <input
          id="logo"
          name="logo"
          type="file"
          onChange={handleLogoChange}
          disabled={isSubmitting}
        />

        <label htmlFor="displayImage">Omslagsbild</label>
        <input
          id="displayImage"
          name="displayImage"
          type="file"
          onChange={handleDisplayImageChange}
          disabled={isSubmitting}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="button-group">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sparar..." : "Fortsätt"}
          </button>
        </div>
      </form>
    </div>
  );
}
