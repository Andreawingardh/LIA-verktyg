"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Validation helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password) {
  // Check minimum length
  if (password.length < 8) return false;
  
  // Check for uppercase, lowercase, number, and special character
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

export async function login(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");
  
  // Basic validation
  if (!email || !password) {
    redirect("/?error=" + encodeURIComponent("E-post och lösenord krävs"));
  }
  
  if (!isValidEmail(email)) {
    redirect("/?error=" + encodeURIComponent("Ogiltig e-postadress"));
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {

    
    // Map Supabase error messages to user-friendly errors
    let errorMessage;
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Fel e-post eller lösenord";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Din e-post har inte bekräftats. Kolla din inbox";
    } else if (error.message.includes("Too many requests")) {
      errorMessage = "För många inloggningsförsök. Vänligen försök igen senare";
    } else {
      errorMessage = error.message;
    }
    
    redirect("/?error=" + encodeURIComponent(errorMessage));
  }

 

  revalidatePath("/dashboard", "page");
  redirect("/dashboard");
}

export async function createAccount(formData) {
  const supabase = await createClient();

  // Extract form data
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  // Validation
  if (!email || !password) {
    return { error: "E-post och lösenord krävs" };
  }
  
  if (!isValidEmail(email)) {
    return { error: "Ogiltig e-postadress" };
  }
  
  if (!isStrongPassword(password)) {
    return { 
      error: "Lösenordet uppfyller inte säkerhetskraven" 
    };
  }

  // Try to create the account
  try {
    // The signUp method expects this specific structure
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });

    if (error) {
      
      
      // Map error messages to user-friendly errors
      if (error.message.includes("already registered")) {
        return { error: "E-postadressen är redan registrerad" };
      }
      
      return { error: error.message };
    }

    return { success: true, user: authData?.user };
  } catch (err) {
    console.error("Unexpected error during account creation:", err);
    return { error: "Ett oväntat fel uppstod" };
  }
}

export async function signup(formData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/?error=" + encodeURIComponent("Du måste vara inloggad för att skapa en företagsprofil"));
  }

  const companyName = formData.get("companyName");
  const description = formData.get("description");
  const location = formData.get("location");
  const website = formData.get("website");
  const contactEmail = formData.get("contactEmail");

  // Validation
  if (!companyName || !contactEmail) {
    redirect("/?error=" + encodeURIComponent("Företagsnamn och e-post krävs"));
  }
  
  if (contactEmail && !isValidEmail(contactEmail)) {
    redirect("/?error=" + encodeURIComponent("Ogiltig e-postadress"));
  }
  
  if (website && !website.startsWith("http")) {
    // Simple website validation
    const websiteValue = website.startsWith("www.") ? `https://${website}` : `https://www.${website}`;
    formData.set("website", websiteValue);
  }

  console.log(companyName, user);

  try {
    // Insert into positions table
    const { data: insertData, error: insertError } = await supabase
      .from("companies")
      .insert({
        name: companyName,
        description: description,
        location: location,
        website: website,
        email: contactEmail,
        user_id: user.id,
      });
    
    if (insertError) {
      console.error("Error inserting data:", insertError);
      redirect("/?error=" + encodeURIComponent(insertError.message));
    }


    // Reset form or show success message
  } catch (error) {
    console.error("Error inserting data:", error);
    redirect("/?error=" + encodeURIComponent("Ett fel uppstod när företaget skulle skapas"));
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}