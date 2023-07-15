import { useState, useContext, useEffect } from "react";
import { FSModule } from "browserfs/dist/node/core/FS";

import { FileContext } from "@/contexts/FileSystem";
import { dataUrlToUtf8, getDataType, getDataUrl, getFileExt, getFileIcon, getFileKind, getFileName, getFormattedSize } from "@/utils/file";
import { ROOT_DIRECTORY } from '@/utils/constants';
import { rm, path, download } from "@/utils/filesystem";
import { inputDirectory, inputFiles } from "@/utils/input";
import { MapAudioContext } from "@/contexts/AudioManager";

const PathVisualiser = ({ dir, cd, setSelected }) => {
    var split = dir == ROOT_DIRECTORY ? [""] : dir.split("/");
    split[0] = "";
    var dirs = [];
    for (var i = 0; i < split.length; i++) {
        dirs[i] = (i == 0) ? { fileName: ROOT_DIRECTORY, dir: ROOT_DIRECTORY } : { fileName: split[i], dir: split[0] };
        for (var o = 0; o <= i; o++) {
            if (o > 0) {
                dirs[i].dir = dirs[i].dir + "/" + split[o];
            }
        }
    }
    return (<div className="path">
        {dirs.map((d) => <PathButton key={d.dir} dir={d.dir} fileName={d.fileName} cd={cd}
            setSelected={setSelected} />)}
    </div>);
}

const PathButton = ({ dir, fileName, cd, setSelected }) => {
    const audioManager = useContext(MapAudioContext);
    return (<p onMouseEnter={() => { audioManager.playSound("DEFAULT_HOVER"); }} onClick={() => {
        cd(dir);
        setSelected(null);
        audioManager.playSound("DEFAULT_SELECT");
    }}>{fileName + " >"}</p>);
}

const DirectoryManageOption = ({ label, onClick }) => {
    const audioManager = useContext(MapAudioContext);
    return (<div className="item" onMouseEnter={() => { audioManager.playSound("DEFAULT_HOVER"); }} onClick={(e) => {
        audioManager.playSound("DEFAULT_SELECT");
        onClick(e);
    }}>
        <p className="label">{label}</p>
    </div>);
}

const DirectoryVisualiser = ({ cwd, cd, fs, selected, setSelected }) => {
    const [files, setFiles] = useState([] as string[]);

    useEffect(() => {
        updateFiles();
    }, [cwd, fs]);

    const updateFiles = () => {
        if (fs.readFile) {
            fs.readdir(cwd, (e, f) => {
                if (e) { throw e; }
                for (var i = 0; i < f.length; i++) {
                    f[i] = path.join(cwd, f[i]);
                }
                setFiles(f);
            });
        }
    }

    const writeFiles = (files: File[]) => {
        for (var file of files) {
            const filename = file.name;
            getDataUrl(file, (err, data) => {
                if (err) { throw err; }
                fs.writeFile(path.join(cwd, filename), data, (e) => {
                    if (e) { throw e; }
                    updateFiles();
                });
            });
        }
    }

    return (<div className="directory" onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.items) {
            console.log(e.dataTransfer.items)
            var files = [];
            [...e.dataTransfer.items].forEach((item) => {
                if (item.kind === "file") {
                    const file = item.getAsFile();
                    files.push(file);
                }
            });
            writeFiles(files as any);
        }
    }} onDragOver={(e) => { e.preventDefault(); }}>
        <div className="list" onClick={(e) => {
            if (e.target == document.querySelector(".list")) {
                setSelected(null);
            }
        }}>
            <div className="manage">
                <DirectoryManageOption label="Create file" onClick={() => {
                    const name = prompt("File name:"); // no more input boxes please
                    const dir = path.join(cwd, name);
                    if (name && (name as any).replaceAll(" ", "") != "") {
                        fs.exists(dir, (exists) => {
                            if (!exists) {
                                fs.writeFile(dir, "", (e) => {
                                    if (e) { throw e; }
                                    updateFiles();
                                });
                            }
                        });
                    }
                }} />
                <DirectoryManageOption label="Create folder" onClick={() => {
                    const name = prompt("Folder name:");
                    const dir = path.join(cwd, name);
                    console.log(dir)
                    if (name && (name as any).replaceAll(" ", "") != "") {
                        fs.exists(dir, (exists) => {
                            if (!exists) {
                                fs.mkdir(dir, "", (e) => {
                                    if (e) { throw e; }
                                    updateFiles();
                                });
                            }
                        });
                    }
                }} />
                <DirectoryManageOption label="Upload files" onClick={() => {
                    inputFiles(true, (files) => { writeFiles(files); }); // inputFiles(this.writeFiles) will overwrite 'this'
                }} />
                <DirectoryManageOption label="Upload folder" onClick={() => {
                    inputDirectory((files) => { writeFiles(files); });
                }} />
                <DirectoryManageOption label="Refresh" onClick={() => {
                    updateFiles();
                }} />
            </div>
            {files.map((file) => <DirectoryItem key={file} dir={file} fs={fs} cd={cd} selected={selected} setSelected={setSelected} />)}
        </div>
        <div className="options">
            <div id={selected ? "" : "hide"}>
                <div className="manage">
                    <DirectoryManageOption label="Download" onClick={() => {
                        download(selected);
                    }} />
                    <DirectoryManageOption label="Delete" onClick={() => {
                        rm(selected, (e) => {
                            if (e) { throw e; }
                            updateFiles();
                        });
                        setSelected(null);
                    }} />
                </div>
                <FilePreview fs={fs} dir={selected} />
            </div>
        </div>
    </div>);
}

