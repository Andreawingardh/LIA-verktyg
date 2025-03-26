import { supabase } from '@/utils/supabase/client';
import { useState } from 'react';


export default async function CreateListingForm() {
    
    const [positionName, setPositionName] = useState([]);
    const [spots, setSpots] = useState([]);
    const [tools, setTools] = useState([]);
    const [skills, setSkills] = useState([]);

    const { data: toolsData, error: toolsError } = await supabase.from("tags_tools").select()
    if (toolsError) console.error(toolsError)
    else console.log(toolsData)
    const { data: skillsData, error: skillsError } = await supabase.from("tags_skills").select()
    if (skillsError) console.error(skillsError)
    else console.log(skillsData)


    async function InsertIntoDatabase() {
        const { error } = await supabase  .from('positions')  .insert({ id: 1, name: 'Mordor' })
    }

    return (
        <form>
            <h2>Lägg in LIA-position</h2>
            <button>Digital Designer</button>
            <button>Webbutvecklare</button>
            <label htmlFor="spots">Antal platser</label>
            <select name="spots">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
            <label htmlFor="tools[]">Verktyg</label>
            <ul>
                {toolsData.map((tool) => (
                    <li key={tool.id}>
                        {tool.tools_name}
                    </li>
                ))}
            </ul>
            <label htmlFor="tools[]">Verktyg</label>
            <ul>
                {skillsData.map((tool) => (
                    <li key={tool.id}>
                        {tool.skills_name}
                    </li>
                ))}
            </ul>
            
        </form>

    );
}