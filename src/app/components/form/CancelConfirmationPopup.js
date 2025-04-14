"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase/client";
import "./popup.css";

export default function CancelConfirmationPopup({ isOpen, onClose }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirmCancel = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const email = localStorage.getItem("registrationEmail");
      const password = localStorage.getItem("registrationPassword");
      const companyName = localStorage.getItem("companyName") || "Företag";

      if (!email || !password) {
        throw new Error("Saknar nödvändig information för att skapa profil");
      }

      const { data: sessionData } = await supabase.auth.getSession();
      let userId = sessionData?.session?.user?.id;

      if (!userId) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        userId = data?.user?.id;

        if (!userId) {
          throw new Error("Kunde inte skapa användare");
        }
      }

      // Make the company name unique by adding a timestamp and random string
      const uniqueCompanyName = `${companyName}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // First check if the user already has a company
      const { data: existingCompanies, error: fetchError } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", userId);

      if (fetchError) {
        console.error("Error checking for existing companies:", fetchError);
      }

      // If user already has a company, don't create a new one
      if (!existingCompanies || existingCompanies.length === 0) {
        const { error: insertError } = await supabase.from("companies").insert([
          {
            user_id: userId,
            name: uniqueCompanyName, // Use the unique name
            description: "",
            location: "",
            website: "",
            email: email,
            logo_url: null,
            display_image_url: null,
          },
        ]);

        if (insertError) throw insertError;
      }

      // Clear all localStorage registration data
      localStorage.removeItem("registrationStep");
      localStorage.removeItem("registrationEmail");
      localStorage.removeItem("registrationPassword");
      localStorage.removeItem("companyName");
      localStorage.removeItem("companyDescription");
      localStorage.removeItem("companyLocation");
      localStorage.removeItem("hasLogo");
      localStorage.removeItem("hasDisplayImage");
      localStorage.removeItem("logoUrl");
      localStorage.removeItem("displayImageUrl");

      onClose();
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating basic profile:", err);
      setError(err.message || "Ett fel uppstod när profilen skulle skapas");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="popup-overlay"
      style={{ display: isOpen ? "flex" : "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="cancel-popup-header">
          <h4>Avbryt Profilregistrering</h4>
          <button className="close-btn close-btn-text" onClick={onClose}>
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
                d="M3.64645 3.64645C3.84171 3.45118 4.15829 3.45118 4.35355 3.64645L8 7.29289L11.6464 3.64645C11.8417 3.45118 12.1583 3.45118 12.3536 3.64645C12.5488 3.84171 12.5488 4.15829 12.3536 4.35355L8.70711 8L12.3536 11.6464C12.5488 11.8417 12.5488 12.1583 12.3536 12.3536C12.1583 12.5488 11.8417 12.5488 11.6464 12.3536L8 8.70711L4.35355 12.3536C4.15829 12.5488 3.84171 12.5488 3.64645 12.3536C3.45118 12.1583 3.45118 11.8417 3.64645 11.6464L7.29289 8L3.64645 4.35355C3.45118 4.15829 3.45118 3.84171 3.64645 3.64645Z"
                fill="#0F1314"
              />
            </svg>
            Stäng
          </button>
        </div>

        <div className="formwrapper">
          <div className="cancel-description">
            <p>
              Vill du avbryta skapandet av din företagsprofil? Ditt konto kommer
              fortfarande vara aktivt och du kommer kunna fortsätta skapa profil
              när du vill.
            </p>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="button-group">
          <button
            type="button"
            className="deleteButton"
            onClick={handleConfirmCancel}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Skapar profil..." : "Ja, fortsätt senare"}
          </button>

          <button
            type="button"
            className="cancelButton"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Nej, fortsätt skapa profil
          </button>
        </div>
      </div>
    </div>
  );
}