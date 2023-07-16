import { useContext, useEffect, useRef, useState } from "react";
import DetailedTimeline from "#/components/DetailedTimeline";
import { MapContext } from "#/contexts/MapManager";
import { formatTime, getSelected } from "#/utils/hitobject";
import Toggle from "#/components/Toggle";
import { TextBoxOption } from "./SetupSection";
import { MapAudioContext } from "#/contexts/AudioManager";

const TimingSection = ({ active }) => {
    const mapConfig = useContext(MapContext);
    const audioManager = useContext(MapAudioContext);
    const [timingPoints, setTimingPoints] = useState([]);
    const [selectedTimingPoints, setSelectedTimingPoints] = useState([]);
    const [lastSelected, setLastSelected] = useState(null);
    const timeoptions = useRef(null);

    useEffect(() => {
        setTimingPoints(mapConfig.timingPoints);
    }, [mapConfig]);

    //@ts-ignore
    return (<div className="section" id="timing" active={active.toString()}>
        <DetailedTimeline />
        <div className="timingoptions">
            <div className="timingpointsoptions">
                <div className="timeoptions" ref={timeoptions} onClick={(e) => {
                    if (e.target == timeoptions.current) {
                        setSelectedTimingPoints([]);
                    }
                }}>
                    <div>
                        <h4>TIME</h4>
                    </div>
                    {timingPoints.map((timingPoint) => {
                        //@ts-ignore
                        return (<div active={(selectedTimingPoints.indexOf(timingPoint) > -1).toString()}
                            className="timeoption" key={timingPoint.time} onClick={(e) => {
                                audioManager.playSound("DEFAULT_SELECT");
                                const selected = getSelected(e, selectedTimingPoints, lastSelected ? lastSelected :
                                    timingPoint, timingPoint, timingPoints);
                                setLastSelected(timingPoint);
                                setSelectedTimingPoints(selected);
                            }} onDoubleClick={() => { audioManager.getTrack().currentTime = timingPoint.time / 1000; }} >
                            <h4>{formatTime(timingPoint.time)}</h4>
                            <h4 className="info">{timingPoint.bpm}bpm {timingPoint.divisor}/{timingPoint.divisor}</h4>
                        </div>);
                    })}
                </div>
                <div className="attributeoptions">
                    <div>
                        <h4>ATTRIBUTES</h4>
                    </div>
                    {timingPoints.map((timingPoint) => {
                        return (<div className="attributeoption" key={timingPoint.time}>
                            <Toggle label="Kiai" id="kiai" defaultValue={timingPoint.isKiai} onClick={() => {
                                console.log(mapConfig.timingPoints)
                            }}></Toggle>
                        </div>);
                    })}
                </div>
            </div>
            <div className="timingpointeditor">
                <div className="emptyspace" />
                <p>Note: If your timeline appears to be "laggy" when played at low speed i.e. 25%,
                    your browser is rounding off the current time of the track. Use this section with caution.</p>
                <TextBoxOption label="Time" id="timingpointtime"
                    defaultValue={selectedTimingPoints.length == 1 ? selectedTimingPoints[0].time : ""} onChange={
                        (e) => {
                            const value = parseInt(e.target.value);
                            if (value) {

                            }
                        }} />
            </div>
        </div>

    </div>);
}

export default TimingSection;