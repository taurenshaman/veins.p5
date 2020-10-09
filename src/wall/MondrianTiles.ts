"use strict";
// Ref: https://github.com/erdavids/Mondrian-Tiles/blob/master/Mondrian_Tiles.pyde

const MondrianTiles = p => {
    // Common
    let w = 1000, h = 1000;

    const subdivisions = 50000;

    // Not too small
    const min_diff = 80;

    // Space between quads
    const sep = 1;

    // Piet Mondrian Color Palette
    const colors = [ColorUtility.createRGBColor(38, 71, 124),
    ColorUtility.createRGBColor(240, 217, 92),
    ColorUtility.createRGBColor(162, 45, 40),
    ColorUtility.createRGBColor(223, 224, 236),
    ColorUtility.createRGBColor(223, 224, 236),
    ColorUtility.createRGBColor(223, 224, 236),
    ColorUtility.createRGBColor(223, 224, 236),
    ColorUtility.createRGBColor(223, 224, 236)];

    // Subdivision adjustment
    const splits = [.5, 1, 1.5];

    // Canvas Border
    const edge = 10;

    p.draw = () => {
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);

        p.pixelDensity(2);
        p.background(255);
        const quads = [];
        // Add the initial rectangle: LeftBottom, RightBottom, RightTop, LeftTop
        //quads.append([(edge, edge), (w - edge, edge), (w - edge, h - edge), (edge, h - edge)]);
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
                    // Get new shapes x value (y is same)
                    let x_split = (q_rx - q_lx) / 2 * s + q_lx;
                    //quads.pop(q_index);
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
                    //quads.pop(q_index);
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
        } // for
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

    p.updateSettings = (settings: GeneratorSettings) => {
        w = settings.canvasWidth;
        h = settings.canvasHeight;

        P5Utility.switchStaticOrFrames(p, settings.isStatic, settings.fps);

        p.resizeCanvas(w, h);
    };

};