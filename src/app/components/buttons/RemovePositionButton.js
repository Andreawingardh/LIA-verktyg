"use client";
import { supabase } from "../../../utils/supabase/client";
import { useState } from "react";
import DeleteConfirmationOverlay from "../profile/DeletePositionOverlay";
import "../form/popup.css";

export default function RemovePositionButton({ position, onPositionUpdate }) {
  const [isDeleteOverlayOpen, setIsDeleteOverlayOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    
    setIsDeleteOverlayOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsSaving(true);

      // Call the RPC function with the correct name and parameter
      const { data, error } = await supabase.rpc(
        "delete_position_in_all_tables",
        { delete_position: position.id }
      );

      if (error) {
        throw error;
      }

  

      // Show success message
      setSuccessMessage("Positionen har tagits bort");

      // Notify parent component
      if (onPositionUpdate && typeof onPositionUpdate === "function") {

        onPositionUpdate(null); // Pass null to indicate deletion
      }

      // Close the confirmation overlay after deletion
      setIsDeleteOverlayOpen(false);
    } catch (error) {
      console.error("Error deleting position:", error);
      alert("Ett fel uppstod när positionen skulle tas bort: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="secondary-button deleteButton"
        onClick={handleDeleteClick}
        disabled={isSaving}
        aria-label="Ta bort position"
      >
        {isSaving ? "Tar bort..." : "Ta bort position"}
        {successMessage && <span className="success-message">{successMessage}</span>}
      </button>

      <DeleteConfirmationOverlay
        isOpen={isDeleteOverlayOpen}
        onClose={() => setIsDeleteOverlayOpen(false)}
        onConfirm={handleDeleteConfirm}
        positionTitle={position.title}
        isDeleting={isSaving}
      />
    </>
  );
}