"use strict";

class ColorUtility {
    /**
     * return {r: random(min, max), g: ..., b: ...}
     * @param p5Instance 
     * @param min 
     * @param max 
     */
    public static generateRGBColor(p5Instance, min, max) {
        return {
            r: p5Instance.random(min, max),
            g: p5Instance.random(min, max),
            b: p5Instance.random(min, max),
        };
    }

    public static generateColors(p5Instance, colors, min, max, count) {
        for (let i = 0; i < count; i++) {
            const c = ColorUtility.generateRGBColor(p5Instance, min, max);
            colors.push(c);
        }
    }

    /**
     * return string like 'rgba(0%, 0%, 100%, 1)'
     * @param r 0-100
     * @param g 0-100
     * @param b 0-100
     * @param a 0-1
     */
    public static toRGBAPercentageString(r, g, b, a){
        return "rgba(" + r + "%," + g + "%," + b + "%," + a + ")";
    }

}