const DirectoryItem = ({ dir, fs, cd, selected, setSelected }) => {
    const audioManager = useContext(MapAudioContext);
    const [size, setSize] = useState(0);
    const [isFolder, setIsFolder] = useState(false);
    const [data, setData] = useState("");

    useEffect(() => {
        fs.stat(dir, (e, stats) => {
            if (e) { return; } // this kept blaring Error: ENOENT: No such file or directory., '/'
            setSize(stats.isDirectory() ? 0 : stats.size);
            setIsFolder(stats.isDirectory());
            if (!stats.isDirectory()) {
                fs.readFile(dir, (e, data) => {
                    if (e) { return; } // i dont know why this errors and i give up
                    setData(data.toString());
                });
            }
        });
    });

    const isSelected = () => {
        return selected == dir;
    }

    //@ts-ignore
    return (<div className="item" active={isSelected().toString()}
        onClick={() => {
            audioManager.playSound("DEFAULT_SELECT");
            setSelected(dir);
        }}
        onDoubleClick={() => {
            if (isFolder) {
                cd(dir);
                setSelected(null);
            }
        }}>
        <img className="icon" src={getFileIcon(dir, isFolder, data)} />
        <p className="label" onMouseEnter={() => { audioManager.playSound("DEFAULT_HOVER"); }}>{getFileName(dir)}</p>
        <p className="info">{getFileKind(dir, isFolder)}</p>
        <p className="info">{size > 0 ? getFormattedSize(size) : ""}</p>
    </div>);
}

const FilePreview = ({ fs, dir }: { fs: FSModule, dir: string }) => {
    const [dataType, setDataType] = useState("File");
    const [data, setData] = useState("");

    useEffect(() => {
        if (fs.readFile && dir) {
            fs.stat(dir, (e, stats) => {
                if (e) { throw e; }
                if (stats.isDirectory()) {
                    setDataType("Folder");
                    return;
                }
                fs.readFile(dir, 'utf-8', (e, data) => {
                    if (e) { throw e; }
                    setData(data.toString());
                    setDataType(getDataType(getFileExt(dir)));
                })
            })
        }
    }, [fs, dir]);

    return (<div className="preview">
        <p className="text" id={dataType == "File" ? "" : "hide"}>
            {dataType == "File" ? dataUrlToUtf8(data) : ""}
        </p>
        <img className="image" id={dataType == "Image" ? "" : "hide"}
            src={dataType == "Image" ? data : ""} />
        <audio controls className="audio" id={dataType == "Audio" ? "" : "hide"}
            src={dataType == "Audio" ? data : ""} />
        <video controls className="video" id={dataType == "Video" ? "" : "hide"}
            src={dataType == "Video" ? data : ""} />
    </div>);
}

export default function FilesVisualiser() {
    var [cwd, cd] = useState(ROOT_DIRECTORY);
    var [selected, setSelected] = useState(null as string);
    var fs = useContext(FileContext);

    return (<div className="filesvisualiser">
        <PathVisualiser dir={cwd} cd={cd} setSelected={setSelected} />
        <DirectoryVisualiser fs={fs} cwd={cwd} cd={cd} selected={selected} setSelected={setSelected} />
    </div>);
}