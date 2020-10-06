"use strict";

class P5Utility {
    public static switchStaticOrFrames(p5Obj, isStatic, fps) {
        if (isStatic){
            p5Obj.setup = () =>{
                p5Obj.render();
            };
        }
        else{
            p5Obj.frameRate(fps);
            p5Obj.draw = () =>{
                p5Obj.render();
            };
        }
    }
}