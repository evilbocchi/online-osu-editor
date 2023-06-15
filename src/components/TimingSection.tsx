import DetailedTimeline from "@/components/DetailedTimeline";

const TimingSection = ({ active }) => {
    //@ts-ignore
    return (<div className="section" id="files" active={active}>
        <DetailedTimeline />
        <div className="content">

        </div>

    </div>);
}

export default TimingSection;