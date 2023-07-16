import { useContext, useEffect, useRef, useState } from "react";
import { FSModule } from "browserfs/dist/node/core/FS";

import { RESOURCES } from "#/utils/constants";
import { inputFiles } from "#/utils/input";
import { path } from "#/utils/filesystem";
import { getDataUrl } from "#/utils/file";

import { MapAudioContext } from "#/contexts/AudioManager";
import { MapContext } from "#/contexts/MapManager";
import { getArtist, getRelativePath, getTitle } from "#/utils/mapmanager";
import { getLuminance } from "#/utils/color";

const SetupNavbarTabSelect = ({ id, label }) => {
    const audioManager = useContext(MapAudioContext);
    return (
        // @ts-ignore
        <div className="button" id={id} onClick={(e) => {
            document.querySelector("#" + (id) + " .heading").scrollIntoView({ block: "center" });
            audioManager.playSound("TABSELECT_SELECT");
        }}
            onMouseEnter={() => { audioManager.playSound("DEFAULT_HOVER"); }}>
            <p className="buttonlabel">{label}</p>
            <div className="outlineblob"></div>
        </div>
    );
}

export const TextBoxOption = ({ label, id, defaultValue, placeholder, onChange, onClick, children }:
    {
        label: string, id: string, defaultValue: string, placeholder?: string,
        onChange?: React.ChangeEventHandler<HTMLInputElement>, onClick?: React.MouseEventHandler<HTMLInputElement>, children?
    }) => {
    const audioManager = useContext(MapAudioContext);
    const [value, setValue] = useState(defaultValue);
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return (<div className="option" id={id}>
        <div className="wrapper">
            <div className="main">
                <h4>{label}</h4>
                <input value={value} placeholder={placeholder ? placeholder : ""} onChange={(e) => {
                    audioManager.playSound(e.target.value.length < value.length ? "KEY_DELETE" : "KEY_PRESS_1");
                    setValue(e.target.value);
                    if (onChange) { onChange(e); }
                }} onClick={onClick} />
            </div>
        </div>
        {children}
    </div>);
}

const SliderOption = ({ label, id, desc, min, max, defaultValue, step, onChange, children }:
    {
        label: string, id: string, desc?: string, min: number, max: number, defaultValue?: number, step?: number,
        onChange?, children?
    }) => {
    const audioManager = useContext(MapAudioContext);
    const [value, setValue] = useState(defaultValue / step);
    const tooltip = useRef(null);
    const bounding = useRef(null);
    useEffect(() => {
        setValue(defaultValue / step);
    }, [defaultValue]);
    return (<div className="option" id={id}>
        <div className="wrapper">
            <div className="main" ref={bounding}>
                <h4>{label}</h4>
                <div className="tooltip" ref={tooltip}><p>{(value * step).toFixed(-Math.log10(step))}</p></div>
                <input type="range" min={min / step} max={max / step} value={value} step={1} onInput={(e) => {
                    const newValue = parseInt((e.target as HTMLInputElement).value);
                    audioManager.playSound("NOTCH_TICK", 1, ((newValue / max * step) - 0.5) * 500);
                    setValue(newValue);
                    if (onChange) { onChange((newValue * step).toFixed(-Math.log10(step))); }
                }} onMouseMove={(e) => {
                    const rect = bounding.current.getBoundingClientRect();
                    tooltip.current.style.opacity = "1";
                    tooltip.current.style.top = (e.clientY - rect.y + 20).toString() + "px";
                    tooltip.current.style.left = (e.clientX - rect.x + 5).toString() + "px";
                }} onMouseLeave={() => { tooltip.current.style.opacity = "0"; }} />
            </div>
            <h5 className="desc">{desc}</h5>
        </div>
        {children}
    </div>);
}

const ColourSubOption = ({ label, index, defaultValue, onChange, onRemove, removable }) => {
    const audioManager = useContext(MapAudioContext);
    const [colour, setColour] = useState(defaultValue);

    useEffect(() => {
        (document.querySelector("#c" + index + " .hexlabel") as HTMLParagraphElement).style.color =
            getLuminance(colour) > 0.5 ? "#000000" : "#ffffff";
    }, [colour]);
    useEffect(() => {
        setColour(defaultValue);
    }, [defaultValue]);

    return (<div className="coloursuboption" id={"c" + index}>
        <input type="color" value={colour} onChange={(e) => {
            setColour(e.target.value);
            if (onChange) { onChange(e); }
        }} onMouseDown={() => { audioManager.playSound("DEFAULT_SELECT"); }} />
        <p className="hexlabel">{colour.toUpperCase()}</p>
        <p className="removebutton" id={removable ? "" : "hide"} onClick={() => {
            audioManager.playSound("DEFAULT_SELECT");
            onRemove();
        }}>-</p>
        <p>{label}</p>
    </div>);
}

