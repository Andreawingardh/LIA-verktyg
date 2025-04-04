"use client";

import React from "react";
import "./companycard.css";
import Link from "next/link";
import { Button } from "../button/Button";
import "@/app/globals.css";
import styles from "@/app/components/cards/eventcard.module.css";

export const EventCard = ({ IsSubmitted }) => {
  async function handleSubmit(e) {}

  return (
    <>
      <div className={styles.mainDesktop}>
        <div className={styles.mainInformation}>
          <h3 className={styles.heading}>Om eventet</h3>
          <p>
            Mingla med oss för att hitta framtida medarbetare i ert företag
            eller bara jobba tillsammans under LIA. Ni kommer att träffa
            Webbutvecklare och Digital Designers från Yrgo som vill visa vad de
            har jobbat med under året och vi hoppas att ni hittar en match. 
          </p>
        </div>
        <form className={styles.eventForm}>
          <label>Namn</label>
          <input placeholder="Skriv ditt för- och efternamn" required />
          <label>Input</label>
          <input placeholder="Skriv din jobbmail" required />
          <div className={styles.checkbox}>
            <input type="checkbox" />
            Jag godkänner sekretesspolicyn.
          </div>
          <Button
            className="button"
            onClick={handleSubmit}
            text="Jag vill gå på eventet!"
          />
        </form>
      </div>
    </>
  );
};
