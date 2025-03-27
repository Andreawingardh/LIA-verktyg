"use client";

import { useContext } from "react";
import { FormContext } from "./FormContext";
import { signup } from "../../login/actions";

export function CompanyForm({ onSuccess }) {
  const { formData } = useContext(FormContext);

  return (
    <>
      <h2>Skapa företagsprofil</h2>
      <p>
        Skapa en profil för ditt företag för att bli upptäckt av studenter. Lägg
        upp era LIA-platser och bli upptäckt av sökande.
      </p>
      <form>
        {/* Hidden fields for data from previous steps */}
        <input type="hidden" name="email" value={formData.email} />
        <input type="hidden" name="name" value={formData.name} />

        <label htmlFor="companyName">Företagsnamn</label>
        <input id="companyName" name="companyName" type="text" required />

        <label htmlFor="description">Företagsbeskrivning</label>
        <textarea id="description" name="description" required />

        <label htmlFor="location">Kontorsort</label>
        <input id="location" name="location" type="text" required />

        <label htmlFor="website">Hemsida</label>
        <input id="website" name="website" type="url" required />

        <label htmlFor="contactEmail">Kontaktmail</label>
        <input id="contactEmail" name="contactEmail" type="email" required />

        <label htmlFor="logo">Logga</label>
        <input id="logo" name="logo" type="file" required />

        <button formAction={signup}>Skapa Företagsprofil</button>
      </form>
    </>
  );
}