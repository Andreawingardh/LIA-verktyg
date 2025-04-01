"use client";

import { redirect } from "next/dist/server/api-utils";
import AuthenticationCheck from "../../auth/AuthenticationCheck";
import CreatePositionForm from "../../components/form/position/CreatePositionForm";
import styles from "../../page.module.css";
import { useSupabaseAuth } from "@/hook/useSupabaseAuth";

export default function Listings() {
  const { user, loading: authLoading } = useSupabaseAuth();
  console.log(user);

  if (!user) {
    return <p>You must be logged in to create a listing.</p>;
  }

  return <CreatePositionForm user={user} />;
}
