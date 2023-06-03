const bytesInKB = 1024;
const fileSizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];

export const getFileIcon = (filePath: string, ext: string): string => {
  switch (ext) {
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.ico':
    case '.svg':
      return filePath;
    default:
      return '/fileicons/unknown.svg';
  }
};

export const getFileKind = (ext: string): string => {
  switch (ext) {
    case '.txt':
      return 'Plain Text';
    case '.png':
      return 'PNG Image';
    case '.jpg':
    case '.jpeg':
      return 'JPEG Image';
    case '.mp3':
      return 'MP3 Audio';
    case '.ogg':
      return 'OGG Audio';
    case '.wav':
      return 'WAV Audio';
    default:
      return ext.toLocaleUpperCase().substring(1)+' File';
  }
};

export const getFormattedSize = (size: number): string => {
  if (size === -1) return 'Unknown';
  if (size === 0) return 'Zero bytes';
  if (size === 1) return '1 byte';

  const sizeFactor = Math.floor(Math.log(size) / Math.log(bytesInKB));
  const newSize = Math.round(size / bytesInKB ** sizeFactor);

  return `${newSize} ${fileSizes[sizeFactor]}`;
};
