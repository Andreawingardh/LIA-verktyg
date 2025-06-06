"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase/client";
import EditPositionForm from "../form/position/EditPositionForm";
import "../form/popup.css";

export default function EditPositionOverlay({
  isOpen,
  onClose,
  position,
  onPositionUpdate,
}) {
  // Add state to refresh position data when needed
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(position);

  useEffect(() => {
    if (position) {
      setCurrentPosition(position);
    }
  }, [position, isOpen]);

  // Handle position updates from the form
  const handlePositionUpdate = async (updatedPosition) => {
   

    // If position was deleted (null), close the overlay
    if (updatedPosition === null) {
      if (onPositionUpdate) {
        onPositionUpdate();
      }
      return;
    }

    // Trigger a refresh of the position data
    setRefreshTrigger((prev) => prev + 1);

    // Either use the updated position data directly or trigger a refresh in parent
    if (onPositionUpdate) {
      onPositionUpdate(updatedPosition);
    }
  };

  // Function to reload position data from database if needed
  useEffect(() => {
    if (refreshTrigger > 0 && position?.id) {
      const loadPositionData = async () => {
        try {
          const { data, error } = await supabase
            .from("positions")
            .select("*")
            .eq("id", position.id)
            .single();

          if (error) {
            console.error("Error reloading position:", error);
          } else if (data) {
           
            setCurrentPosition(data);
          }
        } catch (err) {
          console.error("Error in loadPositionData:", err);
        }
      };

      loadPositionData();
    }
  }, [refreshTrigger, position?.id]);


  return (
    <div
      className="popup-overlay-edit"
      style={{ display: isOpen ? "flex" : "none" }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      data-testid="edit-position-overlay"
    >
      <div
        className="popup-content-edit edit-position-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          <h2 className="popup-title">Redigera LIA-position</h2>
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
            <p className="close-btn-text">Avbryt</p>
          </button>
        </div>

        <EditPositionForm
          position={currentPosition}
          onPositionUpdate={handlePositionUpdate}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
