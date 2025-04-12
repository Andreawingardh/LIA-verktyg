"use client";

import { useState, useEffect } from "react";
import EditPositionOverlay from "./EditPositionOverlay";
import { supabase } from "@/utils/supabase/client";
import "../form/popup.css";

export default function EditPositionButton({ position, onPositionUpdate }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);

  // Update local state when position prop changes
  useEffect(() => {
    if (position) {
      setCurrentPosition(position);
    }
  }, [position]);

  const handleOpenOverlay = () => {
    setIsOverlayOpen(true);
  };

  // Function to refresh position data from database
  const refreshPositionData = async () => {
    if (position && position.id) {
      try {
        // First fetch the basic position data
        const { data: positionData, error: positionError } = await supabase
          .from("positions")
          .select("*")
          .eq("id", position.id)
          .single();

        if (positionError) {
          console.error("Error fetching position data:", positionError);
          return;
        }

        if (!positionData) {
          console.error("Position not found in database");
          return;
        }

        // Determine table name for skills
        const tableName =
          positionData.title === "Webbutvecklare"
            ? "webbutvecklare"
            : positionData.title === "Digital designer"
            ? "digitaldesigner"
            : "";

        if (!tableName) {
          console.error("Could not determine table name for skills");
          return;
        }

        // Then fetch the associated skills
        const { data: skillsData, error: skillsError } = await supabase
          .from(`${tableName}_skill_position`)
          .select(
            `
            skills_id,
            skills_${tableName}(*)
          `
          )
          .eq("position_id", position.id);

        if (skillsError) {
          console.error("Error fetching skills data:", skillsError);
          return;
        }

        // Parse skills into main skills and software
        const mainSkills = [];
        const software = [];

        if (skillsData && skillsData.length > 0) {
          skillsData.forEach((item) => {
            const skill = item[`skills_${tableName}`];
            if (skill) {
              if (skill.type === "Skills") {
                mainSkills.push(skill);
              } else if (skill.type === "Software") {
                software.push(skill);
              }
            }
          });
        }

        // Create a complete position object
        const updatedPosition = {
          ...positionData,
          mainSkills,
          software,
        };

        // Update local state
        setCurrentPosition(updatedPosition);

        // Propagate to parent if callback exists
        if (onPositionUpdate && typeof onPositionUpdate === "function") {
          onPositionUpdate(updatedPosition);
        }
      } catch (err) {
        console.error("Error in refreshPositionData:", err);
      }
    }
  };

  // Simplified button click handler using mousedown instead of click
  const handleMouseDown = (e) => {
    // This is crucial - stop the mousedown event from propagating to parent elements
    e.stopPropagation();
  };

  const handleClick = (e) => {
    // Prevent default browser behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();

    // Set the overlay state directly
    setIsOverlayOpen(true);

    // Refresh data after opening overlay
    refreshPositionData();
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);

    // Always refresh data after closing overlay
    setTimeout(() => {
      refreshPositionData();
    }, 100);
  };

  // Handle updates from the overlay
  const handlePositionUpdate = (updatedPosition) => {
    if (updatedPosition) {
      setCurrentPosition(updatedPosition);
    }

    // Force a complete refresh of data from the database
    setTimeout(() => {
      refreshPositionData();
    }, 200);

    // Propagate update to parent
    if (onPositionUpdate && typeof onPositionUpdate === "function") {
      onPositionUpdate(updatedPosition);
    }
  };

  return (
    <>
      <button
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className="edit-position-button secondary-button"
        aria-label="Redigera position"
      >
        Redigera
      </button>

      {isOverlayOpen && (
        <div
          onClick={(e) => {
            // Prevent clicks on the overlay from reaching the card
            e.stopPropagation();
          }}
        >
          <EditPositionOverlay
            isOpen={isOverlayOpen}
            onClose={closeOverlay}
            position={currentPosition}
            onPositionUpdate={handlePositionUpdate}
          />
        </div>
      )}
    </>
  );
}
