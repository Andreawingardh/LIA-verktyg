"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase/client';
import { useSupabaseAuth } from '../../../hook/useSupabaseAuth';
import CreatePositions from '../../positions/create/page'

import '../form/popup.css';


export default function AddPositionOverlay({ isOpen, onClose, companyId, onProfileUpdate }) {

  

  return (
    <div
    className="popup-overlay"
    style={{ display: isOpen ? "flex" : "none" }}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
      <div className="popup-content edit-profile-overlay" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" aria-label="Stäng">
          <p>Stäng</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
    
          >
            <path
              d="M1.8 18L0 16.2L7.2 9L0 1.8L1.8 0L9 7.2L16.2 0L18 1.8L10.8 9L18 16.2L16.2 18L9 10.8L1.8 18Z"
              fill="#1C1B1F"
            />
          </svg>
        </button>
        
        

        <CreatePositions
        companyId={companyId}
        onProfileUpdate={onProfileUpdate}
      />
        
      </div>
    </div>
  );
}