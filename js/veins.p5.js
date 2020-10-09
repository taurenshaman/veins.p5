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
    p.draw = () => {
        const initial = 120;
        const deviation = 50;
        const basedeforms = 1, finaldeforms = 3;
        const minshapes = 20, maxshapes = 25;
        const shapealpha = 0.02;
        ColorUtility.generateColors(p, colors, 0.4, 0.75, 15);
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);
        p.background(.9, .9, .9);
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
    p.updateSettings = (settings) => {
        w = settings.canvasWidth;
        h = settings.canvasHeight;
        P5Utility.switchStaticOrFrames(p, settings.isStatic, settings.fps);
        p.resizeCanvas(w, h);
    };
};
const CirclePacking = p => {
    let w = 1000, h = 1000;
    let circles = [];
    let gridless = [];
    const grid_width = 30;
    const grid_height = 30;
    let cell_width = w * 1.0 / grid_width;
    let cell_height = h * 1.0 / grid_height;
    const color_palette = [ColorUtility.createRGBColor(229, 115, 118),
        ColorUtility.createRGBColor(235, 167, 114),
        ColorUtility.createRGBColor(114, 178, 241),
        ColorUtility.createRGBColor(211, 173, 223),
        ColorUtility.createRGBColor(170, 198, 166)];
    p.set_palette_color = () => {
        const index = p.int(p.random(color_palette.length));
        const c = color_palette[index];
        p.fill(c.r, c.g, c.b);
    };
    p.get_grid_position = (x, y) => {
        return p.int(x / cell_width) + p.int(y / cell_height) * grid_width;
    };
    p.get_grid_position_of_circle = (circle) => {
        let x = circle.position.x;
        let y = circle.position.y;
        return p.get_grid_position(x, y);
    };
    p.getDistance = (x1, y1, x2, y2) => {
        const pow_sum = Math.pow(y1 - y2, 2) + Math.pow(x1 - x2, 2);
        return Math.sqrt(pow_sum);
    };
    p.add_gridless = (circle) => {
        for (let i = 0; i < 20; i++) {
            circle.position = {
                x: p.random(w),
                y: p.random(h)
            };
            let valid = true;
            _.forEach(gridless, c => {
                let distance = p.getDistance(c.position.x, c.position.y, circle.position.x, circle.position.y);
                if (distance < (c.size / 2 + circle.size / 2 + 2)) {
                    valid = false;
                }
            });
            if (circle.position.x + circle.size / 2 > w || circle.position.x - circle.size / 2 < 0 || circle.position.y + circle.size / 2 > h || circle.position.y - circle.size / 2 < 0) {
                valid = false;
            }
            if (valid) {
                gridless.push(circle);
                p.display(circle);
                break;
            }
        }
    };
    p.place_manually = (circle, position) => {
        circle.position = position;
        gridless.push(circle);
        p.display(circle);
    };
    p.find_valid_position = (circle) => {
        for (let i = 0; i < 20; i++) {
            circle.position = {
                x: p.random(w),
                y: p.random(h)
            };
            let circle_pos = p.get_grid_position_of_circle(circle);
            let grid_position = p.int(circle_pos);
            let compare_list = [];
            _.forEach(gridless, c => {
                compare_list.push(c);
            });
            _.forEach(circles[grid_position], c => {
                compare_list.push(c);
            });
            if (grid_position % grid_width > 0) {
                _.forEach(circles[grid_position - 1], c => {
                    compare_list.push(c);
                });
            }
            if (grid_position % grid_width < grid_width - 1) {
                _.forEach(circles[grid_position + 1], c => {
                    compare_list.push(c);
                });
            }
            if (grid_position >= grid_width) {
                _.forEach(circles[grid_position - grid_width], c => {
                    compare_list.push(c);
                });
            }
            if (grid_position < (grid_width * grid_height) - grid_width) {
                _.forEach(circles[grid_position + grid_width], c => {
                    compare_list.push(c);
                });
            }
            if (grid_position % grid_width > 0 && grid_position > grid_width) {
                _.forEach(circles[grid_position - grid_width - 1], c => {
                    compare_list.push(c);
                });
            }
            if (grid_position % grid_width > 0 && grid_position < (grid_width * grid_height) - grid_width) {
                _.forEach(circles[grid_position + grid_width - 1], c => {
                    compare_list.push(c);
                });
            }
            if (grid_position % grid_width < grid_width - 1 && grid_position > grid_width) {
                _.forEach(circles[grid_position - grid_width + 1], c => {
                    compare_list.push(c);
                });
            }
            if (grid_position % grid_width < grid_width - 1 && grid_position < (grid_width * grid_height) - grid_width) {
                _.forEach(circles[grid_position + grid_width + 1], c => {
                    compare_list.push(c);
                });
            }
            let valid = true;
            _.forEach(compare_list, c => {
                let distance = p.getDistance(c.position.x, c.position.y, circle.position.x, circle.position.y);
                if (distance < (c.size / 2 + circle.size / 2 + 1)) {
                    valid = false;
                }
            });
            if (circle.position.x + circle.size / 2 > w || circle.position.x - circle.size / 2 < 0 || circle.position.y + circle.size / 2 > h || circle.position.y - circle.size / 2 < 0) {
                valid = false;
            }
            if (valid) {
                circles[grid_position].push(circle);
                p.display(circle);
                break;
            }
        }
    };
    p.display = (cir) => {
        const color = color_palette[p.int(p.random(color_palette.length))];
        p.fill(color.r, color.g, color.b);
        p.circle(cir.position.x, cir.position.y, cir.size);
    };
    p.draw = () => {
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);
        p.pixelDensity(2);
        p.background(30, 30, 30);
        p.noStroke();
        circles = [];
        gridless = [];
        const max = grid_width * grid_height;
        for (let i = 0; i < max; i++) {
            circles.push([]);
        }
        for (let i = 0; i < 20; i++) {
            let c = ShapeUtility.createCircle(75);
            p.add_gridless(c);
        }
        for (let i = 0; i < 50; i++) {
            let c = ShapeUtility.createCircle(50);
            p.add_gridless(c);
        }
        for (let i = 0; i < 800; i++) {
            let c = ShapeUtility.createCircle(20);
            p.find_valid_position(c);
        }
        for (let i = 0; i < 4000; i++) {
            let c = ShapeUtility.createCircle(3);
            p.find_valid_position(c);
        }
    };
    p.updateSettings = (settings) => {
        w = settings.canvasWidth;
        h = settings.canvasHeight;
        cell_width = w * 1.0 / grid_width;
        cell_height = h * 1.0 / grid_height;
        P5Utility.switchStaticOrFrames(p, settings.isStatic, settings.fps);
        p.resizeCanvas(w, h);
    };
};
const CircleShadowsWall = p => {
    let w = 1000, h = 1000;
    let bgColor = {
        r: 255,
        g: 255,
        b: 255
    };
    const cs = 40;
    p.updateSettings = (settings) => {
        w = settings.canvasWidth;
        h = settings.canvasHeight;
        if (settings.backgroundRGB)
            bgColor = settings.backgroundRGB;
        p.resizeCanvas(w, h);
    };
    p.setup = () => {
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);
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
    p.draw = () => {
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);
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
    p.updateSettings = (settings) => {
        w = settings.canvasWidth;
        h = settings.canvasHeight;
        grid_x_pixels = .9 * w;
        grid_y_pixels = .9 * h;
        sep_x = grid_x_pixels * 1.0 / (grid_x - 1);
        sep_y = grid_y_pixels * 1.0 / (grid_y - 1);
        P5Utility.switchStaticOrFrames(p, settings.isStatic, settings.fps);
        p.resizeCanvas(w, h);
    };
};
const SimulatedCodeWall = p => {
    let w = 1000, h = 1000;
    let code_start = h / 60;
    let code_end = h - h / 100;
    let code_size = 10;
    let min_segments = 5;
    let max_segments = 16;
    let min_segment_length = 5;
    let max_segment_length = 60;
    let segment_sep = 20;
    let code_lines = 60;
    let code_sep = (code_end - code_start) / code_lines;
    let line_break_chance = .4;
    let indent_size = 50;
    let max_indents = 6;
    let indent_inc_chance = .4;
    let indent_dec_chance = .3;
    let random_colors = false;
    let change_chance = .4;
    let colors = [ColorUtility.createRGBColor(92, 97, 130),
        ColorUtility.createRGBColor(79, 164, 165),
        ColorUtility.createRGBColor(202, 166, 122),
        ColorUtility.createRGBColor(212, 117, 100)];
    let bc = ColorUtility.createRGBColor(30, 30, 30);
    p.set_random_color = () => {
        const c = ColorUtility.createRGBColor(p.random(50, 200), p.random(50, 200), p.random(50, 200));
        p.stroke(c);
    };
    p.set_palette_color = () => {
        const c = colors[p.int(p.random(colors.length))];
        p.stroke(c.r, c.g, c.b);
    };
    p.draw = () => {
        p.pixelDensity(2);
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);
        p.background(bc.r, bc.g, bc.b);
        p.strokeCap(p.ROUND);
        p.strokeWeight(code_size);
        if (random_colors)
            p.set_random_color();
        else
            p.set_palette_color();
        let line_y = code_start;
        let indent = 0;
        for (let i = 0; i < code_lines; i++) {
            line_y += code_sep;
            let check = p.random(1) < line_break_chance && indent === 0;
            if (!check) {
                let line_x = indent_size + (indent * indent_size);
                let line_segments = p.int(p.random(min_segments, max_segments));
                for (let j = 0; j < line_segments; j++) {
                    if (p.random(1) < change_chance)
                        p.set_palette_color();
                    let segment_length = p.random(min_segment_length, max_segment_length);
                    p.line(line_x, line_y, line_x + segment_length, line_y);
                    line_x = line_x + segment_length + segment_sep;
                }
                if (p.random(1) < indent_inc_chance && indent < max_indents)
                    indent += 1;
                else if (p.random(1) < indent_dec_chance && indent > 0) {
                    indent -= p.int(p.random(1, max_indents));
                    if (indent < 0)
                        indent = 0;
                }
            }
        }
        p.seed = p.int(p.random(10000));
    };
    p.updateSettings = (settings) => {
        w = settings.canvasWidth;
        h = settings.canvasHeight;
        code_start = h / 60;
        code_end = h - h / 100;
        code_sep = (code_end - code_start) / code_lines;
        random_colors = settings.randomColors;
        P5Utility.switchStaticOrFrames(p, settings.isStatic, settings.fps);
        p.resizeCanvas(w, h);
    };
};
class GeneratorFactory {
    static getRandomBackground() {
        return CommonUtitlity.getRandomElement(GeneratorFactory.Backgrounds);
    }
}
GeneratorFactory.Backgrounds = [WatercolorClouds,
    CirclePacking, OffsetQuadsWall, SimulatedCodeWall];
