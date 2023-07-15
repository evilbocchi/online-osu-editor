import React from 'react';
import FileProvider from '#root/contexts/FileSystem';
import Editor from '#root/Editor';
import "#root/styles/styles.scss";

export function Page() {
  return (
    <React.StrictMode>
      <FileProvider>
        <Editor />
      </FileProvider>
    </React.StrictMode>
  );
}
