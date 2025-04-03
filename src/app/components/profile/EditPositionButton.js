"use client";

import { useState, useEffect } from 'react';
import EditPositionOverlay from './EditPositionOverlay';
import { supabase } from "@/utils/supabase/client";
import React from "react";
import '../form/popup.css'

export default function EditPositionButton({ position, onPositionUpdate }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Update local state when position prop changes
  useEffect(() => {
    if (position) {
      console.log("Position updated in EditPositionButton:", position);
      setCurrentPosition(position);
    }
  }, [position]);
  
  // Function to refresh position data from database
  const refreshPositionData = async () => {
    if (position && position.id) {
      try {
        console.log("Refreshing position data from database");
        
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
        
        console.log("Fetched position data:", positionData);
        
        // Determine table name for skills
        const tableName = positionData.title === "Webbutvecklare" 
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
          .select(`
            skills_id,
            skills_${tableName}(*)
          `)
          .eq("position_id", position.id);
          
        if (skillsError) {
          console.error("Error fetching skills data:", skillsError);
          return;
        }
        
        console.log("Fetched skills data:", skillsData);
        
        // Parse skills into main skills and software
        const mainSkills = [];
        const software = [];
        
        if (skillsData && skillsData.length > 0) {
          skillsData.forEach(item => {
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
          software
        };
        
        console.log("Complete refreshed position:", updatedPosition);
        
        // Update local state
        setCurrentPosition(updatedPosition);
        
        // Propagate to parent if callback exists
        if (onPositionUpdate && typeof onPositionUpdate === 'function') {
          onPositionUpdate(updatedPosition);
        }
      } catch (err) {
        console.error("Error in refreshPositionData:", err);
      }
    }
  };

  const openOverlay = () => {
    console.log("Opening position edit overlay");
    
    // Refresh data before opening overlay
    refreshPositionData();
    
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    console.log("Closing position edit overlay");
    setIsOverlayOpen(false);
    
    // Always refresh data after closing overlay
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 100);
  };
  
  // Handle updates from the overlay
  const handlePositionUpdate = (updatedPosition) => {
    console.log("Position update received in button:", updatedPosition);
    
    if (updatedPosition) {
      setCurrentPosition(updatedPosition);
    }
    
    // Force a complete refresh of data from the database
    setTimeout(() => {
      refreshPositionData();
    }, 200);
    
    // Propagate update to parent
    if (onPositionUpdate && typeof onPositionUpdate === 'function') {
      onPositionUpdate(updatedPosition);
    }
  };
  
  // Refresh position data when trigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      refreshPositionData();
    }
  }, [refreshTrigger]);

  return (
    <>
      <button 
        onClick={openOverlay} 
        className="edit-position-button secondary-button"
        aria-label="Redigera position"
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
        Redigera
      </button>

      <EditPositionOverlay 
        isOpen={isOverlayOpen} 
        onClose={closeOverlay} 
        position={currentPosition}
        onPositionUpdate={handlePositionUpdate}
      />  
    </>
  );
} 