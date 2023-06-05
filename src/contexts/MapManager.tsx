import { createContext, useContext, useEffect, useState } from "react";

import { FileContext } from "@/contexts/FileSystem";

import Color3 from "@/utils/color3";
import HitObject, { TimingPoint } from "@/utils/hitobject";
import { isEmpty, mkdirs } from "@/utils/filesystem";

export const MapContext = createContext({} as any);

export const MapConfig = ({ children }) => {
    const fs = useContext(FileContext);
    const [dir, setDir] = useState(null as string);

    // General
    const [audio, setAudio] = useState(null as string); // audioFileName
    const [audioLeadIn, setAudioLeadIn] = useState(0);
    const [previewTime, setPreviewTime] = useState(0);
    const [isCountdown, useCountdown] = useState(false); // countdown
    const [sampleSet, setSampleSet] = useState("Normal");
    const [stackLeniency, setStackLeniency] = useState(0.7);
    const [mode, setMode] = useState(0);
    const [isLetterboxInBreaks, useLetterboxInBreaks] = useState(false); // letterboxInBreaks
    const [isWidescreenStoryboard, useWidescreenStoryboard] = useState(true); // widescreenStoryboard

    // Editor
    const [distanceSnap, setDistanceSnap] = useState(1); // distanceSpacing
    const [beatDivisor, setBeatDivisor] = useState(4);
    const [gridSize, setGridSize] = useState(4);
    const [timelineZoom, setTimelineZoom] = useState(false);

    // Metadata
    const [title, setTitle] = useState("");
    const [titleUnicode, setTitleUnicode] = useState("");
    const [artist, setArtist] = useState("");
    const [artistUnicode, setArtistUnicode] = useState("");
    const [creator, setCreator] = useState("");
    const [difficulty, setDifficulty] = useState(""); // version
    const [source, setSource] = useState("");
    const [tags, setTags] = useState("");
    const [beatmapID, setBeatmapID] = useState(0);
    const [beatmapSetID, setBeatmapSetID] = useState(-1);

    // Difficulty
    const [HP, setHP] = useState(5); // hpDrainRate
    const [CS, setCS] = useState(5); // circleSize
    const [OD, setOD] = useState(5); // overallDifficulty
    const [AR, setAR] = useState(5); // approachRate
    const [baseSV, setBaseSV] = useState(1); // sliderMultiplier
    const [tickRate, setTickRate] = useState(1); // sliderTickRate

    // Events
    const [bg, setBg] = useState(null as string);
    // video and storyboard never

    // TimingPoints
    const [timingPoints, setTimingPoints] = useState([] as TimingPoint[]);

    // Colours
    const [colours, setColours] = useState([Color3.fromRGB(255, 255, 255)] as Color3[]);

    // HitObjects
    const [hitObjects, setHitObjects] = useState([] as HitObject[]);

    const [bgData, setBgData] = useState(null as string);
    const [audioData, setAudioData] = useState(null as string);

    useEffect(() => {
        if (fs.readFile) {
            fs.exists(dir, (exists) => {
                if (exists) {
                    fs.readFile(bg, (err, data) => { // silent error
                        if (!err) {
                            setBgData(data.toString());
                        }
                    });
                    fs.readFile(audio, (err, data) => {
                        if (!err) {
                            setAudioData(data.toString());
                        }
                    });
                }
                else {
                    mkdirs("/osu!/Songs", () => {
                        var index = 1;
                        const createNextFree = () => {
                            const path = "/osu!/Songs/beatmap" + index.toString();
                            fs.exists(path, (exists) => {
                                if (exists) {
                                    isEmpty(path, (e, isEmpty) => {
                                        if (e) { throw e; }
                                        if (!isEmpty) {
                                            index++;
                                            createNextFree();
                                        }
                                        else {
                                            setDir(path);
                                        }
                                    });
                                }
                                else {
                                    fs.mkdir(path, 0o777, (e) => {
                                        if (e) { throw e; }
                                        setDir(path);
                                    });
                                }
                            });
                        }
                        createNextFree();
                    });
                }
            })
        }
    }, [fs, dir, bg, audio]);

    // im like 99% sure theres a faster way to do this but i havent found it
    return (<MapContext.Provider value={{
        fs: fs,
        dir: dir, setDir: setDir,
        audio: audio, setAudio: setAudio,
        audioLeadIn: audioLeadIn, setAudioLeadIn: setAudioLeadIn,
        previewTime: previewTime, setPreviewTime: setPreviewTime,
        isCountdown: isCountdown, useCountdown: useCountdown,
        sampleSet: sampleSet, setSampleSet: setSampleSet,
        stackLeniency: stackLeniency, setStackLeniency: setStackLeniency,
        mode: mode, setMode: setMode,
        isLetterboxInBreaks: isLetterboxInBreaks, useLetterboxInBreaks: useLetterboxInBreaks,
        isWidescreenStoryboard: isWidescreenStoryboard, useWidescreenStoryboard: useWidescreenStoryboard,
        distanceSnap: distanceSnap, setDistanceSnap: setDistanceSnap,
        beatDivisor: beatDivisor, setBeatDivisor: setBeatDivisor,
        gridSize: gridSize, setGridSize: setGridSize,
        timelineZoom: timelineZoom, setTimelineZoom: setTimelineZoom,
        title: title, setTitle: setTitle,
        titleUnicode: titleUnicode, setTitleUnicode: setTitleUnicode,
        artist: artist, setArtist: setArtist,
        artistUnicode: artistUnicode, setArtistUnicode: setArtistUnicode,
        creator: creator, setCreator: setCreator,
        difficulty: difficulty, setDifficulty: setDifficulty,
        source: source, setSource: setSource,
        tags: tags, setTags: setTags,
        beatmapID: beatmapID, setBeatmapID: setBeatmapID,
        beatmapSetID: beatmapSetID, setBeatmapSetID: setBeatmapSetID,
        HP: HP, setHP: setHP, CS: CS, setCS: setCS, OD: OD, setOD: setOD, AR: AR, setAR: setAR,
        baseSV: baseSV, setBaseSV: setBaseSV, tickRate: tickRate, setTickRate: setTickRate,
        bg: bg, setBg: setBg,
        timingPoints: timingPoints, setTimingPoints: setTimingPoints,
        colours: colours, setColours: setColours,
        hitObjects: hitObjects, setHitObjects: setHitObjects,
        bgData: bgData, audioData: audioData,
    }}>
        {children}
    </MapContext.Provider>);
}