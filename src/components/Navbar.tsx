import { AppState } from "@/Editor";
import React from "react";

function NavbarDropdownOption({ label, type, onClick }) {
    return (<a type={type} onClick={onClick}>{label}</a>)
}

function NavbarDropdown({ label, options }) {
    return (<div className="dropdown">
        <button className="dropbtn">{label}</button>
        <div className="dropdown-content">{options}</div>
    </div>)
}

class NavbarButton extends React.Component<{id: string, label: string, currentSection: string, setCurrentSection: any}> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            // @ts-ignore
            <div className="button" id={this.props.id} active={(this.props.currentSection == this.props.id).toString()} onClick={(e) => this.props.setCurrentSection(this.props.id)}>
                <button className="buttonlabel">{this.props.label}</button>
            </div>
        );
    }
}

export default class Navbar extends React.Component<{currentSection: string, setCurrentSection: any, showMessage: any, save: any}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="navbar">
                <div>
                    <NavbarDropdown label="File" options={
                        <>
                            <NavbarDropdownOption label='Save' type="button" onClick={() => {
                                this.props.save();
                                this.props.showMessage("Beatmap saved", 2000);
                            }} />
                            <NavbarDropdownOption label='Export package' type="button" onClick={() => {
                                
                            }}/>
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
                            <NavbarDropdownOption label='Set preview point to current time' type="button"onClick={() => {
                                
                            }} />
                        </>
                    } />
                </div>
                <div>
                    <NavbarButton id="files" label="files" currentSection={this.props.currentSection} setCurrentSection={this.props.setCurrentSection} />
                    <NavbarButton id="setup" label="setup" currentSection={this.props.currentSection} setCurrentSection={this.props.setCurrentSection} />
                    <NavbarButton id="compose" label="compose" currentSection={this.props.currentSection} setCurrentSection={this.props.setCurrentSection} />
                    <NavbarButton id="design" label="design" currentSection={this.props.currentSection} setCurrentSection={this.props.setCurrentSection} />
                    <NavbarButton id="timing" label="timing" currentSection={this.props.currentSection} setCurrentSection={this.props.setCurrentSection} />
                    <NavbarButton id="verify" label="verify" currentSection={this.props.currentSection} setCurrentSection={this.props.setCurrentSection} />
                </div>
            </div>
        );
    }
}