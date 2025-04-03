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
  const [uploadStatus, setUploadStatus] = useState({ logo: "", display: "" });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [displayImageUrl, setDisplayImageUrl] = useState(null);

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
        console.log(data.publicUrl);
      } else if (type === "display") {
        console.log(data.publicUrl);
        localStorage.setItem("displayImageUrl", data.publicUrl);
      }

      return data.publicUrl
    } catch (err) {
      setError(err.message || "File upload failed");
      console.error("Error uploading file:", err);
      return null;
    } finally {
      setUploading(false);
    }
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

  const handleLogoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileUrl = await fileUpload(file, "logo");
      console.log(fileUrl)
      console.log(error)
    }
  };

  const handleDisplayImageChange = async (e) => {
    console.log("handleDisplayImageChange triggered");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file);


      const fileUrl = await fileUpload(file, "display");
      console.log("Returned URL:", fileUrl);
      console.log("Upload Error:", error);
    } else {
      console.error("No file selected");
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
          accept="image/*" 
          onChange={handleLogoChange}
          disabled={isSubmitting}
        />

        <label htmlFor="displayImage">Omslagsbild</label>
        <input
          id="displayImage"
          name="displayImage"
          type="file"
          accept="image/*" 
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
