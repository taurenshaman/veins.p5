"use strict";

class P5Utility {
    public static switchStaticOrFrames(p5Obj, isStatic, fps) {
        if (isStatic){
            p5Obj.noLoop();
        }
        else{
            p5Obj.frameRate(fps);
            p5Obj.loop();
        }
    }

    public static placeCanvasTo(p5Obj, renderer, origin, zIndex = 0){
        if(origin){
            renderer.position(0, 0);
        }
        
        renderer.style("z-index", "" + zIndex);
    }

    // public static drawBezierUsingRandomColor(p, x, y, x1, y1, x2, y2, x3, y3, colors, strokeWeight = 2){
    //     const c = CommonUtitlity.getRandomElement(colors);

    //     p.noFill();
    //     p.strokeWeight(strokeWeight);

    //     p.stroke(c.r, c.g, c.b);
    //     p.bezier(x, y, x1, y1, x2, y2, x3, y3);
    // }
}