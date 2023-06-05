const bytesInKB = 1024;
const fileSizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];

export const getFileName = (filePath: string): string => {
  const split = filePath.split("/");
  return split[split.length - 1];
}

export const getFileExt = (filePath: string): string => {
  const ext = filePath.split(".")[1];
  return ext ? ext : "";
}

export const getFileIcon = (filePath: string, isFolder?: boolean, data?: string): string => {
  if (isFolder) {
    return '/fileicons/folder.png';
  }
  const ext = getFileExt(filePath);
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'ico':
    case 'svg':
      return data ? data : filePath;
    default:
      return '/fileicons/unknown.svg';
  }
};

export const getDataType = (ext: string): string => {
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'ico':
    case 'svg':
      return "Image";
    case 'mp3':
    case 'wav':
    case 'ogg':
      return 'Audio';
    case 'mp4':
    case 'avi':
    case 'mov':
      return 'Video';
    default:
      return "File";
  }
}

export const getFileKind = (filePath: string, isFolder?: boolean): string => {
  if (isFolder) {
    return "File folder";
  }
  const ext = getFileExt(filePath);
  switch (ext) {
    case 'txt':
      return 'Plain Text';
    case 'jpg':
    case 'jpeg':
      return 'JPEG Image';
    case 'ini':
      return 'Configuration settings';
    default:
      return ext.toLocaleUpperCase() + ' ' + getDataType(ext);
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

export const getDataUrl = (file: File | Blob, cb?: (err: Error, data: string | ArrayBuffer) => void) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    cb(null, reader.result);
  };
  reader.onerror = () => {
    cb(new Error(), null);
  };
  reader.readAsDataURL(file);
}

export const base64ToUtf8 = (data: string): string => {
  return data ? decodeURIComponent(Array.prototype.map.call(atob(data), function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join('')) : data;
}

export const dataUrlToUtf8 = (data: string): string => {
  return base64ToUtf8(data.split('base64,')[1]);
}