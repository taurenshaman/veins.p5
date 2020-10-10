"use strict";

// Ref: https://github.com/erdavids/Circle-Shadows/blob/master/Circle_Tutorial.pyde

const CircleShadowsWall = p => {
    // Common
    let w = 1000, h = 1000;
    let bgColor = {
        r: 30,
        g: 30,
        b: 30
    };

    // Circle Size
    const cs = 40;
    const rangesOfColor = [
        {minR: 50, minG: 200, minB: 200},
        {minR: 200, minG: 50, minB: 200},
        {minR: 200, minG: 200, minB: 50}
    ];

    p.randomRange = () =>{
        const index = CommonUtitlity.getRandomInt(rangesOfColor.length);
        return rangesOfColor[index];
    };

    p.setup = () => {
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);
        
        p.background(bgColor.r, bgColor.g, bgColor.b);

        // Take advantage of resolution
        p.pixelDensity(2);

        const count = w * 2;
        const colorRange = p.randomRange();
        for (let c = 0; c < count; c++) {
            let center_x = p.random(w / 10, w - w / 10);
            let center_y = p.random(h / 10, h - h / 10);

            // Draw Shadow
            p.noStroke();
            p.fill(15, 15, 15, 5);
            for (let i = 0; i < 30; i++) {
                p.circle(center_x + 20, center_y + 20, cs - i * 5);
            } // for i
            // Draw Circle
            p.stroke(30, 30, 30);
            p.fill(p.random(colorRange.minR, 255), p.random(colorRange.minG, 255), p.random(colorRange.minB, 255), p.random(150, 255));
            p.circle(center_x, center_y, cs);
        } // for c 
        p.seed = p.int(p.random(10000));
    };
    
    p.updateSettings = (settings: GeneratorSettings) => {
        w = settings.canvasWidth;
        h = settings.canvasHeight;
        if (settings.backgroundRGB)
            bgColor = settings.backgroundRGB;
        p.resizeCanvas(w, h);
    };

};