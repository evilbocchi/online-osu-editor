import { createContext, useContext, useEffect, useState } from "react";

import { MapContext } from "@/contexts/MapManager";
import { RESOURCES } from "@/utils/constants";

export const MapAudioContext = createContext({} as any);

const AudioManager = ({ children }) => {
    const mapContext = useContext(MapContext);
    const [trackSpeed, setTrackSpeed] = useState(1);
    const [isPlaying, setPlaying] = useState(false);

    const getAudioElement = (id: string): HTMLAudioElement => {
        return document.getElementById(id) as HTMLAudioElement;
    }

    useEffect(() => {
        const track = getAudioElement("track");
        track.preservesPitch = false;
        if (track.paused && isPlaying) {
            track.play();
        }
        if (!track.paused && !isPlaying) {
            track.pause();
        }
        track.playbackRate = trackSpeed;

    }, [mapContext, isPlaying, trackSpeed]);

    const keys = Object.keys(RESOURCES.SAMPLES.UI);
    const urls = Object.values(RESOURCES.SAMPLES.UI);

    return (<>
        <audio id="track" src={(mapContext.audioData == "" || !mapContext.audioData) ? "/default-audio.mp3" : mapContext.audioData} 
            onEnded={() => setPlaying(false)} />
        {urls.map((url, i) => (<audio key={url} id={keys[i]} src={url}/>))}
        <MapAudioContext.Provider value={{
            timingPoints: mapContext.timingPoints,
            getAudioElement: getAudioElement,
            playAudioElement: (id: string) => {
                var element = getAudioElement(id);
                if (id != "track") {
                    element = element.cloneNode(false) as HTMLAudioElement;
                    element.onended = () => { element.remove(); }
                }
                element.play();
            },
            trackSpeed: trackSpeed, setTrackSpeed: setTrackSpeed,
            isPlaying: isPlaying, setPlaying: setPlaying,
        }}>

            {children}
        </MapAudioContext.Provider>
    </>);
}

export default AudioManager;