"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log("Login error details:", error.message);
    redirect("/?error=" + encodeURIComponent(error.message));
  }


  console.log("Login successful for:", authData.user.email);

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function createAccount(formData) {
  const supabase = await createClient();

  // Make sure we have email and password
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  if (!email || !password) {
    console.log("Email and password are required");
    return { error: "Email and password are required" };
  }

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
    console.log("Signup error details:", error.message);
    return { error: error.message };
  }

  return { success: true, user: authData?.user };
}

export async function signup(formData) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.log("User not found:", error?.message);
  }

  const companyName = formData.get("companyName");
  const description = formData.get("description");
  const location = formData.get("location");
  const website = formData.get("website");
  const contactEmail = formData.get("contactEmail");

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
    
    if (error) throw error;

    console.log("Data inserted successfully", formData);

    // Reset form or show success message
  } catch (error) {
    console.error("Error inserting data:", error);
    console.error("Full response:", { data, error });
  }

  if (error) {
    console.log("Company profile update error:", error.message);
    redirect("/?error=" + encodeURIComponent(error.message));
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
