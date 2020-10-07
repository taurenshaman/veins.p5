/// <reference path="./sky/WatercolorClouds.ts" />
/// <reference path="./wall/CircleShadows.ts" />
/// <reference path="./wall/OffsetQuads.ts" />
/// <reference path="./wall/SimulatedCode.ts" />

"use strict";

class GeneratorFactory {
    static readonly Livings: Array<Function> = [];
    static getRandomLiving(){
        return CommonUtitlity.getRandomElement(GeneratorFactory.Livings);
    }

    static readonly Skys: Array<Function> = [WatercolorClouds];
    static getRandomSky(){
        return CommonUtitlity.getRandomElement(GeneratorFactory.Skys);
    }

    static readonly Walls: Array<Function> = [CircleShadowsWall, OffsetQuadsWall, SimulatedCodeWall];
    static getRandomWall(){
        return CommonUtitlity.getRandomElement(GeneratorFactory.Walls);
    }
    
}