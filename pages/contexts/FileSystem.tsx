import * as BrowserFS from 'browserfs';
import { createContext, useEffect, useState } from 'react';
import { ROOT_DIRECTORY } from '#root/utils/constants';
import { FSModule } from 'browserfs/dist/node/core/FS';

export const FileContext = createContext<FSModule>({} as FSModule);

const FileProvider: React.FC<any> = ({ children }) => {
  var [fs, setFs] = useState({} as FSModule);

  useEffect(() => {
    BrowserFS.install(window);

    BrowserFS.configure(
      {
        fs: 'MountableFileSystem',
        options: {
          [ROOT_DIRECTORY]: {
            fs: 'IndexedDB',
            options: {
              storeName: `browser-fs-cache`
            }
          }
        }
      },
      (e) => {
        if (e) {
          throw e;
        }
        setFs(BrowserFS.BFSRequire('fs'));
      }
    );
  }, [fs]);

  return <FileContext.Provider value={fs}>{children}</FileContext.Provider>;
};

export default FileProvider;
