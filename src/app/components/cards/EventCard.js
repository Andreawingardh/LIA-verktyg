"use client";

import React, { useState } from "react";
import "./companycard.css";
import Link from "next/link";
import { Button } from "../buttons/Button";
import "@/app/globals.css";
import styles from "@/app/components/cards/eventcard.module.css";
import { supabase } from "@/utils/supabase/client";
import "@/app/components/buttons/button.css";
import {
  EmailShareButton,
  FacebookMessengerShareButton,
  FacebookShareButton,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  ThreadsShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  GabIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  ThreadsIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
  XIcon,
  BlueskyIcon,
} from "react-share";
import { AddToCalendarButton } from "add-to-calendar-button-react";

export const EventCard = ({ IsSubmitted }) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);
  const eventTitle = "Yrgo:s mingelevent, 23 april";
  const eventDescription =
    "Mingla med oss för att hitta framtida medarbetare i ert företag eller bara jobba tillsammans under LIA. Ni kommer att träffa Webbutvecklare och Digital Designers från Yrgo som vill visa vad de har jobbat med under året och vi hoppas att ni hittar en match.";
  const eventUrl = "https://yrgo-internify.vercel.app/event";

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const formName = formData.get("name");
    const formEmail = formData.get("email");

    try {
      const { data, error } = await supabase
        .from("lia_event_attendes")
        .insert({ name: formName, email: formEmail })
        .select();

      if (error) {
        console.error("Error inserting data:", error);
        setSubmitStatus({ success: false, message: error.message });
        return;
      }

      if (data) {
        setSubmitStatus({ success: true });
      }
    } catch (e) {
      console.error(e);
      setSubmitStatus({
        success: false,
        message: "An unexpected error occurred",
      });
    }
  }

  return (
    <div className={styles.mainDesktop}>
      <div className={styles.eventWrapper}>
        <div className={styles.mainWrapper}>
          <div className={styles.mainInformation}>
            <h3 className={styles.heading}>Om eventet</h3>
            <p>
              Mingla med oss för att hitta framtida medarbetare i ert företag
              eller bara jobba tillsammans under LIA. Ni kommer att träffa
              Webbutvecklare och Digital Designers från Yrgo som vill visa vad
              de har jobbat med under året och vi hoppas att ni hittar en
              match. 
            </p>
          </div>{" "}
          {!submitStatus && (
            <form className={styles.eventForm} onSubmit={handleSubmit}>
              <section className={styles.formWrapper}>
                <div className={styles.inputSingle}>
                  <label>
                    Namn <span className={styles.asterix}> *</span>
                  </label>
                  <input
                    name="name"
                    placeholder="Skriv ditt för- och efternamn"
                    required
                  />
                </div>
                <div className={styles.inputSingle}>
                  <label>
                    E-post<span className={styles.asterix}> *</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Skriv din jobbmail"
                    required
                  />
                </div>

                <div className={styles.checkbox}>
                  <input type="checkbox" required />
                  Jag godkänner <a href="/privacy-policy">
                    sekretesspolicy
                  </a>{" "}
                  <span className={styles.asterix}> *</span>
                </div>
              </section>
              <div className={styles.confirmButton}>
                <Button
                  className="buttonEvent"
                  text="Jag vill gå på eventet!"
                />
              </div>
              {!submitStatus.success && <div> {submitStatus.message}</div>}
            </form>
          )}
          {submitStatus && (
            <div className={styles.eventForm}>
              <h4>Tack, vi ses snart! Dela gärna eventet med andra.</h4>
              <div className={styles.eventButton}>
                <LinkedinShareButton
                  url={eventUrl}
                  title={eventTitle}
                  description={eventDescription}
                >
                  <LinkedinIcon round={true} />
                </LinkedinShareButton>
                <FacebookShareButton
                  url={eventUrl}
                  title={eventTitle}
                  description={eventDescription}
                >
                  <FacebookIcon round={true}></FacebookIcon>
                </FacebookShareButton>
                <EmailShareButton
                  url={eventUrl}
                  subject={eventTitle}
                  body={eventDescription}
                  separator="---------"
                >
                  <EmailIcon round={true} />
                </EmailShareButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
