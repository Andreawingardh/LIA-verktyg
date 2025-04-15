"use client";
import React, { useEffect } from "react";
import "../form/popup.css";

export default function DeleteProfileOverlay({
  isOpen,
  onClose,
  onConfirm,
  companyName,
  isDeleting,
}) {
  // Add effect to prevent scrolling when overlay is open
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on body
      document.body.style.overflow = "hidden";

      // Clean up function to restore scrolling when component unmounts or overlay closes
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen]); // Re-run effect when isOpen changes

  if (!isOpen) return null;

  return (
    <div
      className="popup-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2 className="popup-title">Ta bort företagsprofil</h2>
          <button className="close-btn" onClick={onClose} disabled={isDeleting}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.64645 3.64645C3.84171 3.45118 4.15829 3.45118 4.35355 3.64645L8 7.29289L11.6464 3.64645C11.8417 3.45118 12.1583 3.45118 12.3536 3.64645C12.5488 3.84171 12.5488 4.15829 12.3536 4.35355L8.70711 8L12.3536 11.6464C12.5488 11.8417 12.5488 12.1583 12.3536 12.3536C12.1583 12.5488 11.8417 12.5488 11.6464 12.3536L8 8.70711L4.35355 12.3536C4.15829 12.5488 3.84171 12.5488 3.64645 12.3536C3.45118 12.1583 3.45118 11.8417 3.64645 11.6464L7.29289 8L3.64645 4.35355C3.45118 4.15829 3.45118 3.84171 3.64645 3.64645Z"
                fill="#0F1314"
              />
            </svg>
            <p className="close-btn-text">Stäng</p>
          </button>
        </div>

        <div className="cancel-description">
          <p>
            Är du säker på att du vill ta bort din företagsprofil? Alla dina
            positioner kommer också att tas bort. Det går inte att ångra detta.
          </p>
          {companyName && (
            <p className="company-name-confirmation">
              Företagsprofil som tas bort: <strong>{companyName}</strong>
            </p>
          )}
        </div>

        <div className="button-group">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="deleteButton"
          >
            {isDeleting ? "Tar bort..." : "Ja, ta bort företagsprofilen"}
          </button>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="secondary-button"
          >
            Nej, behåll företagsprofilen
          </button>
        </div>
      </div>
    </div>
  );
}
