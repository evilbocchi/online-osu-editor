import { useContext } from "react";
import { MapAudioContext } from "@/contexts/AudioManager";

function NavbarDropdownOption({ label, type, onClick }) {
    const audioManager = useContext(MapAudioContext);
    return (<a type={type} onClick={onClick} onMouseEnter={() => { audioManager.playSound("DEFAULT_HOVER"); }}>{label}</a>)
}

function NavbarDropdown({ label, options }) {
    const audioManager = useContext(MapAudioContext);
    return (<div className="dropdown" onMouseEnter={() => { audioManager.playSound("DEFAULT_HOVER"); }}>
        <button className="dropbtn">{label}</button>
        <div className="dropdown-content">{options}</div>
    </div>)
}

const NavbarTabSelect = ({ id, label, currentSection, setCurrentSection }) => {
    const audioManager = useContext(MapAudioContext);
    return (
        // @ts-ignore
        <div className="button" id={id} active={(currentSection == id).toString()} onClick={() => {
            setCurrentSection(id);
            audioManager.playSound("TABSELECT_SELECT");
        }} onMouseEnter={() => { audioManager.playSound("DEFAULT_HOVER"); }}>
            <button className="buttonlabel">{label}</button>
        </div>
    );
}

const Navbar = ({ currentSection, setCurrentSection, showMessage }) => {
    return (
        <div className="navbar">
            <div>
                <NavbarDropdown label="File" options={
                    <>
                        <NavbarDropdownOption label='Save' type="button" onClick={() => {
                            showMessage("Beatmap saved", 2000);
                        }} />
                        <NavbarDropdownOption label='Export package' type="button" onClick={() => {

                        }} />
                        <NavbarDropdownOption label='Create new difficulty' type="button" onClick={() => {

                        }} />
                        <NavbarDropdownOption label='Change difficulty' type="button" onClick={() => {

                        }} />
                        <NavbarDropdownOption label='Delete difficulty' type="button" onClick={() => {

                        }} />
                    </>
                } />
                <NavbarDropdown label="Edit" options={
                    <>
                        <NavbarDropdownOption label='Undo' type="button" onClick={() => {

                        }} />
                        <NavbarDropdownOption label='Redo' type="button" onClick={() => {

                        }} />
                        <NavbarDropdownOption label='Cut' type="button" onClick={() => {

                        }} />
                        <NavbarDropdownOption label='Copy' type="button" onClick={() => {

                        }} />
                        <NavbarDropdownOption label='Paste' type="button" onClick={() => {

                        }} />
                        <NavbarDropdownOption label='Clone' type="button" onClick={() => {

                        }} />
                    </>
                } />
                <NavbarDropdown label="View" options={
                    <>
                        <NavbarDropdownOption label='Waveform opacity' type="button" onClick={() => {

                        }} />
                        <NavbarDropdownOption label='Background dim' type="button" onClick={() => {

                        }} />
                        <NavbarDropdownOption label='Show hit markers' type="checkbox" onClick={() => {

                        }} />
                        <NavbarDropdownOption label='Automatically seek after placing objects' type="checkbox" onClick={() => {

                        }} />
                    </>
                } />
                <NavbarDropdown label="Timing" options={
                    <>
                        <NavbarDropdownOption label='Set preview point to current time' type="button" onClick={() => {

                        }} />
                    </>
                } />
            </div>
            <div>
                <NavbarTabSelect id="files" label="files" currentSection={currentSection} setCurrentSection={setCurrentSection} />
                <NavbarTabSelect id="setup" label="setup" currentSection={currentSection} setCurrentSection={setCurrentSection} />
                <NavbarTabSelect id="compose" label="compose" currentSection={currentSection} setCurrentSection={setCurrentSection} />
                <NavbarTabSelect id="design" label="design" currentSection={currentSection} setCurrentSection={setCurrentSection} />
                <NavbarTabSelect id="timing" label="timing" currentSection={currentSection} setCurrentSection={setCurrentSection} />
                <NavbarTabSelect id="verify" label="verify" currentSection={currentSection} setCurrentSection={setCurrentSection} />
            </div>
        </div>
    );
}

export default Navbar;