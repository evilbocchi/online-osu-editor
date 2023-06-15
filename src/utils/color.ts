export const luminanceCoefficients = [.2126, .7152, .0722];

export function colorCodeToRGB(colorCode) {
    colorCode = colorCode.substr(1);
    return [
        colorCode.substr(0, 2),
        colorCode.substr(2, 2),
        colorCode.substr(4, 2)
    ].map(it => parseInt(it, 16));
}

export function getLuminance(color) {
    var cv=colorCodeToRGB(color).map(v=>linearizeSRGB(v))
    return cv[0]*luminanceCoefficients[0]+
              cv[1]*luminanceCoefficients[1]+
              cv[2]*luminanceCoefficients[2]
  }

export function linearizeSRGB(colorChannel) {
    colorChannel /= 255;
    if (colorChannel <= .04045 ) {
        return colorChannel / 12.92;
    } else {
        return Math.pow((colorChannel + .055)/1.055, 2.4);
    }
}