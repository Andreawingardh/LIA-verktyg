"use client";

import { useRouter } from "next/navigation";

export default function SignupSuccessPage() {
  const router = useRouter();
  
  return (
    <div className="container success-page">
      <h2>Registrering slutförd</h2>
      <p>
        Ditt företagskonto har skapats framgångsrikt! 
        Du kan nu logga in och börja lägga upp LIA-platser.
      </p>
      <div className="button-group">
        <button onClick={() => router.push('/dashboard')}>
          Gå till Dashboard
        </button>
        <button onClick={() => router.push('/')}>
          Tillbaka till Startsidan
        </button>
      </div>
    </div>
  );
}