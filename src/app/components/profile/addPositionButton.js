"use client";

import { useState } from "react";
import AddPositionOverlay from "./addPositionOverlay";

import { supabase } from "@/utils/supabase/client";
import React from "react";
import "../form/popup.css";

export default function AddPositionButton({ companyId, onProfileUpdate }) {
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.99966 3.15039C8.27581 3.15039 8.49966 3.37425 8.49966 3.65039V7.81705H12.6663C12.9425 7.81705 13.1663 8.0409 13.1663 8.31705C13.1663 8.59319 12.9425 8.81705 12.6663 8.81705H8.49966V12.9837C8.49966 13.2599 8.27581 13.4837 7.99966 13.4837C7.72352 13.4837 7.49966 13.2599 7.49966 12.9837V8.81705H3.33301C3.05687 8.81705 2.83301 8.59319 2.83301 8.31705C2.83301 8.0409 3.05687 7.81705 3.33301 7.81705H7.49966V3.65039C7.49966 3.37425 7.72352 3.15039 7.99966 3.15039Z"
            fill="white"
          />
        </svg>
        Lägg till position
      </button>

      <AddPositionOverlay
        isOpen={isOverlayOpen}
        onClose={closeOverlay}
        companyId={companyId}
        onProfileUpdate={onProfileUpdate}
      />
    </>
  );
}
