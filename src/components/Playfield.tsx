import React from "react";
import FilesSection from "@/components/FilesSection";
import SetupSection from "@/components/SetupSection";

export default class Playfield extends React.Component<{currentSection: string, showMessage: any}> {
    constructor(props) {
        super(props);

    }

    render() {
        return (<>
            <FilesSection showMessage={this.props.showMessage} active={(this.props.currentSection == "files").toString()} />
            <SetupSection showMessage={this.props.showMessage} active={(this.props.currentSection == "setup").toString()} />
        </>);
    }
}