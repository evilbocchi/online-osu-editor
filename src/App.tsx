import { ReactElement } from 'react';
import FileProvider from '@/contexts/FileSystem';
import Editor from '@/Editor';

export function autoBind(instance: any) {
    const props = Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).filter(p => typeof instance[p] === 'function');
    props.forEach(p => instance[p] = instance[p].bind(instance));
  }

export default function App(): ReactElement {
    return (
        <FileProvider>
            <Editor />
        </FileProvider>
    );
}