/// <reference path="./living/ErdavidsTree.ts" />
/// <reference path="./sky/WatercolorClouds.ts" />
/// <reference path="./wall/CirclePacking.ts" />
/// <reference path="./wall/CircleShadows.ts" />
/// <reference path="./wall/ElementaryAutomata.ts" />
/// <reference path="./wall/MondrianTiles.ts" />
/// <reference path="./wall/OffsetQuads.ts" />
/// <reference path="./wall/SimulatedCode.ts" />
/// <reference path="./wall/SquarePebbles.ts" />

"use strict";

class GeneratorFactory {
    // static readonly Livings: Array<Function> = [ErdavidsTree];
    // static getRandomLiving(){
    //     return CommonUtitlity.getRandomElement(GeneratorFactory.Livings);
    // }

    // static readonly Skys: Array<Function> = [WatercolorClouds];
    // static getRandomSky(){
    //     return CommonUtitlity.getRandomElement(GeneratorFactory.Skys);
    // }

    // static readonly Walls: Array<Function> = [CirclePacking, CircleShadowsWall, ElementaryAutomata, MondrianTiles, OffsetQuadsWall, SimulatedCodeWall];
    // static getRandomWall(){
    //     return CommonUtitlity.getRandomElement(GeneratorFactory.Walls);
    // }

    static readonly Backgrounds: Array<Function> = [
        ErdavidsTree,
        WatercolorClouds,
        CirclePacking, CircleShadowsWall, ElementaryAutomata, MondrianTiles, OffsetQuadsWall, SimulatedCodeWall];
    static getRandomBackground(){
        return CommonUtitlity.getRandomElement(GeneratorFactory.Backgrounds);
    }
    
}