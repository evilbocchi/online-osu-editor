import React from 'react';
import { FSModule } from 'browserfs/dist/node/core/FS';

import { autoBind } from '@/App';
import Navbar from '@/components/Navbar';
import Playfield from '@/components/Playfield';
import Timeline from '@/components/Timeline';

import { FileContext } from '@/contexts/FileSystem';

import '@/assets/fonts/TorusPro/TorusPro.css';


export function getBPM(timingPoints: [TimingPoint], time: number): number {
  var bpm = 0;
  for (var i = 0; i < timingPoints.length; i++) {
    if (time >= timingPoints[i].time) {
      bpm = timingPoints[i].bpm;
    }
    else {
      return bpm;
    }
  }
  return bpm;
}

export function getTrack(): HTMLAudioElement {
  return (document.querySelector(".track") as any);
}

export function loadTrack(): HTMLAudioElement {
  var track = getTrack();
  track.load();
  track.preservesPitch = false;
  return track;
}

export interface TimingPoint {
  time: number,
  bpm: number,
  velocity: number,
  volume: number,
  soundbank: string,
  soundbankno: number
}

export interface MapSettings {
  background: string,
  audio: string,
  timingPoints: [TimingPoint],
}

export interface AppState {
  currentSection: string;
  currentPlaybackSpeed: number,
  isPlaying: boolean,
  mapSettings: MapSettings
}

export default class Editor extends React.Component {

  static contextType = FileContext;

  constructor(props) {
    super(props);
    autoBind(this);
  }

  state: AppState = {
    currentSection: "files",
    currentPlaybackSpeed: 1,
    isPlaying: false,
    mapSettings: {
      background: "",
      audio: "/silence.mp3",
      timingPoints: [{ time: 0, bpm: 0, velocity: 0, volume: 0, soundbank: "normal", soundbankno: 1 }],
    }
  }

  update: NodeJS.Timer | null = null;

  componentDidMount() {
    if (false) {
      const fs = this.context as FSModule;
      var enforceDefaultFiles = false;

      fs.readFile("/options.ini", (e) => {
        if (e) {
          enforceDefaultFiles = true;
        }
      });

      if (enforceDefaultFiles) {
        console.log("Enforcing default files");
      }
    }

    var track = loadTrack();
    this.update = setInterval(() => {
      if (track.paused && this.state.isPlaying) {
        track.play();
      }
      if (!track.paused && !this.state.isPlaying) {
        track.pause();
      }
      track.playbackRate = this.state.currentPlaybackSpeed as number;
    }, 5);

  }

  componentWillUnmount() {
    if (this.update) {
      clearInterval(this.update);
    }
  }

  setStateKey = (key, value) => {
    var newState = this.state;
    newState[key] = value;
    this.setState(newState);
    console.log(newState);
  }

  setMapSetting(key, value) {
    var newMapSettings = this.state.mapSettings;
    newMapSettings[key] = value;
    this.setStateKey("mapSettings", newMapSettings);
  }

  setCurrentSection(section: string) {
    this.setStateKey("currentSection", section);
  }

  save() {
    //localStorage.setItem("background", this.state.mapSettings.background);
    console.log("Saved map settings");
    //console.log(localStorage);
  }

  showMessage(message: string, duration: number) {
    var popup = document.querySelector(".popupwindow") as HTMLDivElement;
    var text = document.querySelector(".popupwindow .text") as HTMLParagraphElement;
    if (popup && text) {
      popup.style.opacity = "1";
      popup.style.zIndex = "69";
      text.innerHTML = message;
      setTimeout(() => {
        popup.style.opacity = "0";
        popup.style.zIndex = "-69";
      }, duration);
    }
  }

  render() {
    return (
      <>
        <div className="popupwindow">
          <h4>EDITOR</h4>
          <p className="text">Example</p>
        </div>
        <audio className="track" src={this.state.mapSettings.audio} />
        <Timeline state={this.state} setStateKey={this.setStateKey} />
        <Navbar currentSection={this.state.currentSection} setCurrentSection={this.setCurrentSection}
          save={this.save} showMessage={this.showMessage} />
        <Playfield state={this.state} setStateKey={this.setStateKey} mapSettings={this.state.mapSettings} setMapSetting={this.setMapSetting} showMessage={this.showMessage} />
      </>
    );
  }

}
