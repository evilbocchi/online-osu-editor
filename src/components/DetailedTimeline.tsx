import { useContext, useEffect, useRef, useState } from "react";
import { MapAudioContext } from "@/contexts/AudioManager";
import Toggle from "@/components/Toggle";
import { MapContext } from "@/contexts/MapManager";
import { TimingPoint } from "@/utils/hitobject";

const TimingPointIndicator = ({ timingPoint, nextTimingPoint, zoom }) => {
    const mapAudioContext = useContext(MapAudioContext);
    const [track, setTrack] = useState({ currentTime: 0 });
    const ref = useRef(null);
    useEffect(() => {
        setTrack(mapAudioContext.getTrack());
    }, []);

    useEffect(() => {
        const tpindicator = ref.current as HTMLDivElement;
        const tvWidth = tpindicator.parentElement.getBoundingClientRect().width;
        if (nextTimingPoint) {

        }

        const timer = setInterval(() => {
            tpindicator.style.left = (((timingPoint.time - (track.currentTime * 1000)) * zoom * 0.01) + (tvWidth * 0.5)).toString() + "px";
        }, 10);
        return (() => { clearInterval(timer); });
    }, [track, zoom]);

    return (<div className="tpindicator" ref={ref}>{timingPoint.bpm > 0 ? <p className="bpmlabel">{timingPoint.bpm} BPM</p> : <></>}</div>);
}

const TimelineVisualiser = ({ mapConfig, mapAudioContext, showWaveform, showTicks, showBPM, zoom }) => {
    const zTimingPoint = useRef(new TimingPoint(0, 0, false));
    return (<div className="timelinevisualiser">
        <div className="indicator" />
        <TimingPointIndicator timingPoint={zTimingPoint.current} nextTimingPoint={null} zoom={zoom} />
        {mapConfig.timingPoints.map((tp, i) => { return (<TimingPointIndicator key={i} timingPoint={tp} nextTimingPoint={mapConfig.timingPoints[i + 1]} zoom={zoom} />); })}
    </div>);
}

const DetailedTimeline = () => {
    const mapConfig = useContext(MapContext);
    const mapAudioContext = useContext(MapAudioContext);
    const [isWaveform, useWaveform] = useState(true);
    const [isTicks, useTicks] = useState(true);
    const [isBPM, useBPM] = useState(true);
    const [zoom, setZoom] = useState(100);

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
                showWaveform={isWaveform} showTicks={isTicks} showBPM={isBPM} zoom={zoom} />
        </div>
    </div>);
}

export default DetailedTimeline;