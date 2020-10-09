"use strict";
// Ref: https://github.com/erdavids/Simulated-Code/blob/master/Code_Art.pyde

const SimulatedCodeWall = p => {
    // Common
    let w = 1000, h = 1000;

    // Where the code starts and ends
    let code_start = h / 60;
    let code_end = h - h / 100;

    // Code Line Thickness
    let code_size = 10;

    // Code Segments (Number and length)
    let min_segments = 5;
    let max_segments = 16;
    let min_segment_length = 5;
    let max_segment_length = 60;
    let segment_sep = 20;

    // Lines of code
    let code_lines = 60;
    let code_sep = (code_end - code_start) / code_lines;
    let line_break_chance = .4;

    // Indent values
    let indent_size = 50;
    let max_indents = 6;
    let indent_inc_chance = .4;
    let indent_dec_chance = .3;

    // Random Colors
    let random_colors = false;

    // Higher value means the color will change more often
    let change_chance = .4;

    // If you want to use your own color palette, just set random colors to false
    //colors = [(127, 199, 175), (218, 216, 167), (167, 219, 216), (237, 118, 112)]
    let colors = [ColorUtility.createRGBColor(92, 97, 130),
    ColorUtility.createRGBColor(79, 164, 165),
    ColorUtility.createRGBColor(202, 166, 122),
    ColorUtility.createRGBColor(212, 117, 100)];

    // Background Color
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
        // Take advantage of resolution
        p.pixelDensity(2);

        // Setting the size and background
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);
        p.background(bc.r, bc.g, bc.b);

        // Type of lines and size
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
                } // for j
                if (p.random(1) < indent_inc_chance && indent < max_indents)
                    indent += 1;
                else if (p.random(1) < indent_dec_chance && indent > 0) {
                    indent -= p.int(p.random(1, max_indents));
                    if (indent < 0)
                        indent = 0;
                }
            } // if check
        } // for i
        p.seed = p.int(p.random(10000))
    };

    p.updateSettings = (settings: GeneratorSettings) => {
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