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
}