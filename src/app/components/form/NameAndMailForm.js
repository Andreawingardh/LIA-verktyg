// "use client";

// import { createAccount } from "../../login/actions";
// import { useContext, useState, useEffect } from "react";
// import { FormContext } from "./FormContext";
// import { useRouter } from "next/navigation";

// export function CustomNameAndMailForm({ goToNextStep, onLoginClick }) {
//   const { updateFormData } = useContext(FormContext);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     name: ""
//   });
//   const [errors, setErrors] = useState({});
//   const [passwordTouched, setPasswordTouched] = useState(false);
//   const [emailTouched, setEmailTouched] = useState(false);
//   const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Update form data when inputs change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear specific error when user types
//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   // Form validation logic
//   const validateForm = () => {
//     const newErrors = {};
//     let formIsValid = true;
//     const missingRequirements = [];

//     // Email validation
//     if (formData.email) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(formData.email)) {
//         newErrors.email = "Mail följer inte rätt format. Exempel: exempel@exempel.se";
//         formIsValid = false;
//       }
//     }

//     // Password validation
//     if (formData.password) {
//       // Check for minimum length
//       if (formData.password.length < 8) {
//         missingRequirements.push('minLength');
//         formIsValid = false;
//       }
      
//       // Check for uppercase letters
//       if (!/[A-Z]/.test(formData.password)) {
//         missingRequirements.push('uppercase');
//         formIsValid = false;
//       }
      
//       // Check for lowercase letters
//       if (!/[a-z]/.test(formData.password)) {
//         missingRequirements.push('lowercase');
//         formIsValid = false;
//       }
      
//       // Check for numbers
//       if (!/\d/.test(formData.password)) {
//         missingRequirements.push('number');
//         formIsValid = false;
//       }
      
//       // Check for special characters
//       if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
//         missingRequirements.push('special');
//         formIsValid = false;
//       }

//       if (missingRequirements.length > 0) {
//         newErrors.password = "Lösenordet uppfyller inte kraven";
//         newErrors.passwordRequirements = missingRequirements;
//       }
//     }

//     setErrors(newErrors);
//     setIsFormValid(formIsValid);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate before submission
//     validateForm();
    
//     // Don't proceed if form is invalid
//     if (!isFormValid) {
//       return;
//     }
    
//     updateFormData({ 
//       email: formData.email, 
//       password: formData.password,
//       name: formData.name
//     });
    
//     // If all validation passes, go to next step
//     goToNextStep();
//   };

//   // Handle create account action
//   const handleCreateAccount = async (formData) => {
//     setIsLoading(true);
    
//     // Create a FormData instance for the server action
//     const serverFormData = new FormData();
//     serverFormData.append("email", formData.email);
//     serverFormData.append("password", formData.password);
//     if (formData.name) {
//       serverFormData.append("name", formData.name);
//     }
    
//     try {
//       const result = await createAccount(serverFormData);

//       if (result.success) {
//         updateFormData({ 
//           email: formData.email, 
//           password: formData.password,
//           name: formData.name
//         });
//         goToNextStep();
//       } else {
//         // Handle server validation errors
//         if (result.error.includes("email")) {
//           setErrors(prev => ({ ...prev, email: result.error }));
//         } else if (result.error.includes("password")) {
//           setErrors(prev => ({ ...prev, password: result.error }));
//         } else {
//           setErrors(prev => ({ ...prev, general: result.error }));
//         }
//       }
//     } catch (error) {
//       console.error("Error during account creation:", error);
//       setErrors(prev => ({ 
//         ...prev, 
//         general: "Ett oväntat fel uppstod vid kontoskapande" 
//       }));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle login button click
//   const handleLoginClick = (e) => {
//     e.preventDefault();
//     if (onLoginClick) {
//       onLoginClick();
//     }
//   };

//   // Password strength indicators removed
//   const getPasswordStrength = () => {
//     return 0; // Not used anymore
//   };
  
//   const renderPasswordStrengthIndicator = () => {
//     return null; // Not rendering password strength indicator
//   };

//   return (
//     <>
//       <h2>Skapa Företagskonto</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Name field (optional based on your requirements) */}
//         <div className="form-group">
//           <label htmlFor="name">Namn</label>
//           <input
//             id="name"
//             name="name"
//             type="text"
//             placeholder="Ditt namn (valfritt)"
//             value={formData.name}
//             onChange={handleInputChange}
//             disabled={isLoading}
//           />
//         </div>

//         {/* Email field */}
//         <div className="form-group">
//           <label htmlFor="email">E-post</label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             required
//             placeholder="Skriv din inloggningsmail"
//             value={formData.email}
//             onChange={handleInputChange}
//             disabled={isLoading}
//             className={errors.email ? "input-error" : ""}
//           />
//           {errors.email && <p className="error-message">{errors.email}</p>}
//         </div>

//         {/* Password field */}
//         <div className="form-group">
//           <label htmlFor="password">Lösenord</label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             required
//             placeholder="Skriv ett starkt lösenord"
//             value={formData.password}
//             onChange={handleInputChange}
//             disabled={isLoading}
//             className={errors.password ? "input-error" : ""}
//           />
//           {/* Fixed-height container for password requirements to prevent layout shifting */}
//           <div className="password-requirements-container">
//             {errors.password && errors.passwordRequirements && (
//               <>
//                 <p className="password-requirements-heading" style={{color: "#B40509"}}>Lösenordet behöver innehålla:</p>
//                 <ul className="password-requirements">
//                   {errors.passwordRequirements.includes('minLength') && (
//                     <li className="requirement-error">Minst 8 tecken</li>
//                   )}
//                   {errors.passwordRequirements.includes('uppercase') && (
//                     <li className="requirement-error">Minst en stor bokstav</li>
//                   )}
//                   {errors.passwordRequirements.includes('lowercase') && (
//                     <li className="requirement-error">Minst en liten bokstav</li>
//                   )}
//                   {errors.passwordRequirements.includes('number') && (
//                     <li className="requirement-error">Minst en siffra</li>
//                   )}
//                   {errors.passwordRequirements.includes('special') && (
//                     <li className="requirement-error">Minst ett specialtecken</li>
//                   )}
//                 </ul>
//               </>
//             )}
//           </div>
//         </div>

//         {/* General error message */}
//         {errors.general && <p className="error-message">{errors.general}</p>}

//         {/* Terms and conditions */}
//         <div className="checkbox-group">
//           <input id="checkbox" name="checkbox" type="checkbox" required />
//           <label htmlFor="checkbox">Jag godkänner</label>
//           <a href="">sekretesspolicy</a>
//         </div>

//         {/* Buttons */}
//         <div className="button-group">
//           <button 
//             type="button"
//             disabled={isLoading || !isFormValid} 
//             className={!isFormValid ? "button-disabled" : ""}
//             onClick={() => handleCreateAccount(formData)}
//           >
//             {isLoading ? "Skapar konto..." : "Skapa Företagsprofil"}
//           </button>
//         </div>
//         <div className="auth-buttons">
//           <button
//             type="button"
//             className="login-btn"
//             onClick={handleLoginClick}
//             disabled={isLoading}
//           >
//             Logga in
//           </button>
//         </div>
//       </form>
//     </>
//   );
// }