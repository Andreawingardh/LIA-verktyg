"use client";

import { login, signup } from "../../../login/actions";
import { useContext, useState } from "react";
import { FormContext } from "../../../components/form/FormContext";
import { useRouter } from "next/navigation";

export default function NameAndMailForm() {
  const { updateFormData } = useContext(FormContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData({ name, email });

    // Navigate to password form
    router.push("./PasswordForm"); // Update with your actual route
  };

  return (
    <>
      <h2>Registrera ditt företag</h2>
      <h3>Stäng</h3>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M1.8 18L0 16.2L7.2 9L0 1.8L1.8 0L9 7.2L16.2 0L18 1.8L10.8 9L18 16.2L16.2 18L9 10.8L1.8 18Z"
          fill="#1C1B1F"
        />
      </svg>
      <p>
        Skriv upp ditt företag för att gå på Yrgos mingelevent inför
        LIA-perioden i november. Skapa en företagsprofil för att bli upptäckt av
        eran framtida kollega!
      </p>
      <form>
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
        <button formAction="">Jag har inget företag</button>
        <button formAction="">Jag vill bara gå på mingelevent</button>
        <button formAction="./PasswordForm">Skapa Företagsprofil</button>
      </form>
    </>
  );
}
