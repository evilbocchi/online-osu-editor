import React from "react";
import FilesVisualiser from "@/components/FilesVisualiser";
import { RESOURCES } from "@/utils/constants";

export default class FilesSection extends React.Component<{active: string, showMessage: any}> {
    constructor(props) {
        super(props);
    }
    
    render() {
        // @ts-ignore
        return (<div className="section" id="files" active={this.props.active}>
            <div className="sectionnavbar">
                <div className="title">
                    <div className="emptyspace" />
                    <div className="emptyspace" />
                    <div className="hexaconwrapper">
                        <img src={RESOURCES.TEXTURES.ICONS.HEXACONS.SOCIAL} className="setuphexacon" />
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