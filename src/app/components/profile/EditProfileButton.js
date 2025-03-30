"use client";

import { useState } from 'react';
import EditProfileOverlay from './EditProfileOverlay';
import '../form/popup.css'

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
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="edit-icon"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
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