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

  // Form validation states
  const [formErrors, setFormErrors] = useState({
    name: { error: false, message: "" },
    email: { error: false, message: "" },
    privacy: { error: false, message: "" },
  });

  // Track whether fields have been touched
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    privacy: false,
  });

  const eventTitle = "Yrgo:s mingelevent, 23 april";
  const eventDescription =
    "Mingla med oss för att hitta framtida medarbetare i ert företag eller bara jobba tillsammans under LIA. Ni kommer att träffa Webbutvecklare och Digital Designers från Yrgo som vill visa vad de har jobbat med under året och vi hoppas att ni hittar en match.";
  const eventUrl = "https://yrgo-internify.vercel.app/event";

  // Validation functions
  const validateName = (name) => {
    if (!name || name.trim() === "") {
      return { error: true, message: "Namn är obligatoriskt" };
    }
    return { error: false, message: "" };
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim() === "") {
      return { error: true, message: "E-post är obligatoriskt" };
    } else if (!emailRegex.test(email)) {
      return { error: true, message: "Ange en giltig e-postadress" };
    }
    return { error: false, message: "" };
  };

  const validatePrivacy = (checked) => {
    if (!checked) {
      return { error: true, message: "Du måste godkänna sekretesspolicyn" };
    }
    return { error: false, message: "" };
  };

  // Handle field blur (when user leaves a field)
  const handleBlur = (field, value) => {
    setTouched({
      ...touched,
      [field]: true,
    });

    let validationResult;

    switch (field) {
      case "name":
        validationResult = validateName(value);
        break;
      case "email":
        validationResult = validateEmail(value);
        break;
      case "privacy":
        validationResult = validatePrivacy(value);
        break;
      default:
        validationResult = { error: false, message: "" };
    }

    setFormErrors({
      ...formErrors,
      [field]: validationResult,
    });
  };

  // Handle field change
  const handleChange = (field, value) => {
    if (touched[field]) {
      let validationResult;

      switch (field) {
        case "name":
          validationResult = validateName(value);
          break;
        case "email":
          validationResult = validateEmail(value);
          break;
        case "privacy":
          validationResult = validatePrivacy(value);
          break;
        default:
          validationResult = { error: false, message: "" };
      }

      setFormErrors({
        ...formErrors,
        [field]: validationResult,
      });
    }
  };

  // Validate all fields
  const validateForm = (formData) => {
    const name = formData.get("name");
    const email = formData.get("email");
    const privacy = formData.get("privacy") === "on";

    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const privacyValidation = validatePrivacy(privacy);

    const newFormErrors = {
      name: nameValidation,
      email: emailValidation,
      privacy: privacyValidation,
    };

    setFormErrors(newFormErrors);

    // Set all fields as touched
    setTouched({
      name: true,
      email: true,
      privacy: true,
    });

    // Return true if no errors
    return (
      !nameValidation.error &&
      !emailValidation.error &&
      !privacyValidation.error
    );
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Validate the form
    const isValid = validateForm(formData);

    if (!isValid) {
      return;
    }

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
              de har jobbat med under året och vi hoppas att ni hittar en match.
            </p>
          </div>{" "}
          {!submitStatus && (
            <form
              className={styles.eventForm}
              onSubmit={handleSubmit}
              noValidate
            >
              <section className={styles.formWrapper}>
                <div className={styles.inputSingle}>
                  <label>
                    Namn <span className={styles.asterix}> *</span>
                  </label>
                  <input
                    name="name"
                    placeholder="Skriv ditt för- och efternamn"
                    className={formErrors.name.error ? styles.inputError : ""}
                    onBlur={(e) => handleBlur("name", e.target.value)}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  {formErrors.name.error && (
                    <span className={styles.errorMessage}>
                      {formErrors.name.message}
                    </span>
                  )}
                </div>

                <div className={styles.inputSingle}>
                  <label>
                    E-post<span className={styles.asterix}> *</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Skriv din jobbmail"
                    className={formErrors.email.error ? styles.inputError : ""}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                  {formErrors.email.error && (
                    <span className={styles.errorMessage}>
                      {formErrors.email.message}
                    </span>
                  )}
                </div>

                <div
                  className={`${styles.checkbox} ${
                    formErrors.privacy.error ? styles.checkboxError : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name="privacy"
                    onBlur={(e) => handleBlur("privacy", e.target.checked)}
                    onChange={(e) => handleChange("privacy", e.target.checked)}
                  />
                  Jag godkänner <a href="/privacy-policy">sekretesspolicy</a>{" "}
                  <span className={styles.asterix}> *</span>
                </div>
                {formErrors.privacy.error && (
                  <span className={styles.errorMessage}>
                    {formErrors.privacy.message}
                  </span>
                )}
              </section>
              <div className={styles.confirmButton}>
                <Button
                  className="buttonEvent"
                  text="Jag vill gå på eventet!"
                />
              </div>
              {submitStatus && !submitStatus.success && (
                <div className={styles.formError}>{submitStatus.message}</div>
              )}
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
