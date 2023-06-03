import React, { useState, useEffect, useContext } from "react";
import * as BrowserFS from 'browserfs';
import { FileContext } from "../contexts/FileSystem";

import { ROOT_DIRECTORY } from '../utils/constants';
import { FSModule } from "browserfs/dist/node/core/FS";

class PathVisualiser extends React.Component<{ path: string, cd: any }> {
    constructor(props) {
        super(props);
    }

    render() {
        var path = this.props.path;
        var split = path == ROOT_DIRECTORY ? [""] : path.split("/");
        split[0] = "";
        var paths = [];
        for (var i = 0; i < split.length; i++) {
            paths[i] = (i == 0) ? { fileName: ROOT_DIRECTORY, path: ROOT_DIRECTORY } : { fileName: split[i], path: split[0] };
            for (var o = 0; o <= i; o++) {
                if (o > 0) {
                    paths[i].path = paths[i].path + "/" + split[o];
                }
            }
        }
        return (<div className="path">
            {paths.map((d) => <PathButton key={d.path} path={d.path} fileName={d.fileName} cd={this.props.cd} />)}
        </div>);
    }
}

class PathButton extends React.Component<{ path: string, fileName: string, cd: React.Dispatch<React.SetStateAction<string>> }> {
    constructor(props) {
        super(props);
    }

    render() {
        return (<button onClick={(e) => {
            this.props.cd(this.props.path);
        }}>{this.props.fileName + " >"}</button>);
    }
}

class DirectoryVisualiser extends React.Component<{ path: string, cd: React.Dispatch<React.SetStateAction<string>>, fs: FSModule, selected: File }> {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="directory">
            <div className="list">

            </div>
            <div className="property">
                <h4>Properties</h4>
                <p>File Name: {this.props.selected ? "" : "-"}</p>
            </div>
        </div>);
    }
}

class DirectoryItem extends React.Component<{ fileName: string }> {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="item">
            <p>{this.props.fileName}</p>
        </div>);
    }
}

export default function FilesVisualiser() {
    var [cwd, cd] = useState(ROOT_DIRECTORY);
    var fs = useContext(FileContext);

    return (<div className="filesvisualiser">
        <PathVisualiser path={cwd} cd={cd} />
        <DirectoryVisualiser fs={fs} path={cwd} cd={cd} selected={null} />
    </div>);
}