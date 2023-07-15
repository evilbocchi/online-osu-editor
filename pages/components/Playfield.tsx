import React from "react";
import FilesSection from "#root/components/FilesSection";
import SetupSection from "#root/components/SetupSection";
import DesignSection from "#root/components/DesignSection";
import TimingSection from "#root/components/TimingSection";

const Playfield = ({ currentSection, showMessage }) => {
    return (<>
        <FilesSection active={currentSection == "files"} />
        <SetupSection showMessage={showMessage} active={currentSection == "setup"} />
        <DesignSection active={currentSection == "design"} />
        <TimingSection active={currentSection == "timing"} />
    </>);
}

export default Playfield;