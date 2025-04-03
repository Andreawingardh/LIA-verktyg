"use client";

import { useEffect, useState } from "react";

export function ProgressIndicator({ currentStep }) {
  const [stepsStatus, setStepsStatus] = useState({
    baseInfo: 'inactive',
    description: 'inactive',
    contact: 'inactive'
  });

  useEffect(() => {
    // Check localStorage for the history of steps visited
    const visitedSteps = localStorage.getItem("visitedSteps") 
      ? JSON.parse(localStorage.getItem("visitedSteps")) 
      : [];
    
    // Update the current step in localStorage
    if (!visitedSteps.includes(currentStep)) {
      visitedSteps.push(currentStep);
      localStorage.setItem("visitedSteps", JSON.stringify(visitedSteps));
    }
    
    // Set the status for each step
    const newStatus = {
      baseInfo: 'inactive',
      description: 'inactive',
      contact: 'inactive'
    };
    
    // Mark steps as completed or active
    visitedSteps.forEach(step => {
      if (step === currentStep) {
        newStatus[step] = 'active';
      } else {
        newStatus[step] = 'completed';
      }
    });
    
    setStepsStatus(newStatus);
  }, [currentStep]);

  return (
    <section className="progressWrapper">
      <article className="progressTab">
        <div className={`progressBar ${stepsStatus.baseInfo !== 'active' ? stepsStatus.baseInfo : ''}`}></div>
        <p className={`progressPosition ${stepsStatus.baseInfo !== 'active' ? stepsStatus.baseInfo : ''}`}>Basinfo</p>
      </article>
      <article className="progressTab">
        <div className={`progressBar ${stepsStatus.description !== 'active' ? stepsStatus.description : ''}`}></div>
        <p className={`progressPosition ${stepsStatus.description !== 'active' ? stepsStatus.description : ''}`}>Beskrivning</p>
      </article>
      <article className="progressTab">
        <div className={`progressBar ${stepsStatus.contact !== 'active' ? stepsStatus.contact : ''}`}></div>
        <p className={`progressPosition ${stepsStatus.contact !== 'active' ? stepsStatus.contact : ''}`}>Kontakt</p>
      </article>
    </section>
  );
}
