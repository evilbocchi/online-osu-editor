import { useContext, useEffect, useState } from "react";
import { FSModule } from "browserfs/dist/node/core/FS";

import { RESOURCES } from "@/utils/constants";
import { inputFiles } from "@/utils/input";
import { path } from "@/utils/filesystem";
import { getDataUrl } from "@/utils/file";

import { MapAudioContext } from "@/contexts/AudioManager";
import { MapContext } from "@/contexts/MapManager";
import { getArtist, getRelativePath, getTitle } from "@/utils/mapmanager";

const SetupNavbarTabSelect = ({ id, label }) => {
    const audioManager = useContext(MapAudioContext);

    return (
        // @ts-ignore
        <div className="button" id={id} onClick={(e) => {
            document.querySelector(".content #" + (id)).scrollIntoView();
            audioManager.playAudioElement("TABSELECT_SELECT");
        }}
            onMouseEnter={() => { audioManager.playAudioElement("DEFAULT_HOVER"); }}>
            <button className="buttonlabel">{label}</button>
            <div className="outlineblob"></div>
        </div>
    );
}

const TextBoxOption = ({ label, id, defaultValue, placeholder, onChange, onClick, children }:
    {
        label: string, id: string, defaultValue: string, placeholder?: string,
        onChange?: React.ChangeEventHandler<HTMLInputElement>, onClick?: React.MouseEventHandler<HTMLInputElement>, children?
    }) => {
    const [value, setValue] = useState(defaultValue);
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return (<div className="option" id={id}>
        <h4>{label}</h4>
        <input value={value} placeholder={placeholder ? placeholder : ""} onChange={(e) => {
            setValue(e.target.value);
            if (onChange) { onChange(e); }
        }} onClick={onClick} />
        {children}
    </div>);
}

const SliderOption = ({ label, id, min, max, defaultValue, step, onInput, children }:
    {
        label: string, id: string, min: number, max: number, defaultValue?: number, step?: number,
        onInput?: React.FormEventHandler<HTMLInputElement>, children?
    }) => {
    const [value, setValue] = useState(defaultValue);
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return (<div className="option" id={id}>
        <h4>{label}</h4>
        <input type="range" min={min} max={max} value={value} step={step} onInput={(e) => {
            setValue(parseFloat((e.target as HTMLInputElement).value));
            if (onInput) { onInput(e); }
        }} />
        {children}
    </div>);
}

const SetupSection = ({ active, showMessage }) => {
    const mapConfig = useContext(MapContext) as any;
    const audioManager = useContext(MapAudioContext) as any;
    const relBgPath = (mapConfig.bg && mapConfig.dir) ? getRelativePath(mapConfig.dir, mapConfig.bg) : null;
    const relTrackPath = (mapConfig.track && mapConfig.dir) ? getRelativePath(mapConfig.dir, mapConfig.track) : null;
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
    return (<div className="section" id="setup" active={active}>
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
            <div className="title">
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
                <h4>Resources</h4>
                <TextBoxOption label="Map Folder" id="mapfolder" defaultValue={mapConfig.dir ? mapConfig.dir : ""}>
                    <button onMouseEnter={() => audioManager.playAudioElement("DEFAULT_HOVER")} onClick={() => {
                        mapConfig.setDir((document.querySelector("#mapfolder input") as HTMLInputElement).value);
                        audioManager.playAudioElement("DEFAULT_SELECT");
                    }}>Apply</button>
                </TextBoxOption>
                <TextBoxOption label="Background" id="background" defaultValue={relBgPath ? relBgPath : ""} placeholder="Background file path">
                    <button onMouseEnter={() => audioManager.playAudioElement("DEFAULT_HOVER")} onClick={() => {
                        inputFile(inputBg);
                        audioManager.playAudioElement("DEFAULT_SELECT");
                    }}>Upload</button>
                </TextBoxOption>
                <TextBoxOption label="Audio Track" id="track" defaultValue={relTrackPath ? relTrackPath : ""} placeholder="Track file path">
                    <button onMouseEnter={() => audioManager.playAudioElement("DEFAULT_HOVER")} onClick={() => {
                        inputFile(inputTrack);
                    }}>Upload</button>
                </TextBoxOption>
            </div>
            <div id="metadata">
                <h4>Metadata</h4>
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
                <SliderOption label="Circle Size" id="cs" min={0} max={100} defaultValue={50} step={1} onInput={(e) => {
                    console.log((e.target as HTMLInputElement).value);
                }}></SliderOption>
            </div>
            <div className="emptyspace" />
        </div>
    </div>);
}

export default SetupSection;