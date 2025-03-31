'use client'

import { redirect } from "next/dist/server/api-utils";
import AuthenticationCheck from "../../auth/AuthenticationCheck";
import CreateListingForm from "../../components/form/listing/CreateListingForm-inserts";
import styles from "../../page.module.css";
import { useSupabaseAuth } from "@/hook/useSupabaseAuth";


export default function Listings() {

  const { user, loading: authLoading } = useSupabaseAuth();
  console.log(user)

  if (!user) {
    return <p>You must be logged in to create a listing.</p>
  }

  return <CreateListingForm user={user} />

}
  
  