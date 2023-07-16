import { useContext, useEffect, useState } from "react";
import DetailedTimeline from "#/components/DetailedTimeline";
import { MapContext } from "#/contexts/MapManager";
import { formatTime } from "#/utils/hitobject";
import Toggle from "#/components/Toggle";

const TimingSection = ({ active }) => {
    const mapConfig = useContext(MapContext);
    const [timingPoints, setTimingPoints] = useState([]);

    useEffect(() => {
        setTimingPoints(mapConfig.timingPoints);
    }, [mapConfig]);

    //@ts-ignore
    return (<div className="section" id="timing" active={active.toString()}>
        <DetailedTimeline />
        <div className="timingoptions">
            <div className="timingpointsoptions">
                <div className="timeoptions">
                    <div>
                        <h4>TIME</h4>
                    </div>
                    {timingPoints.map((timingPoint) => {
                        return (<div className="timeoption" key={timingPoint.time}>
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
                <h1>uguuuu</h1>
            </div>
        </div>

    </div>);
}

export default TimingSection;