"use strict";
// Ref: https://github.com/erdavids/Generative-Pebbles/blob/master/Pebbles.pyde

const SquarePebbles = p => {
    // Common
    let w = 1000, h = 1000;

    const square_size = 50;
    let square_count = w * 2 / square_size - 2; // const w = square_size/2 * (square_count + 2);
    let square_rows = h * 2 / square_size - 2; // const h = square_size/2 * (square_rows + 2);

    const ran_rot = .005;
    const ran_mov = .02;

    //let img;

    const colors = [ColorUtility.createRGBColor(127, 199, 175),
        ColorUtility.createRGBColor(218, 216, 167),
        ColorUtility.createRGBColor(167, 219, 216),
        ColorUtility.createRGBColor(237, 118, 112)];

    p.draw = () =>{
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);

        //global img
        //img = createImage(w, h); // (w, h, ARGB)

        p.background(120, 120, 120);
        p.stroke(80, 80, 80);

        // let random_rotate = 0.0;
        // let random_increase = .02;

        //p.translate(square_size, square_size);
        
        for(let i =0; i< square_rows; i++){
            for(let j =0; j< square_count; j++){
                //pushMatrix();
                //p.translate(j*square_size/2 + (i * p.random(-ran_mov, ran_mov)), i*square_size/2 + + (i * p.random(-ran_mov, ran_mov)));
                p.translate(square_size + j*square_size/2 + (i * p.random(-ran_mov, ran_mov)), square_size + i*square_size/2 + + (i * p.random(-ran_mov, ran_mov)));
                const randomIndex = p.int(p.random(colors.length));
                const c = colors[randomIndex];
                p.fill(c.r, c.g, c.b, 255);
                p.rotate(p.random(-i*(ran_rot+i*.003), i*(ran_rot+i*.003)));
                p.rect(-square_size/2, -square_size/2, square_size/2, square_size/2 );
                //popMatrix();
                p.resetMatrix();
            } // for j
        } // for i
    };

    p.updateSettings = (settings: GeneratorSettings) => {
        w = settings.canvasWidth;
        h = settings.canvasHeight;
        
        square_count = (w - square_size) * 2 / square_size - 2;
        square_rows = (h - square_size) * 2 / square_size - 2;

        P5Utility.switchStaticOrFrames(p, settings.isStatic, settings.fps);

        p.resizeCanvas(w, h);
    };

};