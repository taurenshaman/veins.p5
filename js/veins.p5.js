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
    p.updateSettings = (canvasWidth, canvasHeight, isStatic = false, fps = 30) => {
        w = canvasWidth;
        h = canvasHeight;
        if (isStatic) {
            p.setup = () => {
                p.render();
            };
        }
        else {
            p.frameRate(fps);
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
    static createRGBAColor(r, g, b, a) {
        return {
            r: r,
            g: g,
            b: b,
            a: a
        };
    }
    static createRGBColor(r, g, b) {
        return {
            r: r,
            g: g,
            b: b
        };
    }
}
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
class ShapeUtility {
    static createPoint(x, y) {
        return {
            x: x,
            y: y
        };
    }
}
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
const OffsetQuadsWall = p => {
    let w = 1000, h = 1000;
    const colors = [ColorUtility.createRGBAColor(92, 97, 130, 110),
        ColorUtility.createRGBAColor(79, 164, 165, 110),
        ColorUtility.createRGBAColor(202, 166, 122, 110),
        ColorUtility.createRGBAColor(212, 117, 100, 110)
    ];
    const grid_x = 30;
    const grid_y = 30;
    const diff = 6;
    const base_deform = 3;
    const back_deform = 3;
    const offset = 2;
    const horizontal_length = 2;
    let grid_x_pixels = .9 * w;
    let grid_y_pixels = .9 * h;
    let sep_x = grid_x_pixels * 1.0 / (grid_x - 1);
    let sep_y = grid_y_pixels * 1.0 / (grid_y - 1);
    p.get_random_element = (list) => {
        const index = p.int(p.random(list.length));
        return list[index];
    };
    p.draw_rect = (x, y, x_s, y_s, d, r, o, f) => {
        p.stroke(o.r, o.g, o.b, o.a);
        p.fill(f.r, f.g, f.b, f.a);
        p.strokeJoin(p.ROUND);
        p.beginShape();
        p.vertex(x - x_s - p.random(-d, d), y - y_s - p.random(-d, d));
        p.vertex(x + x_s - p.random(-d, d), y - y_s - p.random(-d, d));
        p.vertex(x + x_s - p.random(-d, d), y + y_s - p.random(-d, d));
        p.vertex(x - x_s - p.random(-d, d), y + y_s - p.random(-d, d));
        p.endShape(p.CLOSE);
    };
    p.process_cell_base_deform = (x, y, x_s, y_s, d) => {
        const o = ColorUtility.createRGBAColor(0, 0, 0, 255);
        const f = ColorUtility.createRGBAColor(0, 0, 255, 0);
        p.draw_rect(x, y, x_s, y_s, d, -1, o, f);
    };
    p.process_cell_back_deform = (x, y, x_s, y_s, d) => {
        const o = ColorUtility.createRGBAColor(0, 0, 0, 0);
        const f = p.get_random_element(colors);
        p.draw_rect(x, y, x_s, y_s, d, -1, o, f);
    };
    p.render = () => {
        p.createCanvas(w, h);
        p.pixelDensity(2);
        p.background(255);
        p.strokeWeight(2);
        const grid = [];
        for (let i = 0; i < grid_x; i++) {
            grid.push([]);
            for (let j = 0; j < grid_y; j++) {
                grid[i].push(1);
            }
        }
        for (let i = 0; i < grid_x; i++) {
            for (let j = 0; j < grid_y; j++) {
                if (i < grid_x - 1) {
                    if (p.random(1) < .3 && grid[i][j] === 1) {
                        grid[i][j] = 2;
                        grid[i + 1][j] = 0;
                    }
                }
                if (j < grid_y - 1) {
                    if (p.random(1) < .3 && grid[i][j] === 1 && grid[i][j + 1] !== 0) {
                        grid[i][j] = 3;
                        grid[i][j + 1] = 0;
                    }
                }
                if (i < grid_x - 1 && j < grid_y - 1) {
                    if (p.random(1) < .2 &&
                        grid[i][j] === 1 &&
                        grid[i][j + 1] === 1 &&
                        grid[i + 1][j] === 1 &&
                        grid[i + 1][j + 1] === 1) {
                        grid[i][j] = 4;
                        grid[i + 1][j] = 0;
                        grid[i][j + 1] = 0;
                        grid[i + 1][j + 1] = 0;
                    }
                }
            }
        }
        let current_x = w / 2.0 - grid_x_pixels / 2.0;
        let current_y = h / 2.0 - grid_y_pixels / 2.0;
        for (let i = 0; i < grid_x; i++) {
            for (let j = 0; j < grid_y; j++) {
                let cell = grid[i][j];
                let short_x = sep_x / 2 - diff;
                let long_x = sep_x - diff;
                let short_y = sep_y / 2 - diff;
                let long_y = sep_y - diff;
                let r1 = p.random(-offset, offset);
                let r2 = p.random(-offset, offset);
                if (cell === 1) {
                    p.process_cell_back_deform(current_x + r1, current_y + r2, short_x, short_y, back_deform);
                    p.process_cell_base_deform(current_x, current_y, short_x, short_y, base_deform);
                }
                else if (cell === 2) {
                    p.process_cell_back_deform(current_x + sep_x / 2 + r1, current_y + r2, long_x, short_y, back_deform);
                    p.process_cell_base_deform(current_x + sep_x / 2, current_y, long_x, short_y, base_deform);
                }
                else if (cell === 3) {
                    p.process_cell_back_deform(current_x + r1, current_y + sep_y / 2 + r2, short_x, long_y, back_deform);
                    p.process_cell_base_deform(current_x, current_y + sep_y / 2, short_x, long_y, base_deform);
                }
                else if (cell === 4) {
                    p.process_cell_back_deform(current_x + sep_x / 2 + r1, current_y + sep_y / 2 + r2, long_x, long_y, back_deform);
                    p.process_cell_base_deform(current_x + sep_x / 2, current_y + sep_y / 2, long_x, long_y, base_deform);
                }
                current_y += sep_y;
            }
            current_y = h / 2.0 - grid_y_pixels / 2.0;
            current_x += sep_x;
        }
    };
    p.updateSettings = (canvasWidth, canvasHeight, isStatic = false, fps = 30) => {
        w = canvasWidth;
        h = canvasHeight;
        grid_x_pixels = .9 * w;
        grid_y_pixels = .9 * h;
        sep_x = grid_x_pixels * 1.0 / (grid_x - 1);
        sep_y = grid_y_pixels * 1.0 / (grid_y - 1);
        if (isStatic) {
            p.setup = () => {
                p.render();
            };
        }
        else {
            p.frameRate(fps);
            p.draw = () => {
                p.render();
            };
        }
        p.resizeCanvas(w, h);
    };
};
//# sourceMappingURL=veins.p5.js.map