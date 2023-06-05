import { path } from "@/utils/filesystem";

export const getRelativePath = (mapFolderDir: string, fileDir: string) => {
    return path.relative(mapFolderDir, fileDir);
}

// these are the best helper functions in the world
export const getArtist = (mapConfig: any): string => {
    return mapConfig.artist == "" ? mapConfig.artistUnicode : mapConfig.artist;
}

export const getArtistUnicode = (mapConfig: any): string => {
    return mapConfig.artistUnicode == "" ? mapConfig.artist : mapConfig.artistUnicode;
}

export const getTitle = (mapConfig: any): string => {
    return mapConfig.title == "" ? mapConfig.titleUnicode : mapConfig.title;
}

export const getTitleUnicode = (mapConfig: any): string => {
    return mapConfig.titleUnicode == "" ? mapConfig.title : mapConfig.titleUnicode;
}