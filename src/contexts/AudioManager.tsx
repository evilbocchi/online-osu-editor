import { createContext, useContext, useEffect, useState } from "react";

import { MapContext } from "#/contexts/MapManager";
import { RESOURCES } from "#/utils/constants";
import { Sound } from "#/utils/quickaudio";

export const MapAudioContext = createContext({} as any);
const sounds = {}; // this is a constant so i assume it doesnt have to be a state

const AudioManager = ({ children }) => {
    const mapContext = useContext(MapContext);
    const [trackSpeed, setTrackSpeed] = useState(1);
    const [trackDuration, setTrackDuration] = useState(0);
    const [isPlaying, setPlaying] = useState(false);

    useEffect(() => {
        for (const samples of Object.values(RESOURCES.SAMPLES)) {
            for (const [key, url] of Object.entries(samples)) {
                fetch(url).then(res => res.arrayBuffer()).then((arrayBuffer) => {
                    Sound.decodeAudioData(arrayBuffer, (sound) => {
                        sounds[key] = sound;
                    });
                });
            }
        }
    }, []);

    const getSound = (id: string): Sound => {
        return sounds[id];
    }

    const getTrack = (): HTMLAudioElement => {
        return document.getElementById("track") as HTMLAudioElement;
    }

    useEffect(() => {
        const track = getTrack();
        if (track.paused && isPlaying) {
            track.play();
        }
        if (!track.paused && !isPlaying) {
            track.pause();
        }
        track.playbackRate = trackSpeed;

    }, [isPlaying, trackSpeed]);

    return (<>
        <audio id="track" src={(mapContext.audioData == "" || !mapContext.audioData) ? "/default-audio.mp3" : mapContext.audioData}
            onEnded={() => setPlaying(false)} />
        <MapAudioContext.Provider value={{
            timingPoints: mapContext.timingPoints,
            getSound: getSound,
            getTrack: getTrack,
            playSound: (id: string, volume?: number, pitch?: number) => {
                var sound = getSound(id);
                sound.setVolume(volume ? volume : 1);
                sound.play(1, pitch);
            },
            trackSpeed: trackSpeed, setTrackSpeed: setTrackSpeed,
            isPlaying: isPlaying, setPlaying: setPlaying,
        }}>

            {children}
        </MapAudioContext.Provider>
    </>);
}

export default AudioManager;