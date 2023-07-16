import { useContext, useEffect, useRef, useState } from "react";
import { MapAudioContext } from "#/contexts/AudioManager";
import Toggle from "#/components/Toggle";
import { MapContext } from "#/contexts/MapManager";
import { TimingPoint } from "#/utils/hitobject";

// place these elsewhere soon
const getXPos = (time, currentTime, zoom) => {
    return (time - currentTime) * 0.01 * zoom;
}
const gcd = (a, b) => {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}
const getTickColor = (beatDivide) => {
    switch (beatDivide) {
        case 1:
        default:
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
    }
}

const changeDivisor = (beatDivisor, delta) => {
    switch (beatDivisor + delta) {
        default:
            return beatDivisor + delta < 1 ? 1 : (beatDivisor + delta > 16 ? 16 : beatDivisor + delta);
        case 5:
        case 7:
        case 9:
        case 10:
        case 11:
        case 13:
        case 14:
        case 15:
            return delta > 0 ? changeDivisor(beatDivisor, delta + 1) : changeDivisor(beatDivisor, delta - 1);
    }
}

const TimingPointIndicator = ({ timingPoint, nextTimingPoint, zoom, beatDivisor, showTicks, track, viewWidth }) => {
    const [ticks, setTicks] = useState([]);
    const ref = useRef(null);
    const updateBeatTicks = () => {
        if (showTicks && track) {
            const newTicks = [];
            var i = 0;
            var currentBeatDivide = 0;

            const endTime = (nextTimingPoint && nextTimingPoint.time < track.duration * 1000) ?
                nextTimingPoint.time : track.duration * 1000;
            while (true) {
                const time = timingPoint.time + (i * (1 / timingPoint.bpm) * 60000 / beatDivisor);
                i++;
                currentBeatDivide = currentBeatDivide > beatDivisor - 1 ? 1 : currentBeatDivide + 1;
                if (time > endTime || i > 9999) {
                    break;
                }
                if (Math.abs(time - track.currentTime * 1000) > viewWidth / zoom * 100) {
                    continue;
                }
                newTicks.push({ beatDivide: beatDivisor / gcd(currentBeatDivide - 1, beatDivisor), time: time });
            }
            setTicks(newTicks);
        }
        else {
            setTicks([]);
        }
    }
    useEffect(() => {
        const timer = setInterval(() => {
            if (track) {
                ref.current.style.left = (getXPos(timingPoint.time, track.currentTime * 1000, zoom)
                    + (viewWidth * 0.5)).toString() + "px";
            }
        }, 10);
        return (() => { clearInterval(timer); });
    }, [track, zoom]);

    useEffect(() => {
        updateBeatTicks();
        if (track) {
            track.addEventListener("durationchange", updateBeatTicks);
            track.addEventListener("timeupdate", updateBeatTicks);
        }
        return (() => {
            if (track) {
                track.removeEventListener("durationchange", updateBeatTicks);
                track.removeEventListener("timeupdate", updateBeatTicks);
            }
        });
    }, [showTicks, beatDivisor, track, zoom]);

    return (<div className="tpindicator" ref={ref}>
        {timingPoint.bpm > 0 ? <p className="bpmlabel">{timingPoint.bpm} BPM</p> : <></>}
        {ticks.map((tick) => {
            //@ts-ignore
            return (<BeatIndicator key={tick.time} pos={getXPos(tick.time, timingPoint.time, zoom)} time={tick.time}
                beatDivide={tick.beatDivide} bpm={timingPoint.bpm} />);
        })}
    </div>);
}

const BeatIndicator = ({ time, beatDivide, bpm, pos }) => {
    const ref = useRef(null);
    useEffect(() => {
        ref.current.style.width = (2 / beatDivide + 1).toString() + "px";
        ref.current.style.height = (0.06 * (16 - beatDivide) + 2.7).toString() + "vw";
        ref.current.style.backgroundColor = getTickColor(beatDivide);
    }, []);
    useEffect(() => {
        if (ref.current) {
            ref.current.style.left = pos + "px";
        }
    }, [pos]);
    //@ts-ignore
    return (<div className="beatindicator" ref={ref} time={time} beatdivide={beatDivide} bpm={bpm}></div>);
}