const ColoursOption = ({ label, id, desc, defaultValue, onChange, indexLabel, children }:
    {
        label: string, id: string, desc?: string, defaultValue?: string[],
        onChange?, indexLabel?: (index: number) => string, children?
    }) => {
    const audioManager = useContext(MapAudioContext);
    const [colours, setColours] = useState(defaultValue);
    useEffect(() => {
        setColours(defaultValue);
    }, [defaultValue]);

    return (<div className="option" id={id}>
        <div className="wrapper">
            <div className="main">
                <h4>{label}</h4>
                <div className="gridcontainer">
                    {colours.map((colour, index) => <ColourSubOption label={indexLabel ? indexLabel(index) : ""}
                        defaultValue={colour} key={index.toString()} index={index} onChange={(e) => {
                            var newColours = colours.slice();
                            newColours[index] = e.target.value;
                            setColours(newColours);
                            onChange(newColours);
                        }} onRemove={() => {
                            var newColours = [];
                            for (var i = 0; i < colours.length; i++) {
                                if (i != index) { newColours.push(colours[i]); }
                            }
                            setColours(newColours);
                            onChange(newColours);
                        }} removable={colours.length > 1} />)}
                    <div className="coloursuboption" id="newcolour">
                        <div className="addbutton" onClick={() => {
                            var newColours = colours.slice();
                            newColours.push("#ffffff");
                            setColours(newColours);
                            onChange(newColours);
                            audioManager.playSound("DEFAULT_SELECT");
                        }} />
                        <p className="hexlabel">+</p>
                        <p>New</p>
                    </div>
                </div>
            </div>
            <h5 className="desc">{desc}</h5>
        </div>
        {children}
    </div>);
}

const ToggleOption = ({ label, id, desc, defaultValue, onClick, children }:
    {
        label: string, id: string, desc?: string, defaultValue?: boolean,
        onClick?, children?
    }) => {
    const audioManager = useContext(MapAudioContext);
    const [value, setValue] = useState(defaultValue);
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return (<div className="option" id={id}>
        <div className="wrapper">
            <div className="main">
                <h4>{label}</h4>
                <label className="switch">
                    <input type="checkbox" checked={value} onChange={() => { }} onClick={(e) => {
                        const checked = ((e.target as HTMLInputElement).checked);
                        audioManager.playSound(checked ? "CHECK_ON" : "CHECK_OFF");
                        setValue(checked); if (onClick) { onClick(e); }
                    }} />
                    <span className="slider"></span>
                </label>
            </div>
            <h5 className="desc">{desc}</h5>
        </div>
        {children}
    </div>);
}

