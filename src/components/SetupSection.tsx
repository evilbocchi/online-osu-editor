import React from "react";
import { MapSettings } from "@/Editor";
import { HEXACONS } from "@/utils/constants";

class SetupNavbarButton extends React.Component<{id: string, label: string}> {

    constructor(props) {
        super(props);
    }

    isActive() {
        return false;
    }

    scrollTo() {

    }

    render() {
        return (
            // @ts-ignore
            <div className="button" id={this.props.id} active={(this.isActive()).toString()} onClick={this.scrollTo}>
                <button className="buttonlabel">{this.props.label}</button>
                <div className="outlineblob"></div>
            </div>
        );
    }
}

export default class SetupSection extends React.Component<{active: string, mapSettings: MapSettings, setMapSetting: any, showMessage: any}> {
    constructor(props) {
        super(props);
    }

    inputBg() {
        (document.querySelector(".inputbg") as HTMLInputElement).click();
    }

    inputTrack() {
        (document.querySelector(".inputtrack") as HTMLInputElement).click();
    }

    inputtedBg(e) {
        var file = e.target.files[0];

        if (file.size > 2500000) {
            this.props.showMessage("Background image file size must not exceed 2.5MB.", 3000);
            return;
        }

        var fReader = new FileReader();
        fReader.readAsDataURL(file);

        fReader.onload = () => {
            var image = new Image();
            image.onload = () => {
                this.props.setMapSetting("background", fReader.result);
            };
            image.onerror = () => {
                this.props.showMessage("Invalid image.", 1500);
            };
            image.src = fReader.result as string;
        }
    }

    inputtedTrack(e) {
        var file = e.target.files[0];

        var fReader = new FileReader();
        fReader.readAsDataURL(file);

        fReader.onload = () => {
            var audio = new Audio();
            audio.oncanplaythrough = () => {
                this.props.setMapSetting("audio", fReader.result);
            };
            audio.onerror = () => {
                console.log("Invalid audio");
                this.props.showMessage("Invalid audio.", 1500);
            };
            audio.src = fReader.result as string;
        }
    }

    render() {
        // @ts-ignore
        return (<div className="section" id="setup" active={this.props.active}>
            <div className="sectionnavbar">
                <div className="title">
                    <div className="emptyspace" />
                    <div className="emptyspace" />
                    <div className="hexaconwrapper">
                        <img src={HEXACONS.SOCIAL} className="setuphexacon" />
                    </div>
                    <div className="emptyspace" />
                    <p>beatmap setup</p>
                </div>
                <div className="title">
                    <div className="emptyspace" />
                    <div className="emptyspace" />
                    <div className="emptyspace" />
                    <SetupNavbarButton id="resources" label="Resources" />
                    <SetupNavbarButton id="metadata" label="Metadata" />
                    <SetupNavbarButton id="difficulty" label="Difficulty" />
                    <SetupNavbarButton id="colours" label="Colours" />
                    <SetupNavbarButton id="design" label="Design" />
                    <SetupNavbarButton id="ruleset" label="Ruleset (osu!)" />
                </div>
                <div className="outline" />
                <div className="setbg" onClick={this.inputBg}>
                    <input type="file" accept="image/jpeg, image/png" className="inputbg" onChange={(e) => this.inputtedBg(e)} />
                    <img src={this.props.mapSettings.background} className="bg" />
                    <p>Drag image here to set beatmap background!</p>
                </div>
            </div>
            <div className="content">
                <div id="resources">
                    <h4>Resources</h4>
                    <div className="option">
                        <h4>Background</h4>
                        <input placeholder="Click to replace the background image" onClick={(e) => {
                            (e.target as HTMLElement).blur();
                            this.inputBg();
                        }} />
                    </div>
                    <div className="option">
                        <h4>Audio Track</h4>
                        <input placeholder="Click to replace the track" onClick={(e) => {
                            (e.target as HTMLElement).blur();
                            this.inputTrack();
                        }} />
                        <input type="file" accept="audio/mpeg, audio/ogg" className="inputtrack" onChange={(e) => this.inputtedTrack(e)} />
                    </div>
                </div>
                <div id="metadata">
                    <h4>Metadata</h4>
                    <div className="option">
                        <h4>Artist</h4>
                        <input />
                    </div>
                    <div className="option">
                        <h4>Romanised Artist</h4>
                        <input />
                    </div>
                </div>
            </div>
        </div>);
    }
}