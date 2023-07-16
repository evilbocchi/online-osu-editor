import FilesVisualiser from "#/components/FilesVisualiser";
import { RESOURCES } from "#/utils/constants";

const FilesSection = ({ active }) => {
    // @ts-ignore
    return (<div className="section" id="files" active={active.toString()}>
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

export default FilesSection;