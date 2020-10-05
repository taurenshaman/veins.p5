"use strict";
const WatercolorClouds = p => {
    let w = 1000, h = 1000;
    const colors = [];
    p.octagon = (x_orig, y_orig, side) => {
        let x = x_orig;
        let y = y_orig;
        let d = side / p.sqrt(2);
        let oct = [];
        oct.push(ShapeUtility.createPoint(x, y));
        x += side;
        oct.push(ShapeUtility.createPoint(x, y));
        x += d;
        y += d;
        oct.push(ShapeUtility.createPoint(x, y));
        y += side;
        oct.push(ShapeUtility.createPoint(x, y));
        x -= d;
        y += d;
        oct.push(ShapeUtility.createPoint(x, y));
        x -= side;
        oct.push(ShapeUtility.createPoint(x, y));
        x -= d;
        y -= d;
        oct.push(ShapeUtility.createPoint(x, y));
        y -= side;
        oct.push(ShapeUtility.createPoint(x, y));
        x += d;
        y -= d;
        oct.push(ShapeUtility.createPoint(x, y));
        return oct;
    };
    p.deform = (shape, iterations, variance) => {
        for (let i = 0; i < iterations; i++) {
            for (let j = shape.length - 1; j > 0; j--) {
                let x = (shape[j - 1].x + shape[j].x) / 2 + p.random(-variance, variance), y = (shape[j - 1].y + shape[j].y) / 2 + p.random(-variance, variance);
                let midpoint = ShapeUtility.createPoint(x, y);
                shape.splice(j, 0, midpoint);
            }
        }
        return shape;
    };
    p.render = () => {
        const initial = 120;
        const deviation = 50;
        const basedeforms = 1, finaldeforms = 3;
        const minshapes = 20, maxshapes = 25;
        const shapealpha = 0.02;
        ColorUtility.generateColors(p, colors, 0.4, 0.75, 15);
        p.createCanvas(w, h);
        p.strokeWeight(1);
        let start = -p.int(p.height * .2), end = p.int(p.height * 1.2);
        for (let i = start; i < end; i += 60) {
            const rindex = p.int(p.random(colors.length)), gindex = p.int(p.random(colors.length)), bindex = p.int(p.random(colors.length));
            const source_rgba = {
                r: colors[rindex].r,
                g: colors[gindex].g,
                b: colors[bindex].b,
                a: shapealpha
            };
            const src_rgba = ColorUtility.toRGBAPercentageString(source_rgba.r * 100, source_rgba.g * 100, source_rgba.b * 100, shapealpha);
            let shape = p.octagon(p.random(-100, w + 100), i, p.random(100, 300));
            let baseshape = p.deform(shape, basedeforms, initial);
            const jmax = p.int(p.random(minshapes, maxshapes));
            for (let j = 0; j < jmax; j++) {
                let tempshape = [];
                _.forEach(baseshape, oi => {
                    tempshape.push({
                        x: oi.x,
                        y: oi.y
                    });
                });
                let layer = p.deform(tempshape, finaldeforms, deviation);
                p.stroke(src_rgba);
                p.fill(src_rgba);
                p.beginShape();
                for (let k = 0; k < layer.length; k++) {
                    p.vertex(layer[k].x, layer[k].y);
                }
                p.endShape(p.CLOSE);
            }
        }
    };
    p.updateSettings = (canvasWidth, canvasHeight, isStatic = false) => {
        w = canvasWidth;
        h = canvasHeight;
        if (isStatic) {
            p.setup = () => {
                p.render();
            };
        }
        else {
            p.draw = () => {
                p.render();
            };
        }
        p.resizeCanvas(w, h);
    };
};
class ColorUtility {
    static generateRGBColor(p5Instance, min, max) {
        return {
            r: p5Instance.random(min, max),
            g: p5Instance.random(min, max),
            b: p5Instance.random(min, max),
        };
    }
    static generateColors(p5Instance, colors, min, max, count) {
        for (let i = 0; i < count; i++) {
            const c = ColorUtility.generateRGBColor(p5Instance, min, max);
            colors.push(c);
        }
    }
    static toRGBAPercentageString(r, g, b, a) {
        return "rgba(" + r + "%," + g + "%," + b + "%," + a + ")";
    }
}
var Veins;
(function (Veins) {
    var Art;
    (function (Art) {
        var Tools;
        (function (Tools) {
            class CommonUtitlity {
                static ComputeHash(str) {
                    var hash = 0;
                    if (str.length === 0) {
                        return hash;
                    }
                    for (var i = 0; i < str.length; i++) {
                        var char = str.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash;
                    }
                    return hash;
                }
            }
            Tools.CommonUtitlity = CommonUtitlity;
        })(Tools = Art.Tools || (Art.Tools = {}));
    })(Art = Veins.Art || (Veins.Art = {}));
})(Veins || (Veins = {}));
class ShapeUtility {
    static createPoint(x, y) {
        return {
            x: x,
            y: y
        };
    }
}
var Veins;
(function (Veins) {
    var Art;
    (function (Art) {
        var Tools;
        (function (Tools) {
            class StringUtility {
                static EscapeSpecialChars(str) {
                    return str.replace(/\\n/g, "\\n")
                        .replace(/\\'/g, "\\'")
                        .replace(/\\"/g, '\\"')
                        .replace(/\\&/g, "\\&")
                        .replace(/\\r/g, "\\r")
                        .replace(/\\t/g, "\\t")
                        .replace(/\\b/g, "\\b")
                        .replace(/\\f/g, "\\f");
                }
            }
            Tools.StringUtility = StringUtility;
        })(Tools = Art.Tools || (Art.Tools = {}));
    })(Art = Veins.Art || (Veins.Art = {}));
})(Veins || (Veins = {}));
const CircleShadowsWall = p => {
    let w = 1000, h = 1000;
    let bgColor = {
        r: 255,
        g: 255,
        b: 255
    };
    const cs = 40;
    p.updateSettings = (canvasWidth, canvasHeight, bgRGB) => {
        w = canvasWidth;
        h = canvasHeight;
        if (bgRGB)
            bgColor = bgRGB;
        p.resizeCanvas(w, h);
    };
    p.setup = () => {
        p.createCanvas(w, h);
        p.background(bgColor.r, bgColor.g, bgColor.b);
        p.pixelDensity(2);
        const count = w * 2;
        for (let c = 0; c < count; c++) {
            let center_x = p.random(w / 10, w - w / 10);
            let center_y = p.random(h / 10, h - h / 10);
            p.noStroke();
            p.fill(15, 15, 15, 5);
            for (let i = 0; i < 99; i++) {
                p.circle(center_x + 20, center_y + 20, cs - i * 5);
            }
            p.stroke(30, 30, 30);
            p.fill(p.random(50, 255), p.random(50, 255), p.random(50, 255), p.random(50, 255));
            p.circle(center_x, center_y, cs);
        }
    };
};
//# sourceMappingURL=veins.p5.js.map