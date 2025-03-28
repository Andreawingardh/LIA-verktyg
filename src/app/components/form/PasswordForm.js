// "use client";

// import { useContext, useState } from "react";
// import { FormContext } from "./FormContext";
// import { createAccount } from "../../login/actions";

// export function CustomPasswordForm({ goToNextStep }) {
//   const { formData } = useContext(FormContext);
//   const [error, setError] = useState("");
  

//   const handleCreateAccount = async (formData) => {
//     const result = await createAccount(formData);
    
//     if (result.success) {
//       goToNextStep();
//     } else {
//       setError(result.error || "An error occurred during account creation");
//     }
//   };
  
//   return (
//     <>
//       <h2>Välj lösenord</h2>
//       <p>Skriv ett starkt lösenord för att logga in</p>
      
      
//       <form action={handleCreateAccount}>
//         {/* Hidden email field that gets the email from context */}
//         <input 
//           type="hidden" 
//           name="email" 
//           value={formData.email} 
//         />
//         {/* Hidden name field */}
//         <input 
//           type="hidden" 
//           name="name" 
//           value={formData.name} 
//         />
//         <label htmlFor="password">Lösenord</label>
//         <input 
//           id="password" 
//           name="password" 
//           type="password" 
//           required 
//           placeholder="Skriv ett starkt lösenord här"
//         />
//         <button formAction={handleCreateAccount}>Skapa konto</button>
//       </form>
//     </>
//   );
// }