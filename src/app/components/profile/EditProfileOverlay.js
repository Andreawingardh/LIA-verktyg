"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase/client";
import { useSupabaseAuth } from "../../../hook/useSupabaseAuth";
import "../form/popup.css";

const FORM_STORAGE_KEY = "company_edit_form_data";
const MAX_DESCRIPTION_LENGTH = 120;
const MAX_NAME_LENGTH = 25;
const MAX_LOCATION_LENGTH = 25;

export default function EditProfileOverlay({
  isOpen,
  onClose,
  companyId,
  onProfileUpdate,
}) {
  const { user } = useSupabaseAuth();
  const [companyData, setCompanyData] = useState({
    name: "",
    description: "",
    location: "",
    website: "",
    email: "",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [displayImagePreview, setDisplayImagePreview] = useState(null);
  const [newLogo, setNewLogo] = useState(null);
  const [newDisplayImage, setNewDisplayImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formId, setFormId] = useState("");
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    website: ""
  });

  // Generate a unique form ID when the overlay opens
  useEffect(() => {
    if (isOpen) {
      setFormId(`form_${Date.now()}`);
    }
  }, [isOpen]);


  useEffect(() => {
    if (formId && isOpen && (companyId || user)) {
      // When formId is set, trigger data fetch again to ensure proper loading
      fetchCompanyData();
    }
  }, [formId]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (formId && companyData && isOpen) {
      const dataToSave = {
        formData: companyData,
        logoPreview,
        displayImagePreview,
        timestamp: Date.now(),
      };

      localStorage.setItem(
        `${FORM_STORAGE_KEY}_${formId}`,
        JSON.stringify(dataToSave)
      );
    }
  }, [companyData, logoPreview, displayImagePreview, formId, isOpen]);

  // Add event listeners for tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && formId) {
        // When tab becomes visible again, check for saved data
        const savedData = localStorage.getItem(`${FORM_STORAGE_KEY}_${formId}`);
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            setCompanyData(parsedData.formData);
            setDescriptionCharCount(parsedData.formData.description.length);

            if (parsedData.logoPreview) {
              setLogoPreview(parsedData.logoPreview);
            }

            if (parsedData.displayImagePreview) {
              setDisplayImagePreview(parsedData.displayImagePreview);
            }

          } catch (err) {
            console.error("Error parsing saved form data", err);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [formId]);

  // Fetch company data when overlay opens
  useEffect(() => {
    if (isOpen && (companyId || user)) {
      fetchCompanyData();
    }
  }, [isOpen, companyId, user]);

  useEffect(() => {
  }, [companyData]);

  const fetchCompanyData = async () => {
    setLoading(true);
    setError("");

    try {
      // Query based on companyId if provided, otherwise use the logged-in user
      const query = supabase.from("companies").select("*");

      if (companyId) {
        query.eq("id", companyId);
      } else if (user) {
        query.eq("user_id", user.id);
      } else {
        throw new Error("Ingen företagsprofil hittades");
      }

      const { data, error: fetchError } = await query.single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error("Ingen företagsprofil hittades");

      // Check if we have saved draft data from a previous edit
      const savedData = localStorage.getItem(`${FORM_STORAGE_KEY}_${formId}`);

      if (savedData) {
        // We have saved draft data, use it
        try {
          const parsedData = JSON.parse(savedData);
          setCompanyData(parsedData.formData);
          setDescriptionCharCount(parsedData.formData.description.length);

          if (parsedData.logoPreview) {
            setLogoPreview(parsedData.logoPreview);
          } else if (data.logo_url && data.logo_url !== "pending") {
            setLogoPreview(data.logo_url);
          }

          if (parsedData.displayImagePreview) {
            setDisplayImagePreview(parsedData.displayImagePreview);
          } else if (
            data.display_image_url &&
            data.display_image_url !== "pending"
          ) {
            setDisplayImagePreview(data.display_image_url);
          }
        } catch (err) {
          // Fall back to the fetched data
          populateFormWithFetchedData(data);
        }
      } else {
        // No saved draft data, use the fetched data
        populateFormWithFetchedData(data);
      }
    } catch (err) {
      setError(
        "Kunde inte hämta företagsinformation: " + (err.message || "Okänt fel")
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to populate the form with fetched data
  const populateFormWithFetchedData = (data) => {
    setCompanyData({
      name: data.name || "",
      description: data.description || "",
      location: data.location || "",
      website: data.website || "",
      email: data.email || "",
    });
    
    // Set the description character count
    setDescriptionCharCount(data.description ? data.description.length : 0);

    // Set logo preview if exists
    if (data.logo_url && data.logo_url !== "pending") {
      setLogoPreview(data.logo_url);
    }

    // Set display image preview if exists
    if (data.display_image_url && data.display_image_url !== "pending") {
      setDisplayImagePreview(data.display_image_url);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
    
    // If it's the description field, update the char count
    if (name === "description") {
      // Limit text to MAX_DESCRIPTION_LENGTH characters
      if (value.length <= MAX_DESCRIPTION_LENGTH) {
        setCompanyData((prev) => ({
          ...prev,
          [name]: value,
        }));
        setDescriptionCharCount(value.length);
      }
    } else {
      // Handle all other fields
      setCompanyData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewLogo(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDisplayImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewDisplayImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setDisplayImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      email: "",
      website: ""
    };

    // Validate company name
    if (!companyData.name.trim()) {
      errors.name = "Företagsnamn måste anges";
      isValid = false;
    }

    // Validate email if provided
    if (companyData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(companyData.email)) {
        errors.email = "Ange en giltig e-postadress";
        isValid = false;
      }
    }

    // Validate website if provided
    if (companyData.website) {
      try {
        new URL(companyData.website);
      } catch (e) {
        errors.website = "Ange en giltig webbadress (t.ex. https://exempel.se)";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let logoUrl = null;
      let displayImageUrl = null;

      // Upload new logo if changed
      if (newLogo) {
        const fileExt = newLogo.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        const filePath = `company-logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, newLogo);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        logoUrl = data.publicUrl;
      }

      // Upload new display image if changed
      if (newDisplayImage) {
        const fileExt = newDisplayImage.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        const filePath = `company-displays/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, newDisplayImage);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        displayImageUrl = data.publicUrl;
      }

      // Prepare update data
      const updateData = {
        name: companyData.name,
        description: companyData.description,
        location: companyData.location,
        website: companyData.website,
        email: companyData.email,
      };

      // Add logo url if uploaded
      if (logoUrl) {
        updateData.logo_url = logoUrl;
      }

      // Add display image url if uploaded
      if (displayImageUrl) {
        updateData.display_image_url = displayImageUrl;
      }

      // Update company profile
      const query = supabase.from("companies").update(updateData);

      if (companyId) {
        query.eq("id", companyId);
      } else if (user) {
        query.eq("user_id", user.id);
      } else {
        throw new Error("Ingen företagsprofil hittades för uppdatering");
      }

      const { error: updateError } = await query;

      if (updateError) throw updateError;

      setSuccess("Företagsprofilen har uppdaterats!");

      // Clear saved form data
      if (formId) {
        localStorage.removeItem(`${FORM_STORAGE_KEY}_${formId}`);
      }

      // Reset file inputs
      setNewLogo(null);
      setNewDisplayImage(null);

      // Call the callback function with the updated data
      if (typeof onProfileUpdate === "function") {
        onProfileUpdate(updateData);
      }

      // Close overlay after a brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(
        "Kunde inte uppdatera företagsprofilen: " + (err.message || "Okänt fel")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Clear saved form data
    if (formId) {
      localStorage.removeItem(`${FORM_STORAGE_KEY}_${formId}`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="popup-overlay-edit"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
    >
      <div
        className="popup-content-edit edit-profile-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          <h2 className="popup-title">Redigera profil</h2>
          <button className="close-btn" onClick={handleCancel}>
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

        {loading ? (
          <div className="loading">Laddar företagsinformation...</div>
        ) : (
          <form className="formwrapper" onSubmit={handleSubmit}>
            <div className="inputSingle">
              <article className="inputHeader">
                <label className="popupTitle" htmlFor="company_name">
                  Företagsnamn <span className="asterix">*</span>
                </label>
                
              </article>
              <input
                id="company_name"
                name="name"
                type="text"
                className={`inputs ${formErrors.name ? 'input-error' : ''}`}
                required
                value={companyData.name}
                onChange={handleInputChange}
                disabled={saving}
                placeholder="Ditt företagsnamn"
                maxLength={MAX_NAME_LENGTH}
              />
              {formErrors.name && <p className="error-message">{formErrors.name}</p>}
            </div>

            <div className="inputSingle">
              <article className="inputHeader">
                <label className="popupTitle" htmlFor="location">
                  Kontorsort <span className="asterix">*</span>
                </label>
              </article>
              <input
                id="location"
                name="location"
                type="text"
                className="inputs"
                required
                value={companyData.location}
                onChange={handleInputChange}
                disabled={saving}
                placeholder="Var finns ert kontor?"
                maxLength={MAX_LOCATION_LENGTH}
              />
            </div>

            <div className="inputSingle">
              <article className="inputHeader">
                <label className="popupTitle" htmlFor="website">
                  Hemsida <span className="asterix">*</span>
                </label>
              </article>
              <input
                id="website"
                name="website"
                type="url"
                className={`inputs ${formErrors.website ? 'input-error' : ''}`}
                required
                value={companyData.website}
                onChange={handleInputChange}
                disabled={saving}
                placeholder="https://www.dittforetag.se"
              />
              {formErrors.website && <p className="error-message">{formErrors.website}</p>}
            </div>

            <div className="inputSingle">
              <article className="inputHeader">
                <label className="popupTitle" htmlFor="contact_email">
                  Kontaktmail
                </label>
              </article>
              <input
                id="contact_email"
                name="email"
                type="email"
                className={`inputs ${formErrors.email ? 'input-error' : ''}`}
                value={companyData.email}
                onChange={handleInputChange}
                disabled={saving}
                placeholder="kontakt@dittforetag.se"
              />
              {formErrors.email && <p className="error-message">{formErrors.email}</p>}
            </div>

            <div className="inputSingle">
              <article className="inputHeader">
                <label className="popupTitle" htmlFor="description">
                  Företagsbeskrivning
                </label>
              </article>
              <div className="description-container">
                <textarea
                  id="description"
                  name="description"
                  className="descriptionInput"
                  value={companyData.description}
                  onChange={handleInputChange}
                  disabled={saving}
                  placeholder="Berätta om ert företag, er verksamhet och vad ni erbjuder"
                  rows={5}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
                <div className={`char-counter ${descriptionCharCount >= MAX_DESCRIPTION_LENGTH ? 'char-counter-max' : ''}`}>
                  {descriptionCharCount}/{MAX_DESCRIPTION_LENGTH}
                </div>
              </div>
            </div>

            <div className="inputSingle">
              <article className="inputHeader">
                <label className="popupTitle" htmlFor="logo">
                  Företagslogotyp
                </label>
              </article>
              <div className="file-input-container">
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  onChange={handleLogoChange}
                  disabled={saving}
                  accept="image/*"
                />
                {logoPreview && (
                  <div className="image-preview">
                    <img
                      src={logoPreview}
                      alt="Företagslogotyp förhandsvisning"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="inputSingle">
              <article className="inputHeader">
                <label className="popupTitle" htmlFor="displayImage">
                  Omslagsbild
                </label>
              </article>
              <div className="file-input-container">
                <input
                  id="displayImage"
                  name="displayImage"
                  type="file"
                  onChange={handleDisplayImageChange}
                  disabled={saving}
                  accept="image/*"
                />
                {displayImagePreview && (
                  <div className="image-preview">
                    <img
                      src={displayImagePreview}
                      alt="Omslagsbild förhandsvisning"
                    />
                  </div>
                )}
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="button-group">
              <button type="submit" disabled={saving} className="primary-button">
                {saving ? "Sparar..." : "Tillämpa ändringar"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="secondary-button"
              >
                Avbryt redigering
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}