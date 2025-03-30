"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase/client';
import { useSupabaseAuth } from '../../../hook/useSupabaseAuth';
import '../form/popup.css';

export default function EditProfileOverlay({ isOpen, onClose, companyId }) {
  const { user } = useSupabaseAuth();
  const [companyData, setCompanyData] = useState({
    name: '',
    description: '',
    location: '',
    website: '',
    email: ''
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [displayImagePreview, setDisplayImagePreview] = useState(null);
  const [newLogo, setNewLogo] = useState(null);
  const [newDisplayImage, setNewDisplayImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch company data when overlay opens
  useEffect(() => {
    if (isOpen && (companyId || user)) {
      fetchCompanyData();
    }
  }, [isOpen, companyId, user]);

  useEffect(() => {
    console.log("Company data updated:", companyData);
  }, [companyData]);
  

  const fetchCompanyData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Query based on companyId if provided, otherwise use the logged-in user
      const query = supabase
        .from('companies')
        .select('*');
        
      if (companyId) {
        query.eq('id', companyId);
      } else if (user) {
        query.eq('user_id', user.id);
      } else {
        throw new Error('Ingen företagsprofil hittades');
      }
      
      const { data, error: fetchError } = await query.single();
      
      if (fetchError) throw fetchError;
      if (!data) throw new Error('Ingen företagsprofil hittades');
      
      // Set the company data
      setCompanyData({
        name: data.name || '',
        description: data.description || '',
        location: data.location || '',
        website: data.website || '',
        email: data.email || ''
      });
      
      // Set logo preview if exists
      if (data.logo_url && data.logo_url !== 'pending') {
        setLogoPreview(data.logo_url);
      }
      
      // Set display image preview if exists
      if (data.display_image_url && data.display_image_url !== 'pending') {
        setDisplayImagePreview(data.display_image_url);
      }
    } catch (err) {
      console.error('Error fetching company data:', err);
      setError('Kunde inte hämta företagsinformation: ' + (err.message || 'Okänt fel'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      let logoUrl = null;
      let displayImageUrl = null;
      
      // Upload new logo if changed
      if (newLogo) {
        const fileExt = newLogo.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `company-logos/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('companies')
          .upload(filePath, newLogo);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('companies')
          .getPublicUrl(filePath);
          
        logoUrl = data.publicUrl;
      }
      
      // Upload new display image if changed
      if (newDisplayImage) {
        const fileExt = newDisplayImage.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `company-displays/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('companies')
          .upload(filePath, newDisplayImage);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('companies')
          .getPublicUrl(filePath);
          
        displayImageUrl = data.publicUrl;
      }
      
      // Prepare update data
      const updateData = {
        name: companyData.name,
        description: companyData.description,
        location: companyData.location,
        website: companyData.website,
        email: companyData.email
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
      const query = supabase
        .from('companies')
        .update(updateData);
        
      if (companyId) {
        query.eq('id', companyId);
      } else if (user) {
        query.eq('user_id', user.id);
      } else {
        throw new Error('Ingen företagsprofil hittades för uppdatering');
      }
      
      const { error: updateError } = await query;
      
      if (updateError) throw updateError;
      
      setSuccess('Företagsprofilen har uppdaterats!');
      
      // Reset file inputs
      setNewLogo(null);
      setNewDisplayImage(null);
      
      // Close overlay after a brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error updating company profile:', err);
      setError('Kunde inte uppdatera företagsprofilen: ' + (err.message || 'Okänt fel'));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="popup-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content edit-profile-overlay" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Stäng">
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
        
        <h2>Redigera Företagsprofil</h2>
        
        {loading ? (
          <div className="loading">Laddar företagsinformation...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="company_name">Företagsnamn</label>
            <input 
              id="company_name" 
              name="name" 
              type="text" 
              required 
              value={companyData.name}
              onChange={handleInputChange}
              disabled={saving}
              placeholder="Ditt företagsnamn"
            />

            <label htmlFor="location">Kontorsort</label>
            <input 
              id="location" 
              name="location" 
              type="text" 
              required 
              value={companyData.location}
              onChange={handleInputChange}
              disabled={saving}
              placeholder="Var finns ert kontor?"
            />

            <label htmlFor="description">Företagsbeskrivning</label>
            <textarea 
              id="description" 
              name="description" 
              required 
              value={companyData.description}
              onChange={handleInputChange}
              disabled={saving}
              placeholder="Berätta om ert företag, er verksamhet och vad ni erbjuder"
              rows={5}
            />

            <label htmlFor="website">Hemsida</label>
            <input 
              id="website" 
              name="website" 
              type="url" 
              required 
              value={companyData.website}
              onChange={handleInputChange}
              disabled={saving}
              placeholder="https://www.dittforetag.se"
            />

            <label htmlFor="contact_email">Kontaktmail</label>
            <input 
              id="contact_email" 
              name="email" 
              type="email" 
              required 
              value={companyData.email}
              onChange={handleInputChange}
              disabled={saving}
              placeholder="kontakt@dittforetag.se"
            />

            <label htmlFor="logo">Företagslogotyp</label>
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
                  <img src={logoPreview} alt="Företagslogotyp förhandsvisning" />
                </div>
              )}
            </div>

            <label htmlFor="displayImage">Omslagsbild</label>
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
                  <img src={displayImagePreview} alt="Omslagsbild förhandsvisning" />
                </div>
              )}
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            
            <div className="button-group">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={saving}
                className="secondary-button"
              >
                Avbryt
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className="primary-button"
              >
                {saving ? "Sparar..." : "Spara Ändringar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}