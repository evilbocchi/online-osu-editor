import React from "react";
import { AppState, MapSettings } from "@/Editor";
import FilesSection from "@/components/FilesSection";
import SetupSection from "@/components/SetupSection";


export default class Playfield extends React.Component<{state: AppState, setStateKey: any, mapSettings: MapSettings, setMapSetting: any, showMessage: any}> {
    constructor(props) {
        super(props);

    }

    render() {
        return (<>
            <FilesSection state={this.props.state} setStateKey={this.props.setStateKey} showMessage={this.props.showMessage} active={(this.props.state.currentSection == "files").toString()} />
            <SetupSection mapSettings={this.props.mapSettings} setMapSetting={this.props.setMapSetting} showMessage={this.props.showMessage} active={(this.props.state.currentSection == "setup").toString()} />
        </>);
    }
}