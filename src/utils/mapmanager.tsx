import { path } from "#/utils/filesystem";
import { TimingPoint } from "./hitobject";

export const getRelativePath = (mapFolderDir: string, fileDir: string) => {
    return path.relative(mapFolderDir, fileDir);
}

export const getMapFileName = (mapConfig: any): string => {
    return getArtist(mapConfig) + " - " + getTitle(mapConfig) + " (" + mapConfig.creator + ") [" + mapConfig.difficulty + "].osu";
}

// these are the best helper functions in the world (real)
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

export const getCurrentTP = (mapConfig: any, time: number): TimingPoint => {
    for (var i = 0; i < mapConfig.timingPoints.length; i++) {
        if (mapConfig.timingPoints[i] > time) {
            return mapConfig.timingPoints[i];
        }
    }
}