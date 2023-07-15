import React, { useContext, useEffect, useState } from 'react';

import Navbar from '#root/components/Navbar';
import Playfield from '#root/components/Playfield';
import Timeline from '#root/components/Timeline';

import { FileContext } from '#root/contexts/FileSystem';
import { MapConfig } from '#root/contexts/MapManager';
import AudioManager, { MapAudioContext } from '#root/contexts/AudioManager';

import { parseIni } from '#root/utils/ini';
import { fetchResource, mkdirs, path } from '#root/utils/filesystem';
import { dataUrlToUtf8 } from '#root/utils/file';

const SelectAudio = ({ children }) => {
  const audioManager = useContext(MapAudioContext);
  return (<div onMouseDown={() => { audioManager.playSound("CURSOR_TAP") }}
    onMouseUp={() => { audioManager.playSound("DESELECT") }}>
    {children}
  </div>);

}

const Editor = () => {
  const fs = useContext(FileContext);
  const [currentSection, setCurrentSection] = useState("timing");
  const [isLoading, setLoading] = useState(true);

  const defaultFiles = () => {
    console.log("Enforcing default files");
    fetch("/defaultfilesindex.json").then((res) => res.json()).then((filesIndex) => {
      console.log(filesIndex)
      var filesWritten = 0;
      for (var i = 0; i < filesIndex.length; i++) {
        const file = filesIndex[i];
        fetchResource(file, (err, data) => {
          if (err) { throw err; }
          const dir = path.normalize(file.replace("defaultuserfiles", "").replaceAll("\\", "/"));
          mkdirs(dir, (e) => {
            if (e) {
              throw e;
            }
            fs.writeFile(dir, data, (e) => {
              if (e) { throw e; }
              filesWritten++;
              if (filesWritten == filesIndex.length) {
                setLoading(false);
                location.reload();
              }
            });
          })
        });
      }
    });
  }

  useEffect(() => {
    if (isLoading && fs.readFile) {
      fs.readFile("/options.ini", (e, data) => {
        if (e) {
          defaultFiles();
          return;
        }
        const p = parseIni(dataUrlToUtf8(data.toString()));
        if (p.General && (p.General as any).EnforceDefaultFiles) {
          defaultFiles();
          return;
        }
        setLoading(false);
      });
    }
  }, [fs]);

  const showMessage = (message: string, duration: number) => {
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

  return (
    <MapConfig>
      <AudioManager>
        <SelectAudio>
          <div className="preventlandscape"><h1>Please rotate your device to Portrait mode.</h1></div>
          <div className="load" id={isLoading ? "" : "hide"}>
            <h1>Online Editor for osu!</h1>
            <div className="center">
              <h2>Loading...</h2>
              <h4>This may take a few seconds.</h4></div>
          </div>
          <div className="popupwindow">
            <h4>EDITOR</h4>
            <p className="text">Example</p>
          </div>
          <Timeline />
          <Navbar currentSection={currentSection} setCurrentSection={setCurrentSection} showMessage={showMessage} />
          <Playfield currentSection={currentSection} showMessage={showMessage} />
        </SelectAudio>
      </AudioManager>
    </MapConfig>
  );
}

export default Editor;