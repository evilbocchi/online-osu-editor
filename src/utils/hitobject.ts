export class TimingPoint {

    time = 0;
    bpm = 0;
    isKiai = false;

    constructor(time: number, bpm: number, isKiai: boolean) {
        this.time = time;
        this.bpm = bpm;
        this.isKiai = isKiai;
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