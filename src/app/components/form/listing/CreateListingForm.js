'use client'
import { supabase } from '@/utils/supabase/client';
import { useState } from 'react';
import { useEffect } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';


export default function CreateListingForm({user}) {

    const router = useRouter();

    const [formData, setFormData] = useState({
        title: 'webbutvecklare',
        spots: 5,
        user_id: user.id
    })

    console.log(formData)
    const [selectedTools, setTools] = useState([]);
    const [selectedSkills, setSkills] = useState([]);

    const [lastPositionId, setLastPositionId] = useState([])

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        // Create an async function inside useEffect
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: toolsData, error: toolsError } = await supabase
                    .from("tags_tools")
                    .select('*');
                const { data: skillsData, error: skillsError } = await supabase
                    .from("tags_skills")
                    .select('*');

                if (toolsError || skillsError) throw error;
  
                setTools(toolsData);
                setSkills(skillsData);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
  
        // Call the async function
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {  
            // Insert into positions table
            const { data: insertData, error: insertError } = await supabase
                .from('positions')
                .insert(formData);
    
            if (error) throw error;
            
            
            console.log('Data inserted successfully', formData); 
    
            // Reset form or show success message
        } catch (error) {
                console.error('Error inserting data:', error);
                console.error('Full response:', { data, error });
            }
        }
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    function setSkillsChange(e) {
        const { value, checked } = e.target;
        
        if (checked) {
            // Add the tool to the selected tools
            setSkills(prevSkills => [...prevSkills, value]);
        } else {
            // Remove the tool from the selected tools
            setSkills(prevSkills => prevSkills.filter(skill => skill !== value));
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Welcome, {user.email} with id {user.id}</h2>
            <h2>Lägg in LIA-position</h2>
            <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
            >
                <option value="digital designer">Digital designer</option>
                <option name="webbutvecklare">Webbutvecklare</option>
                
            </select>
            <label htmlFor="spots">Antal platser</label>
            <select
                name="spots"
                value={formData.spots}
                onChange={handleChange}
                required
            >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <label htmlFor="tools[]">Verktyg</label>
            <ul>
                {selectedTools.map((tool) => (
                    <li key={tool.id}>
                        {tool.tools_name}
                    </li>
                ))}
            </ul>
            <label htmlFor="tools[]">Verktyg</label>
            <ul>
                {selectedSkills.map((skill) => (
                    <li key={skill.id}>
                        <input
                            type="checkbox"
                            id={`skill-${skill.id}`}
                            name="skills"
                            value={skill.skills_name}
                            onChange={setSkillsChange}
                            checked={selectedSkills.includes(skill.skills_name)}
                        />
                        <label htmlFor={`skill-${skill.id}`}>
                            {skill.skills_name}
                        </label>
                    </li>
                ))}
            </ul>
            <button type="submit">Submit</button>
        </form>

    );
}
    


