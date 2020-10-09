"use strict";

class ShapeUtility {
    public static createPoint(x, y) {
        return {
            x: x,
            y: y
        };
    }

    public static createCircle(size, posX = 0, posY = 0){
        return {
          size: size,
          position: {
            x: posX,
            y: posY
          }
        };
      }
}