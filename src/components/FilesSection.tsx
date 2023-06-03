import React from "react";
import { AppState } from "@/Editor";
import FilesVisualiser from "@/components/FilesVisualiser";
import { HEXACONS } from "@/utils/constants";



export default class FilesSection extends React.Component<{active: string, state: AppState, setStateKey: any, showMessage: any}> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        // @ts-ignore
        return (<div className="section" id="files" active={this.props.active}>
            <div className="sectionnavbar">
                <div className="title">
                    <div className="emptyspace" />
                    <div className="emptyspace" />
                    <div className="hexaconwrapper">
                        <img src={HEXACONS.SOCIAL} className="setuphexacon" />
                    </div>
                    <div className="emptyspace" />
                    <p>files</p>
                </div>
                <div className="outline" />
            </div>
            <div className="content">
                <FilesVisualiser />
            </div>

        </div>);
    }
}