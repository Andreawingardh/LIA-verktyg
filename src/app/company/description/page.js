"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "../../components/form/FormContext";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";

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
      <h2>Skapa företagsprofil</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="location">Kontorsort</label>
        <input
          id="location"
          name="location"
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={isSubmitting}
        />

        <label htmlFor="description">Företagsbeskrivning</label>
        <textarea
          id="description"
          name="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
