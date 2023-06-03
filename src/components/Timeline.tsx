import React from "react";
import { getBPM, getTrack, AppState } from "@/Editor";

interface SpeedOptionProps { state: AppState, setStateKey, speed: number }

class SpeedOption extends React.Component<SpeedOptionProps, {}> {

    constructor(props: SpeedOptionProps) {
        super(props);
    }

    render() {
        return (
            <div className="button" id={this.props.speed.toString()}
                //@ts-ignore
                active={(this.props.state.currentPlaybackSpeed == this.props.speed).toString()}
                onClick={(e) => this.props.setStateKey("currentPlaybackSpeed", this.props.speed)}>
                <button className="buttonlabel">{this.props.speed * 100}%</button>
            </div>
        );
    }
}

interface TimelineProps { state: AppState, setStateKey: any }

export default class Timeline extends React.Component<TimelineProps, {}> {
    constructor(props: TimelineProps) {
        super(props);
    }

    update: NodeJS.Timer;

    componentDidMount() {
        var track = getTrack();
        var ctlabel = document.querySelector(".ctlabel");
        var cblabel = document.querySelector(".cblabel");
        var indicator: HTMLDivElement | null = document.querySelector(".indicator");

        this.update = setInterval(() => {
            var currentTime = track ? Math.floor(track.currentTime * 1000) : 0;
            var length = track ? (track.duration ? track.duration * 1000 : 1) : 1;
            if (ctlabel && cblabel && indicator) {
                ctlabel.innerHTML = this.formatTime(currentTime);
                cblabel.innerHTML = getBPM(this.props.state.mapSettings.timingPoints, currentTime).toString() + " BPM";
                indicator.style.margin = "0 0 0 " + ((currentTime / length * 100).toString()) + "%";
            }

        }, 1);
    }

    componentWillUnmount() {
        clearInterval(this.update);
    }

    formatTime(s: number) {
        function pad(n: number, z?: number): string {
            z = z || 2;
            return ('00' + n).slice(-z);
        }

        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        return (s > 99 ? s : pad(s)) + ':' + pad(secs) + '.' + pad(ms, 3);
    }

    timelineMove(e: MouseEvent) {
        var track = getTrack();
        if (track) {
            var line = document.querySelector(".main .line");
            if (line) {
                var rect = line.getBoundingClientRect();
                var p = ((e.clientX - rect.x) / rect.width);
                p = (p < 0) ? (0) : ((p > 1) ? (1) : (p));
                track.currentTime = track.duration * p;
            }
        }
    }

    render() {
        return (<div className="timeline">
            <div className="labels">
                <h3 className="ctlabel" title="Some browsers may round/adjust the currentTime of audio elements, and this value may be imprecise and inaccurate."></h3>
                <h4 className="cblabel"></h4>
            </div>
            <div className="main" onMouseMove={(e) => {
                if (e.buttons > 0) {
                    this.timelineMove(e as any);
                }
            }} onClick={this.timelineMove as any}>
                <div className="line">
                    <div className="indicator" />
                    <div className="left ball" />
                    <div className="right ball" />
                </div>
            </div>
            <div className="playbackoptions">
                <div className="labels">
                    <p>Playback speed</p>
                    <div className="speedoptions">
                        <SpeedOption speed={0.25} state={this.props.state} setStateKey={this.props.setStateKey} />
                        <SpeedOption speed={0.5} state={this.props.state} setStateKey={this.props.setStateKey} />
                        <SpeedOption speed={0.75} state={this.props.state} setStateKey={this.props.setStateKey} />
                        <SpeedOption speed={1} state={this.props.state} setStateKey={this.props.setStateKey} />
                    </div>
                </div>
                <div className="button" id="playbutton"
                    onClick={(e) => {
                        this.props.setStateKey("isPlaying", !this.props.state.isPlaying);
                    }}>
                    <button className="buttonlabel">{this.props.state.isPlaying == true ? "Stop" : "Play"}</button>
                </div>
            </div>
        </div>);
    }
}