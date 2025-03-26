"use client";

import { login, signup } from "../../login/actions";
import { useContext, useState } from "react";
import { FormContext } from "./FormContext";
import { useRouter } from "next/navigation";

export function CustomNameAndMailForm({ goToNextStep }) {
  const { updateFormData } = useContext(FormContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData({ name, email });
    goToNextStep();
  };
  
  return (
    <>
      <h2>Registrera ditt företag</h2>
      <p>
        Skriv upp ditt företag för att gå på Yrgos mingelevent inför
        LIA-perioden i november. Skapa en företagsprofil för att bli upptäckt av
        eran framtida kollega!
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Namn</label>
        <input
          id="name"
          name="name"
          type="name"
          required
          placeholder="Skriv ditt namn här"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email">Arbetsmail</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Skriv din arbetsmail här"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="button-group">
          <button type="button">Jag har inget företag</button>
          <button type="button">Jag vill bara gå på mingelevent</button>
          <button type="submit">Skapa Företagsprofil</button>
        </div>
      </form>
    </>
  );
}
