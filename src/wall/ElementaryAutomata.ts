"use strict";
// Ref: https://github.com/erdavids/Elementary-Automata/blob/master/elementary.py

const ElementaryAutomata = p => {
    // Common
    let w = 1000, h = 1000;

    const rules = [
        MathUtility.createMatrixItem(1, 1, 1, 0),
        MathUtility.createMatrixItem(1, 1, 0, 1),
        MathUtility.createMatrixItem(1, 0, 1, 0),
        MathUtility.createMatrixItem(1, 0, 0, 0),
        MathUtility.createMatrixItem(0, 1, 1, 1),
        MathUtility.createMatrixItem(0, 1, 0, 0),
        MathUtility.createMatrixItem(0, 0, 1, 0),
        MathUtility.createMatrixItem(0, 0, 0, 1)
    ];

    let pallete1 = [
        ColorUtility.createRGBColor(112, 181, 171),
        ColorUtility.createRGBColor(220, 109, 71),
        ColorUtility.createRGBColor(240, 204, 170)
    ];

    let pallete2 = [
        ColorUtility.createRGBColor(106, 154, 172),
        ColorUtility.createRGBColor(146, 189, 144),
        ColorUtility.createRGBColor(130, 179, 176)
    ];

    let backgrounds = [
        ColorUtility.createRGBColor(243, 236, 205), // flesh like color
        ColorUtility.createRGBColor(50, 50, 50)
    ];

    p.getRule = (x, y, z) => {
        let index = _.findIndex(rules, r => {
            return r.x === x && r.y === y && r.z === z;
        });
        return rules[index];
    };

    p.draw_circle_fill = (x, y, radius, r, g, b) => {
        p.stroke(r, g, b);
        p.fill(r, g, b);
        // cr.arc(x, y, radius, 0, 2*math.pi)
        const wh = radius;// * 2;
        p.arc(x, y, wh, wh, 0, 2 * p.PI);
    };

    // p.draw_bezier = (x, y, x1, y1, x2, y2, x3, y3) => {
    //     P5Utility.drawBezierUsingRandomColor(p, x, y, x1, y1, x2, y2, x3, y3, pallete1, 2);
    // };

    p.getRandomInt1Bit = () => {
        // https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/
        let data = [1, 2, 4, 8];
        let index = p.int(p.random(data.length));
        //return data[index];
        return p.int(p.random(2));
    };

    p.draw = () => {
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);

        let number_beziers = 200;
        let circle_size = 5;
        let x_d = w / number_beziers;
        let y_d = x_d;

        p.background(backgrounds[1].r, backgrounds[1].g, backgrounds[1].b);
        let current_row = [];
        for (let i = 0; i < number_beziers; i++) {
            // current_row.append(int(random.getrandbits(1)))
            current_row.push(p.getRandomInt1Bit());
        } // for i
        // next_row = copy.deepcopy(current_row)
        let next_row = [];
        _.forEach(current_row, item => {
            next_row.push(item);
        });
        // for k in range(y_d, height, y_d)
        for (let k = y_d; k < h; k += y_d) {
            // Determine the next row state by comparing rules
            for (let j = 0; j < current_row.length - 2; j++) {
                // next_row[j+1] = rules[(current_row[j], current_row[j+1], current_row[j+2])]
                let r = p.getRule(current_row[j], current_row[j + 1], current_row[j + 2]);
                next_row[j + 1] = r.value;
            } // for j
            // next_row[0] = rules[(current_row[len(current_row)-1], current_row[0], current_row[1])]
            // next_row[len(next_row)-1] = rules[(current_row[len(current_row)-2], current_row[len(current_row)-1], current_row[0])]
            let r0 = p.getRule(current_row[current_row.length - 1], current_row[0], current_row[1]);
            next_row[0] = r0.value;
            let r1 = p.getRule(current_row[current_row.length - 2], current_row[current_row.length - 1], current_row[0]);
            next_row[next_row.length - 1] = r1.value;

            // Iterate through and draw the circles
            for (let i = 1; i < next_row.length; i++) {
                if (next_row[i] === 1) {
                    const c = CommonUtitlity.getRandomElement(pallete1);
                    p.draw_circle_fill(i * x_d, k, circle_size, c.r, c.g, c.b);
                } // if
            } // for i
            // current_row = copy.deepcopy(next_row)
            for (let m = 0; m < next_row.length; m++) {
                current_row[m] = next_row[m];
            } // for m
        } // for k
    };

    p.updateSettings = (settings: GeneratorSettings) => {
        w = settings.canvasWidth;
        h = settings.canvasHeight;

        P5Utility.switchStaticOrFrames(p, settings.isStatic, settings.fps);

        p.resizeCanvas(w, h);
    };

};