const TimelineVisualiser = ({ mapConfig, mapAudioContext, showWaveform, showTicks, showBPM, zoom, beatDivisor }) => {
    const zTimingPoint = useRef(new TimingPoint(0, 0, false));
    const [track, setTrack] = useState(null);
    const [viewWidth, setViewWidth] = useState(0);
    const ref = useRef(null);
    const handleWheel = (e) => {
        e.preventDefault();
        var nextTo = null;

        document.querySelectorAll(".beatindicator").forEach((element) => {
            const time = parseInt(element.getAttribute("time"));
            const currentTime = track.currentTime * 1000;
            const k = e.deltaY > 0 ? 1 : -1;
            if (k * (time - currentTime) > 0 && ((!nextTo && time != currentTime) ||
                (k * (parseInt(nextTo.getAttribute("time")) - currentTime) > k * (time - currentTime)))) {
                nextTo = element;
            }
        });
        if (nextTo) {
            goToTime(parseInt(nextTo.getAttribute("time")) / 1000);
        }
    }
    useEffect(() => {
        setTrack(mapAudioContext.getTrack());
    }, [mapAudioContext]);
    useEffect(() => {
        setViewWidth(ref.current.getBoundingClientRect().width);
        if (track) { ref.current.addEventListener("wheel", handleWheel, { passive: false }); }
        return (() => { if (ref.current) { ref.current.removeEventListener("wheel", handleWheel, { passive: false }); } });
    }, [track]);
    const goToTime = (time) => {
        document.querySelectorAll(".tpindicator").forEach((element: any) => {
            element.style.transition = "0.1s"; setTimeout(() => { element.style.transition = ""; }, 10);
        })
        track.currentTime = time;
    }

    return (<div className="timelinevisualiser" ref={ref} onMouseMove={(e) => {
        if (e.buttons > 0) {
            track.currentTime -= e.movementX / zoom * 0.1;
        }
    }} onDoubleClick={() => {
        var nearest = null;
        document.querySelectorAll(".beatindicator").forEach((element) => {
            if (!nearest || Math.abs(parseInt(nearest.getAttribute("time")) - (track.currentTime * 1000)) >
                Math.abs(parseInt(element.getAttribute("time")) - (track.currentTime * 1000))) {
                nearest = element;
            }
        });
        if (nearest) {
            goToTime(parseInt(nearest.getAttribute("time")) / 1000);
        }
    }}>
        <div className="indicator" />
        <TimingPointIndicator timingPoint={zTimingPoint.current} nextTimingPoint={null} zoom={zoom} beatDivisor={beatDivisor}
            showTicks={false} track={track} viewWidth={viewWidth} />
        {mapConfig.timingPoints.map((tp, i) => {
            return (<TimingPointIndicator key={i} timingPoint={tp} nextTimingPoint={mapConfig.timingPoints[i + 1]} zoom={zoom}
                beatDivisor={beatDivisor} showTicks={showTicks} track={track} viewWidth={viewWidth} />);
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

    const handleSnapWheel = (e) => {
        e.preventDefault();
        setBeatDivisor(changeDivisor(beatDivisor, e.deltaY < 0 ? 1 : -1));
        mapAudioContext.playSound("NOTCH_TICK", 1, (beatDivisor / 16 - 0.5) * 500);
    }
    useEffect(() => {
        const element = document.querySelector(".snapoptions") as any;
        element.addEventListener("wheel", handleSnapWheel, { passive: false });
        return (() => { element.removeEventListener("wheel", handleSnapWheel, { passive: false }); })
    }, [beatDivisor]);

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
            <div className="snapoptions">
                <h2>1/{beatDivisor}</h2>
                <div className="buttons">
                    <div onClick={() => {
                        mapAudioContext.playSound("DEFAULT_SELECT");
                        setBeatDivisor(changeDivisor(beatDivisor, -1));
                    }}><h3>&lt;</h3></div>
                    <div onClick={() => {
                        mapAudioContext.playSound("DEFAULT_SELECT");
                        setBeatDivisor(changeDivisor(beatDivisor, 1));
                    }}><h3>&gt;</h3></div>
                </div>
                <p>Beat Snap</p>
            </div>
        </div>
    </div>);
}

export default DetailedTimeline;