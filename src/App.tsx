import React from 'react';
import FileProvider from '#/contexts/FileSystem';
import Editor from '#/Editor';
import "#/styles/styles.scss";

const App = () => {
  return (
    <React.StrictMode>
      <FileProvider>
        <Editor />
      </FileProvider>
    </React.StrictMode>
  );
}

export default App;