"use client";

import { useRouter } from "next/navigation";
import "./popup.css";

export default function CompletionConfirmationPopup({
  isOpen,
  onClose,
  onAddLiaPosition,
}) {

  const handleShowProfile = () => {
    onClose();
  };

  return (
    <div
      className="popup-overlay"
      style={{ display: isOpen ? "flex" : "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Profil skapad!</h2>
          <button className="close-btn" onClick={onClose}>
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

        <div className="formwrapper">
          <p>
            Nu kommer studenter kunna upptäcka er. Vill du fortsätta att lägga
            till era LIA-positioner?
          </p>

          <footer className="button-group">
            <button
              type="button"
              className="submitButton"
              onClick={onAddLiaPosition}
            >
              Ja, lägg till LIA-position
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleShowProfile}
            >
              Nej, visa mig min profil
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
