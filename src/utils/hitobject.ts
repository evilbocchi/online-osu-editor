export class TimingPoint {

    time = 0;
    bpm = 0;
    divisor = 4;
    isKiai = false;

    constructor(time: number, bpm: number, isKiai: boolean, divisor?: number) {
        this.time = time;
        this.bpm = bpm;
        this.isKiai = isKiai;
        if (divisor) {
            this.divisor = divisor;
        }
    }
}

export default class HitObject {

}

export function getBPM(timingPoints: TimingPoint[], time: number): number {
    var bpm = 0;
    for (var i = 0; i < timingPoints.length; i++) {
        if (time >= timingPoints[i].time) {
            bpm = timingPoints[i].bpm;
        }
        else {
            return bpm;
        }
    }
    return bpm;
}

export const formatTime = (s: number) => {
    function pad(n: number, z?: number): string {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    return (s > 99 ? s : pad(s)) + ':' + pad(secs) + '.' + pad(ms, 3);
}