// Type definitions for svg2png node package 
// Project: https://github.com/domenic/svg2png
// Definitions by: hans windhoff <https://github.com/hansrwindhoff>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare function svg2png(srcFile: string, destFile: string, scale: number, cb: (err:Error) => void):void;
declare function svg2png(srcFile: string, destFile: string, cb: (err:Error) => void):void;


declare module "svg2png" {
  export = svg2png;
}



// 这个版本需要Node，故未采用

//// Type definitions for svg2png 4.1
//// Project: https://github.com/domenic/svg2png
//// Definitions by: hans windhoff <https://github.com/hansrwindhoff>, songChengcheng <https://github.com/sccgithub>
//// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

///// <reference types="node" />

//interface opts {
//    fileName?: string;
//    width?: number;
//    height?: number;
//    url?: string;
//}

//declare function svg2png(sourceBuffer: Buffer, opts?: opts): Promise<Buffer>;

//declare namespace svg2png {
//    function sync(sourceBuffer: Buffer, opts?: opts): Buffer;
//}
//export = svg2png;