const SetupSection = ({ active, showMessage }) => {
    const mapConfig = useContext(MapContext) as any;
    const audioManager = useContext(MapAudioContext) as any;
    const relBgPath = (mapConfig.bg && mapConfig.dir) ? getRelativePath(mapConfig.dir, mapConfig.bg) : null;
    const relTrackPath = (mapConfig.audio && mapConfig.dir) ? getRelativePath(mapConfig.dir, mapConfig.audio) : null;
    const romanisedArtist = getArtist(mapConfig);
    const romanisedTitle = getTitle(mapConfig);
    const inputFile = (cb: (dir: string, data?: string | ArrayBuffer) => void) => {
        const fs: FSModule = mapConfig.fs;
        if (fs.readFile) {
            inputFiles(false, (files) => {
                for (const file of files) {
                    getDataUrl(file, (err, data) => {
                        if (err) { throw err; }
                        const dir = path.join(mapConfig.dir, file.name);
                        fs.writeFile(dir, data, (err) => { // this will overwrite stuff but its fine for now
                            if (err) { throw err; }
                            cb(dir, data);
                        });
                    });
                }
            });
        }
    }
    const inputBg = (dir: string, data: string | ArrayBuffer) => {
        var image = new Image();
        image.onload = () => { mapConfig.setBg(dir); }
        image.onerror = () => { showMessage("Invalid image.", 1500); }
        image.src = data as string;
    }

    const inputTrack = (dir: string, data: string | ArrayBuffer) => {
        var audio = new Audio();
        audio.oncanplaythrough = () => { mapConfig.setAudio(dir); }
        audio.onerror = () => { showMessage("Invalid audio.", 1500); }
        audio.src = data as string;
    }
    // @ts-ignore
    return (<div className="section" id="setup" active={active.toString()}>
        <div className="sectionnavbar">
            <div className="title">
                <div className="emptyspace" />
                <div className="emptyspace" />
                <div className="hexaconwrapper">
                    <img src={RESOURCES.TEXTURES.ICONS.HEXACONS.SOCIAL} className="setuphexacon" />
                </div>
                <div className="emptyspace" />
                <p>beatmap setup</p>
            </div>
            <div className="title setupnavbar">
                <div className="emptyspace" />
                <div className="emptyspace" />
                <div className="emptyspace" />
                <SetupNavbarTabSelect id="resources" label="Resources" />
                <SetupNavbarTabSelect id="metadata" label="Metadata" />
                <SetupNavbarTabSelect id="difficulty" label="Difficulty" />
                <SetupNavbarTabSelect id="colours" label="Colours" />
                <SetupNavbarTabSelect id="design" label="Design" />
                <SetupNavbarTabSelect id="ruleset" label="Ruleset (osu!)" />
            </div>
            <div className="outline" />
            <div className="setbg" onClick={() => { inputFile(inputBg); }} onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) {
                    for (const file of e.dataTransfer.files) {
                        getDataUrl(file, (err, data) => {
                            if (err) { throw err; }
                            const dir = path.join(mapConfig.dir, file.name);
                            mapConfig.fs.writeFile(dir, data, (err) => {
                                if (err) { throw err; }
                                inputBg(dir, data);
                            });
                        });
                    }
                }
            }} onDragOver={(e) => { e.preventDefault(); }}>
                <img className="bg" src={mapConfig.bgData ? mapConfig.bgData : ""} />
                <p>Drag image here to set beatmap background!</p>
            </div>
        </div>
        <div className="content">
            <div id="resources">
                <h4 className="heading">Resources</h4>
                <TextBoxOption label="Mapset Folder" id="mapsetfolder" defaultValue={mapConfig.dir ? mapConfig.dir : ""}>
                    <p className="button" id="hotfix" onMouseEnter={() => audioManager.playSound("DEFAULT_HOVER")} onClick={() => {
                        mapConfig.setDir((document.querySelector("#mapsetfolder input") as HTMLInputElement).value);
                        audioManager.playSound("DEFAULT_SELECT");
                    }}>Apply</p>
                </TextBoxOption>
                <TextBoxOption label="Background" id="background" defaultValue={relBgPath ? relBgPath : ""} placeholder="Background file path">
                    <p className="button" id="hotfix" onMouseEnter={() => audioManager.playSound("DEFAULT_HOVER")} onClick={() => {
                        mapConfig.setBg(path.join(mapConfig.dir, (document.querySelector("#background input") as HTMLInputElement).value));
                        audioManager.playSound("DEFAULT_SELECT");
                    }}>Apply</p>
                    <p className="button" onMouseEnter={() => audioManager.playSound("DEFAULT_HOVER")} onClick={() => {
                        inputFile(inputBg);
                        audioManager.playSound("DEFAULT_SELECT");
                    }}>Upload</p>
                </TextBoxOption>
                <TextBoxOption label="Audio Track" id="track" defaultValue={relTrackPath ? relTrackPath : ""} placeholder="Track file path">
                    <p className="button" id="hotfix" onMouseEnter={() => audioManager.playSound("DEFAULT_HOVER")} onClick={() => {
                        mapConfig.setAudio(path.join(mapConfig.dir, (document.querySelector("#track input") as HTMLInputElement).value));
                        audioManager.playSound("DEFAULT_SELECT");
                    }}>Apply</p>
                    <p className="button" onMouseEnter={() => audioManager.playSound("DEFAULT_HOVER")} onClick={() => {
                        inputFile(inputTrack);
                        audioManager.playSound("DEFAULT_SELECT");
                    }}>Upload</p>
                </TextBoxOption>
            </div>
            <div id="metadata">
                <h4 className="heading">Metadata</h4>
                <TextBoxOption label="Artist" id="artistUnicode" defaultValue={mapConfig.artistUnicode} onChange={(e) => {
                    mapConfig.setArtistUnicode(e.target.value);
                }} />
                <TextBoxOption label="Romanised Artist" id="artist" defaultValue={romanisedArtist} onChange={(e) => {
                    mapConfig.setArtist(e.target.value);
                }} />
                <br />
                <TextBoxOption label="Title" id="titleUnicode" defaultValue={mapConfig.titleUnicode} onChange={(e) => {
                    mapConfig.setTitleUnicode(e.target.value);
                }} />
                <TextBoxOption label="Romanised Title" id="title" defaultValue={romanisedTitle} onChange={(e) => {
                    mapConfig.setTitle(e.target.value);
                }} />
                <br />
                <TextBoxOption label="Creator" id="creator" defaultValue={mapConfig.creator} onChange={(e) => {
                    mapConfig.setCreator(e.target.value);
                }} />
                <TextBoxOption label="Difficulty Name" id="difficulty" defaultValue={mapConfig.difficulty} onChange={(e) => {
                    mapConfig.setDifficulty(e.target.value);
                }} />
                <TextBoxOption label="Source" id="source" defaultValue={mapConfig.source} onChange={(e) => {
                    mapConfig.setSource(e.target.value);
                }} />
                <TextBoxOption label="Tags" id="tags" defaultValue={mapConfig.tags} onChange={(e) => {
                    mapConfig.setTags(e.target.value);
                }} />
            </div>
            <div id="difficulty">
                <h4 className="heading">Difficulty</h4>
                <SliderOption label="Circle Size" id="cs" min={0} max={10} defaultValue={mapConfig.CS} step={0.1} onChange={(value) => {
                    mapConfig.setCS(value);
                }} desc="The size of all hit objects" />
                <SliderOption label="HP Drain" id="hp" min={0} max={10} defaultValue={mapConfig.HP} step={0.1} onChange={(value) => {
                    mapConfig.setHP(value);
                }} desc="The rate of passive health drain throughout playable time" />
                <SliderOption label="Approach Rate" id="ar" min={0} max={10} defaultValue={mapConfig.AR} step={0.1} onChange={(value) => {
                    mapConfig.setAR(value);
                }} desc="The speed at which objects are presented to the player" />
                <SliderOption label="Accuracy" id="od" min={0} max={10} defaultValue={mapConfig.OD} step={0.1} onChange={(value) => {
                    mapConfig.setOD(value);
                }} desc="The harshness of hit windows and difficulty of special objects (ie. spinners)" />
                <SliderOption label="Base Velocity" id="baseSV" min={0.40} max={3.60} defaultValue={mapConfig.baseSV} step={0.01} onChange={(value) => {
                    mapConfig.setBaseSV(value);
                }} desc="The base velocity of the beatmap, affecting things like slider velocity and scroll speed in some rulesets." />
                <SliderOption label="Tick Rate" id="tickRate" min={1} max={4} defaultValue={mapConfig.tickRate} step={1} onChange={(value) => {
                    mapConfig.setTickRate(value);
                }} desc='Determines how many "ticks" are generated within long hit objects. 
                A tick rate of 1 will generate ticks on each beats, 2 would be twice per beat, etc.' />
            </div>
            <div id="colours">
                <h4 className="heading">Colours</h4>
                <ColoursOption label="Hit circle / Slider Combos" id="colours" defaultValue={mapConfig.colours} onChange={(colours) => {
                    mapConfig.setColours(colours);
                }} indexLabel={(index) => { return "Combo " + (index + 1).toString() }} />
            </div>
            <div id="design">
                <h4 className="heading">Design</h4>
                <ToggleOption label="Enable countdown" id="countdown" desc='If enabled, an "Are you ready? 3, 2, 1, GO! countdown will be
                inserted at the beginning of the beatmap, assuming there is enough time to do so.' defaultValue={mapConfig.isCountdown} onClick={(e) => {
                        mapConfig.useCountdown(e.target.checked);
                    }} />
                <div id={mapConfig.isCountdown ? "" : "hide"}>
                    <TextBoxOption label="Countdown offset" id="countdownOffset" placeholder="This does nothing currently" defaultValue="" />
                </div>
                <ToggleOption label="Widescreen support" id="widescreenStoryboard" desc='Allows storyboards to use the full screen space,
                rather than be confined to a 4:3 area.' defaultValue={mapConfig.isWidescreenStoryboard} onClick={(e) => {
                        mapConfig.useWidescreenStoryboard(e.target.checked);
                    }} />
                <ToggleOption label="Epilepsy warning" id="epilepsyWarning" desc='Recommended if the storyboard or video contains scenes
                with rapidly flashing colours.' defaultValue={mapConfig.isEpilepsyWarning} onClick={(e) => {
                        mapConfig.useEpilepsyWarning(e.target.checked);
                    }} />
                <ToggleOption label="Letterbox during breaks" id="letterboxInBreaks" desc='Adds horizontal letterboxing to give a
                cinematic look during breaks.' defaultValue={mapConfig.isLetterboxInBreaks} onClick={(e) => {
                        mapConfig.useLetterboxInBreaks(e.target.checked);
                    }} />
                <ToggleOption label="Samples match playback rate" id="samplesMatchPlaybackRate" desc='When enabled, all samples will speed
                up or slow down when rate-changing mods are enabled.' defaultValue={mapConfig.isSamplesMatchPlaybackRate} onClick={(e) => {
                        mapConfig.useSamplesMatchPlaybackRate(e.target.checked);
                    }} />
            </div>
            <div id="ruleset">
                <h4 className="heading">Ruleset (osu!)</h4>
                <SliderOption label="Stack Leniency" id="stackLeniency" min={0} max={1} defaultValue={mapConfig.stackLeniency} step={0.1} onChange={(value) => {
                    mapConfig.setStackLeniency(value);
                }} desc='In play mode, osu! automatically stacks notes which occur at the same location. Increasing this value means it is
                more likely to snap notes of further time-distance.' />
            </div>
            <div className="emptyspace" />
        </div>
    </div>);
}

export default SetupSection;