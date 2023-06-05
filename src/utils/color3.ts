export default class Color3 {
    static fromRGB(r: number, g: number, b: number) {
        function toHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        return new Color3("#" + toHex(r) + toHex(g) + toHex(b));
    }

    hex = "#000000";

    constructor(hex: string) {
        this.hex = hex;
    }

    toRGB(): { r: number, g: number, b: number } {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}