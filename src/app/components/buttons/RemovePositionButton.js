"use client";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import React from "react";
import "../form/popup.css";

export default function RemovePositionButton({ position, onPositionUpdate }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleDelete = async (e) => {
    // Prevent event bubbling to parent elements
    e.stopPropagation();
    
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setIsSaving(true);
      console.log(`Deleting position ID: ${position.id}`);

      // Call the RPC function with the correct name and parameter
      const { data, error } = await supabase.rpc(
        "delete_position_in_all_tables",
        { delete_position: position.id }
      );

      if (error) {
        console.error("Error deleting position:", error);
        throw error;
      }

      console.log("Position and related entries deleted successfully");

      // Show success message
      setSuccessMessage("Positionen har tagits bort");

      // Notify parent component
      if (onPositionUpdate && typeof onPositionUpdate === "function") {
        console.log("Calling onPositionUpdate callback after deletion");
        onPositionUpdate(null); // Pass null to indicate deletion
      }

      // Reset confirm state (even though the component will unmount)
      setConfirmDelete(false);
    } catch (error) {
      console.error("Error deleting position:", error);
      alert("Ett fel uppstod när positionen skulle tas bort: " + error.message);
      // Reset confirm state on error
      setConfirmDelete(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      type="button"
      className="secondary-button deleteButton"
      onClick={handleDelete}
      disabled={isSaving}
    >
      {isSaving ? "Tar bort..." : confirmDelete ? "Bekräfta borttagning" : "Ta bort position"}
      {successMessage && <span className="success-message">{successMessage}</span>}
    </button>
  );
}