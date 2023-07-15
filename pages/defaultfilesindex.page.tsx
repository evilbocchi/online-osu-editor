import React from 'react';
import * as fs from "fs";
import * as path from "path";
import "#root/styles/styles.scss";
/**
const walk = function (dir, done) {
    var results: string[] = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

walk("public/defaultuserfiles", (err, results: string[]) => {
    if (err) {
        throw err;
    }
    for (var i = 0; i < results.length; i++) {
        results[i] = path.normalize(results[i].substring(results[i].indexOf("defaultuserfiles")));
    }
    fs.writeFile("public/userfiles.json", JSON.stringify(results), (err) => {
        if (err) throw err;
    });
});
 */

export function Page() {
    return (<></>);
}