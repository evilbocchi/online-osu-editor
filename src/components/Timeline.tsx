import { useContext, useEffect } from "react";
import { MapAudioContext } from "@/contexts/AudioManager";
import { getBPM } from "@/utils/hitobject";

const SpeedOption = ({ speed }) => {
    const context = useContext(MapAudioContext);

    return (
        <div className="button" id={speed.toString()}
            //@ts-ignore
            active={(context.trackSpeed == speed).toString()}
            onClick={() => context.setTrackSpeed(speed)}>
            <button className="buttonlabel">{speed * 100}%</button>
        </div>
    );
}

const Timeline = ({ }) => {

    const mapAudioContext = useContext(MapAudioContext);

    const formatTime = (s: number) => {
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

    useEffect(() => {
        const ctlabel = document.querySelector(".ctlabel");
        const cblabel = document.querySelector(".cblabel");
        const track = mapAudioContext.getTrack();
        const indicator: HTMLDivElement | null = document.querySelector(".indicator");

        const update = setInterval(() => {
            const currentTime = track ? Math.floor(track.currentTime * 1000) : 0;
            const length = track ? (track.duration ? track.duration * 1000 : 1) : 1;
            if (ctlabel && cblabel && indicator) {
                ctlabel.innerHTML = formatTime(currentTime);
                cblabel.innerHTML = getBPM(mapAudioContext.timingPoints, track.currentTime).toString() + " BPM";
                indicator.style.margin = "0 0 0 " + ((currentTime / length * 100).toString()) + "%";
            }

        }, 1);
        return function cleanup() { clearInterval(update); }
    }, [mapAudioContext]);


    const timelineMove = (e: MouseEvent) => {
        const track = mapAudioContext.getTrack();
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

    return (<div className="timeline">
        <div className="labels">
            <h3 className="ctlabel"></h3>
            <h4 className="cblabel"></h4>
        </div>
        <div className="main" onMouseMove={(e) => {
            if (e.buttons > 0) {
                timelineMove(e as any);
            }
        }} onClick={timelineMove as any}>
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
                    <SpeedOption speed={0.25} />
                    <SpeedOption speed={0.5} />
                    <SpeedOption speed={0.75} />
                    <SpeedOption speed={1} />
                </div>
            </div>
            <div className="button" id="playbutton"
                onClick={() => {
                    mapAudioContext.setPlaying(!mapAudioContext.isPlaying);
                }}>
                <button className="buttonlabel">{mapAudioContext.isPlaying == true ? "Stop" : "Play"}</button>
            </div>
        </div>
    </div>);
}

export default Timeline;