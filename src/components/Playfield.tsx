import React from "react";
import FilesSection from "#/components/FilesSection";
import SetupSection from "#/components/SetupSection";
import DesignSection from "#/components/DesignSection";
import TimingSection from "#/components/TimingSection";

const Playfield = ({ currentSection, showMessage }) => {
    return (<>
        <FilesSection active={currentSection == "files"} />
        <SetupSection showMessage={showMessage} active={currentSection == "setup"} />
        <DesignSection active={currentSection == "design"} />
        <TimingSection active={currentSection == "timing"} />
    </>);
}

export default Playfield;