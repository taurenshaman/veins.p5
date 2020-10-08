"use strict";

// namespace Veins.Art.Wall {
// }
// Ref: https://github.com/erdavids/Circle-Shadows/blob/master/Circle_Tutorial.pyde

const CircleShadowsWall = p => {
    // Common
    let w = 1000, h = 1000;
    let bgColor = {
        r: 255,
        g: 255,
        b: 255
    };

    // Circle Size
    const cs = 40;


    p.updateSettings = (settings: GeneratorSettings) => {
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

        // Take advantage of resolution
        p.pixelDensity(2);

        const count = w * 2;
        for (let c = 0; c < count; c++) {
            let center_x = p.random(w / 10, w - w / 10);
            let center_y = p.random(h / 10, h - h / 10);

            // Draw Shadow
            p.noStroke();
            p.fill(15, 15, 15, 5);
            for (let i = 0; i < 99; i++) {
                p.circle(center_x + 20, center_y + 20, cs - i * 5);
            } // for i
            // Draw Circle
            p.stroke(30, 30, 30);
            p.fill(p.random(50, 255), p.random(50, 255), p.random(50, 255), p.random(50, 255));
            p.circle(center_x, center_y, cs);
        } // for c 
    };
};