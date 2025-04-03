"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "../../components/form/FormContext";
import { supabase } from "../../../utils/supabase/client";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";
import "../company.css"
import { ProgressIndicator } from "../../components/form/ProgressIndicator";

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
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      const registrationStep = localStorage.getItem("registrationStep");
      const description = localStorage.getItem("companyDescription");

      if (registrationStep === "contact" && description) {
        const email = localStorage.getItem("registrationEmail");
        if (email && !contactEmail) {
          setContactEmail(email);
        }

        setLoading(false);
      } else {
        router.push("/company/description");
      }
    }
  }, [authLoading, contactEmail, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const email = localStorage.getItem("registrationEmail");
      const password = localStorage.getItem("registrationPassword");
      const companyName = localStorage.getItem("companyName");
      const description = localStorage.getItem("companyDescription");
      const location = localStorage.getItem("companyLocation");

      if (!user) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
      }

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id || user?.id;

      if (!userId) {
        throw new Error("Kunde inte hämta användarinformation");
      }

      const { error: insertError } = await supabase.from("companies").insert([
        {
          user_id: userId,
          name: companyName,
          description: description,
          location: location,
          website: website,
          email: contactEmail,
        },
      ]);

      if (insertError) throw insertError;

      // Handle file uploads if they exist
      const hasLogo = localStorage.getItem("hasLogo") === "true";
      const hasDisplayImage =
        localStorage.getItem("hasDisplayImage") === "true";

      // Here you would handle the file uploads and update the company profile
      // For now, we'll skip this part to simplify the implementation

      // Clear registration data from localStorage
      localStorage.removeItem("registrationStep");
      localStorage.removeItem("registrationEmail");
      localStorage.removeItem("registrationPassword");
      localStorage.removeItem("companyName");
      localStorage.removeItem("companyDescription");
      localStorage.removeItem("companyLocation");
      localStorage.removeItem("hasLogo");
      localStorage.removeItem("hasDisplayImage");

      router.push("/dashboard");
    } catch (err) {
      console.error("Error in Contact:", err);
      setError(err.message || "Ett fel uppstod när profilen skulle skapas");
    } finally {
      setIsSubmitting(false);
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
          
          {/* Add the progress indicator component */}
          <ProgressIndicator currentStep="contact" />
        </header>
        
        <article className="inputSingle">
          <label className="popupTitle" htmlFor="website">Hemsida</label>
          <input
            id="website"
            name="website"
            type="url"
            className="profileInputs"
            required
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={isSubmitting}
          />
        </article>

        <article className="inputSingle">
          <label className="popupTitle" htmlFor="contactEmail">Kontaktmail</label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            className="profileInputs"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </article>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <footer className="buttonGroup">
          <button
            className="profileSubmitButton"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Skapar profil..." : "Slutför Företagsprofil"}
          </button>

          <button type="button" className="cancelButton">
            Avbryt Registrering
          </button>
        </footer>
      </form>
    </div>
  );
}