class GeneratorSettings {
    constructor() {
        this.canvasWidth = 1000;
        this.canvasHeight = 1000;
        this.isStatic = false;
        this.fps = 30;
        this.randomColors = false;
    }
}
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
    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    static getRandomElement(list) {
        const index = CommonUtitlity.getRandomInt(list.length - 1);
        return list[index];
    }
}
class P5Utility {
    static switchStaticOrFrames(p5Obj, isStatic, fps) {
        if (isStatic) {
            p5Obj.noLoop();
        }
        else {
            p5Obj.frameRate(fps);
            p5Obj.loop();
        }
    }
    static placeCanvasTo(p5Obj, renderer, origin, zIndex = 0) {
        if (origin) {
            renderer.position(0, 0);
        }
        renderer.style("z-index", "" + zIndex);
    }
}
class ShapeUtility {
    static createPoint(x, y) {
        return {
            x: x,
            y: y
        };
    }
    static createCircle(size, posX = 0, posY = 0) {
        return {
            size: size,
            position: {
                x: posX,
                y: posY
            }
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
const MondrianTiles = p => {
    let w = 1000, h = 1000;
    const subdivisions = 50000;
    const min_diff = 80;
    const sep = 1;
    const colors = [ColorUtility.createRGBColor(38, 71, 124),
        ColorUtility.createRGBColor(240, 217, 92),
        ColorUtility.createRGBColor(162, 45, 40),
        ColorUtility.createRGBColor(223, 224, 236),
        ColorUtility.createRGBColor(223, 224, 236),
        ColorUtility.createRGBColor(223, 224, 236),
        ColorUtility.createRGBColor(223, 224, 236),
        ColorUtility.createRGBColor(223, 224, 236)];
    const splits = [.5, 1, 1.5];
    const edge = 10;
    p.draw = () => {
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);
        p.pixelDensity(2);
        p.background(255);
        const quads = [];
        p.append(quads, [
            ShapeUtility.createPoint(edge, edge),
            ShapeUtility.createPoint(w - edge, edge),
            ShapeUtility.createPoint(w - edge, h - edge),
            ShapeUtility.createPoint(edge, h - edge)
        ]);
        for (let i = 0; i < subdivisions; i++) {
            let q_index = p.int(p.random(quads.length));
            let q = quads[q_index];
            let q_lx = q[0].x;
            let q_rx = q[1].x;
            let q_ty = q[0].y;
            let q_by = q[2].y;
            let s = splits[p.int(p.random(splits.length))];
            if (p.random(1) < .5) {
                if ((q_rx - q_lx) > min_diff) {
                    let x_split = (q_rx - q_lx) / 2 * s + q_lx;
                    _.pullAt(quads, [q_index]);
                    p.append(quads, [ShapeUtility.createPoint(q_lx, q_ty),
                        ShapeUtility.createPoint(x_split - sep, q_ty),
                        ShapeUtility.createPoint(x_split - sep, q_by),
                        ShapeUtility.createPoint(q_lx, q_by)]);
                    p.append(quads, [ShapeUtility.createPoint(x_split + sep, q_ty),
                        ShapeUtility.createPoint(q_rx, q_ty),
                        ShapeUtility.createPoint(q_rx, q_by),
                        ShapeUtility.createPoint(x_split + sep, q_by)]);
                }
            }
            else {
                if ((q_by - q_ty) > min_diff) {
                    let y_split = (q_by - q_ty) / 2 * s + q_ty;
                    _.pullAt(quads, [q_index]);
                    p.append(quads, [ShapeUtility.createPoint(q_lx, q_ty),
                        ShapeUtility.createPoint(q_rx, q_ty),
                        ShapeUtility.createPoint(q_rx, y_split - sep),
                        ShapeUtility.createPoint(q_lx, y_split - sep)]);
                    p.append(quads, [ShapeUtility.createPoint(q_lx, y_split + sep),
                        ShapeUtility.createPoint(q_rx, y_split + sep),
                        ShapeUtility.createPoint(q_rx, q_by),
                        ShapeUtility.createPoint(q_lx, q_by)]);
                }
            }
        }
        p.stroke(0);
        p.strokeWeight(2);
        _.forEach(quads, q => {
            const color = colors[p.int(p.random(colors.length))];
            p.fill(color.r, color.g, color.b);
            p.beginShape();
            _.forEach(q, pi => {
                p.vertex(pi.x, pi.y);
            });
            p.endShape(p.CLOSE);
        });
    };
    p.updateSettings = (settings) => {
        w = settings.canvasWidth;
        h = settings.canvasHeight;
        P5Utility.switchStaticOrFrames(p, settings.isStatic, settings.fps);
        p.resizeCanvas(w, h);
    };
};
//# sourceMappingURL=veins.p5.js.map