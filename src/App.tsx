import { ReactElement } from 'react';
import FileProvider from '@/contexts/FileSystem';
import Editor from '@/Editor';
import '@/styles.css'

export default function App(): ReactElement<any> {
    return (
        <FileProvider>
            <Editor />
        </FileProvider>
    );
}