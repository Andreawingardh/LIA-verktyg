"use client";

import { useState } from "react";
import EditProfileOverlay from "./EditProfileOverlay";
import "../form/popup.css";

export default function EditProfileButton({ companyId, onProfileUpdate }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const openOverlay = () => {
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <>
      <button
        onClick={openOverlay}
        className="edit-profile-button primary-button"
        aria-label="Redigera företagsprofil"
      >
        Redigera Profil
      </button>

      <EditProfileOverlay
        isOpen={isOverlayOpen}
        onClose={closeOverlay}
        companyId={companyId}
        onProfileUpdate={onProfileUpdate}
      />
    </>
  );
}
