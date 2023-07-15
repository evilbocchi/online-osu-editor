import React from 'react';
import FileProvider from '@/contexts/FileSystem';
import Editor from '@/Editor';
import "@/styles/styles.scss";

export default function App() {
    return (
        <React.StrictMode>
            <FileProvider>
                <Editor />
            </FileProvider>
        </React.StrictMode>
    );
}