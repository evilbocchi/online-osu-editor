import { BFSRequire } from "browserfs";
import { getDataUrl, getFileName } from "#root/utils/file";

export const fs = BFSRequire("fs");
export const path = BFSRequire("path");

export const mkdirs = (dir: string, cb?: (err: Error) => void) => {
    const split = dir.split("/");
    if (split.length > 1) {
        var dirs = [];
        for (var f = 0; f < split.length - 1; f++) {
            dirs[f] = f == 0 ? "/" : split[0];
            for (var o = 0; o <= f; o++) {
                if (o > 0) {
                    dirs[f] = dirs[f] + "/" + split[o];
                }
            }
        }
        for (var f = 0; f < dirs.length; f++) {
            const tomkdir = dirs[f];
            const final = f == dirs.length - 1;
            fs.mkdir(tomkdir, 0o777, () => {
                if (final) {
                    cb(null);
                    return;
                }
            });
        }
    }
}

export const rm = (dir: string, cb?: (err: Error) => void) => {
    fs.stat(dir, (e, stats) => {
        if (e) {
            cb(e);
            return;
        }
        if (stats.isDirectory()) {
            fs.readdir(dir, (e, files) => {
                if (e) {
                    cb(e);
                    return;
                }
                if (files.length == 0) {
                    fs.rmdir(dir, cb);
                    cb(e);
                    return;
                }
                var removed = 0;
                for (var i = 0; i < files.length; i++) {
                    console.log(path.join(dir, files[i]))
                    rm(path.join(dir, files[i]), (e) => {
                        if (e) {
                            cb(e);
                            return;
                        }
                        removed++;
                        if (removed == files.length) {
                            fs.rmdir(dir, cb);
                            return;
                        }
                    });
                }
            })
        }
        else {
            fs.unlink(dir, cb);
            return;
        }
    })
}

export const isEmpty = (dir: string, cb?: (err: Error, isEmpty: boolean) => void) => {
    fs.readdir(dir, function (err, files) {
        if (err) {
            cb(err, false);
        } else {
            cb(err, !files.length);
        }
    });
}

export const download = async (dir: string) => {

    fs.stat(dir, (e, stats) => {
        if (e) {
            throw e;
        }
        if (!stats.isDirectory()) {
            fs.readFile(dir, (e, data) => {
                if (e) { throw e; }
                var a = window.document.createElement('a');
                a.href = data.toString();
                a.download = getFileName(dir);
                a.click();
            });
        }
    });

}

export const fetchResource = (resourceDir: string, cb?: (err: Error, data: string | ArrayBuffer) => void) => {
    fetch(resourceDir).then(res => res.blob()).then(blob => new Promise(() => {
        getDataUrl(blob, (err, data) => {
            cb(err, data);
        });
    }));
}