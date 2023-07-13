import { useContext, useEffect, useRef, useState } from "react";
import { MapAudioContext } from "@/contexts/AudioManager";
import Toggle from "@/components/Toggle";
import { MapContext } from "@/contexts/MapManager";
import { TimingPoint } from "@/utils/hitobject";


const TimingPointIndicator = ({ timingPoint, nextTimingPoint, zoom, beatDivisor, showTicks }) => {
    const mapAudioContext = useContext(MapAudioContext);
    const [track, setTrack] = useState({ currentTime: 0 });
    const [ticks, setTicks] = useState([]);
    const ref = useRef(null);
    // helper functions will never move
    const getXPos = (time, currentTime) => {
        return (time - currentTime) * zoom * 0.01;
    }
    const gcd = (a, b) => {
        if (b === 0) {
            return a;
        }
        return gcd(b, a % b);
    }
    useEffect(() => {
        setTrack(mapAudioContext.getTrack());
        if (nextTimingPoint && showTicks) {
            const newTicks = [];
            var t = timingPoint.time;
            var currentBeatDivide = 1;
            while (t < nextTimingPoint.time) {
                newTicks.push({ beatDivide: beatDivisor / gcd(currentBeatDivide - 1, beatDivisor), time: t });
                t += (1 / timingPoint.bpm) * 60000 / beatDivisor;
                currentBeatDivide = currentBeatDivide > beatDivisor - 1 ? 1 : currentBeatDivide + 1;
            }
            setTicks(newTicks);
        }
        else {
            setTicks([]);
        }
    }, [showTicks]);

    useEffect(() => {
        const timer = setInterval(() => {
            ref.current.style.left = (getXPos(timingPoint.time, track.currentTime * 1000)
                + (ref.current.parentElement.getBoundingClientRect().width * 0.5)).toString() + "px";
        }, 10);
        return (() => { clearInterval(timer); });
    }, [track, zoom]);

    return (<div className="tpindicator" ref={ref}>
        {timingPoint.bpm > 0 ? <p className="bpmlabel">{timingPoint.bpm} BPM</p> : <></>}
        {ticks.map((tick) => {
            //@ts-ignore
            return (<BeatIndicator key={tick.time} pos={getXPos(tick.time, timingPoint.time)} time={tick.time}
                beatDivide={tick.beatDivide} />);
        })}

    </div>);
}

const BeatIndicator = ({ time, beatDivide, pos }) => {
    const ref = useRef(null);
    // would place this elsewhere but its fine
    const getTickColor = () => {
        switch (beatDivide) {
            case 1:
                return "#FFFFFF";
            case 2:
                return "#ED1121";
            case 3:
                return "#8866EE";
            case 4:
                return "#66CCFF";
            case 6:
                return "#D19806";
            case 8:
                return "#FFCC22";
            case 12:
                return "#AF5C07";
            case 16:
                return "#593FAD";
            default:
                return "#FFFFFF";
        }
    }
    useEffect(() => {
        ref.current.style.width = (2 / beatDivide + 1).toString() + "px";
        ref.current.style.height = (0.05 * (16 - beatDivide) + 2.7).toString() + "vw";
        ref.current.style.backgroundColor = getTickColor();
    }, []);
    useEffect(() => {
        const timer = setInterval(() => {
            ref.current.style.left = pos + "px";
        }, 10);
        return (() => { clearInterval(timer); });
    }, [pos]);

    //@ts-ignore
    return (<div className="beatindicator" ref={ref} time={time} beatdivide={beatDivide}></div>);
}


const TimelineVisualiser = ({ mapConfig, mapAudioContext, showWaveform, showTicks, showBPM, zoom, beatDivisor }) => {
    const zTimingPoint = useRef(new TimingPoint(0, 0, false));
    const track = mapAudioContext.getTrack();
    return (<div className="timelinevisualiser" onMouseMove={(e) => {
        if (e.buttons > 0) {
            track.currentTime -= e.movementX / 1000;
        }
    }} onDoubleClick={(e) => {
        var nearest = null;
        document.querySelectorAll(".beatindicator").forEach((element) => {
            if (!nearest || Math.abs(parseInt(nearest.getAttribute("time")) - (track.currentTime * 1000)) >
                Math.abs(parseInt(element.getAttribute("time")) - (track.currentTime * 1000))) {
                nearest = element;
            }
        }); if (nearest) {
            document.querySelectorAll(".tpindicator").forEach((element: any) => {
                element.style.transition = "0.1s"; setTimeout(() => { element.style.transition = ""; }, 10);
            })
            track.currentTime = parseInt(nearest.getAttribute("time")) / 1000;
        }
    }}>
        <div className="indicator" />
        <TimingPointIndicator timingPoint={zTimingPoint.current} nextTimingPoint={null} zoom={zoom} beatDivisor={beatDivisor}
            showTicks={showTicks} />
        {mapConfig.timingPoints.map((tp, i) => {
            return (<TimingPointIndicator key={i} timingPoint={tp}
                nextTimingPoint={mapConfig.timingPoints[i + 1]} zoom={zoom} beatDivisor={beatDivisor} showTicks={showTicks} />);
        })}
    </div>);
}

const DetailedTimeline = () => {
    const mapConfig = useContext(MapContext);
    const mapAudioContext = useContext(MapAudioContext);
    const [isWaveform, useWaveform] = useState(true);
    const [isTicks, useTicks] = useState(true);
    const [isBPM, useBPM] = useState(true);
    const [zoom, setZoom] = useState(100);
    const [beatDivisor, setBeatDivisor] = useState(4);

    return (<div className="detailedtimeline">
        <div className="main">
            <div className="viewoptions">
                <Toggle label="Waveform" id="waveform" defaultValue={true} onClick={(e) => {
                    useWaveform(e.target.checked);
                }} />
                <Toggle label="Ticks" id="ticks" defaultValue={true} onClick={(e) => {
                    useTicks(e.target.checked);
                }} />
                <Toggle label="BPM" id="bpm" defaultValue={true} onClick={(e) => {
                    useBPM(e.target.checked);
                }} />
            </div>
            <div className="zoomoptions">
                <div className="zoomin" onClick={() => {
                    mapAudioContext.playSound("DEFAULT_SELECT");
                    setZoom(zoom + 5);
                }}><h2>+</h2></div>
                <div className="zoomout" onClick={() => {
                    mapAudioContext.playSound("DEFAULT_SELECT");
                    if (zoom > 10) {
                        setZoom(zoom - 5);
                    }
                }}><h2>-</h2></div>
            </div>
            <TimelineVisualiser mapConfig={mapConfig} mapAudioContext={mapAudioContext}
                showWaveform={isWaveform} showTicks={isTicks} showBPM={isBPM} zoom={zoom} beatDivisor={beatDivisor} />
        </div>
    </div>);
}

export default DetailedTimeline;