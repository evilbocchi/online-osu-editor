import React, { useContext, useEffect, useState } from "react";
import { MapAudioContext } from "#/contexts/AudioManager";

const Toggle = ({ label, id, defaultValue, onClick }) => {
    const audioManager = useContext(MapAudioContext);
    const [value, setValue] = useState(defaultValue);
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return (<div className="miscoption" id={id}>
        <h4>{label}</h4>
        <label className="toggle">
            <input type="checkbox" checked={value} onChange={() => { }} onClick={(e) => {
                const checked = ((e.target as HTMLInputElement).checked);
                audioManager.playSound(checked ? "CHECK_ON" : "CHECK_OFF");
                setValue(checked); if (onClick) { onClick(e); }
            }} />
            <span className="fill"></span>
        </label>
    </div>);
}

export default Toggle;