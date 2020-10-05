"use strict";
// Ref: https://github.com/erdavids/WatercolorClouds/blob/master/Watercolor.py

const WatercolorClouds = p => {
    // Common
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
                let x = (shape[j - 1].x + shape[j].x) / 2 + p.random(-variance, variance),
                    y = (shape[j - 1].y + shape[j].y) / 2 + p.random(-variance, variance);
                let midpoint = ShapeUtility.createPoint(x, y);
                //shape.insert(j, midpoint)
                shape.splice(j, 0, midpoint);
            } // for j
        } // for i
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
        // cr.set_source_rgb(.9, .9, .9) cr.rectangle(0, 0, width, height)  cr.fill()
        // fill(.9, .9, .9);
        // rect(0, 0, width, height);
        //background(.9, .9, .9);

        p.strokeWeight(1);
        let start = -p.int(p.height * .2),
            end = p.int(p.height * 1.2);
        for (let i = start; i < end; i += 60) {
            const rindex = p.int(p.random(colors.length)),
                gindex = p.int(p.random(colors.length)),
                bindex = p.int(p.random(colors.length));
            const source_rgba = {
                r: colors[rindex].r,
                g: colors[gindex].g,
                b: colors[bindex].b,
                a: shapealpha
            };
            // (random.choice(colors)[0], random.choice(colors)[1], random.choice(colors)[2], shapealpha)
            const src_rgba = ColorUtility.toRGBAPercentageString(source_rgba.r * 100, source_rgba.g * 100, source_rgba.b * 100, shapealpha);

            let shape = p.octagon(p.random(-100, w + 100), i, p.random(100, 300));
            let baseshape = p.deform(shape, basedeforms, initial);
            const jmax = p.int(p.random(minshapes, maxshapes));
            for (let j = 0; j < jmax; j++) {
                //let tempshape = _.cloneDeep(baseshape);
                let tempshape = [];
                _.forEach(baseshape, oi => {
                    tempshape.push({
                        x: oi.x,
                        y: oi.y
                    });
                });

                let layer = p.deform(tempshape, finaldeforms, deviation);

                // cr.set_source_rgba(random.choice(colors)[0], random.choice(colors)[1], random.choice(colors)[2], shapealpha)
                p.stroke(src_rgba);
                p.fill(src_rgba);
                p.beginShape();
                for (let k = 0; k < layer.length; k++) {
                    p.vertex(layer[k].x, layer[k].y);
                } // for k
                p.endShape(p.CLOSE);
            } // for j
        } // for i
    };

    p.updateSettings = (canvasWidth, canvasHeight, isStatic = false) => {
        w = canvasWidth;
        h = canvasHeight;
        if (isStatic){
            p.setup = () =>{
                p.render();
            };
        }
        else{
            p.draw = () =>{
                p.render();
            };
        }
        p.resizeCanvas(w, h);
    };

};