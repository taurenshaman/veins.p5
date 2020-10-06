"use strict";
// Ref: https://github.com/erdavids/Offset-Quads/blob/master/Offset_Quads.pyde
// Inspired by this post:
// https://www.reddit.com/r/generative/comments/g07wgz/rythm/

const OffsetQuadsWall = p => {
    // Common
    let w = 1000, h = 1000;

    const colors = [ColorUtility.createRGBAColor(92, 97, 130, 110),
    ColorUtility.createRGBAColor(79, 164, 165, 110),
    ColorUtility.createRGBAColor(202, 166, 122, 110),
    ColorUtility.createRGBAColor(212, 117, 100, 110)
    ];
    // Number of quads
    const grid_x = 30;
    const grid_y = 30;
    // Seperation between the bricks
    const diff = 6;
    const base_deform = 3;
    const back_deform = 3;
    const offset = 2;
    // Nature of the grid changes
    const horizontal_length = 2;
    // The quads will draw inside this rectangle
    let grid_x_pixels = .9 * w;
    let grid_y_pixels = .9 * h;
    // Distance between the birds
    let sep_x = grid_x_pixels * 1.0 / (grid_x - 1);
    let sep_y = grid_y_pixels * 1.0 / (grid_y - 1);

    p.get_random_element = (list) => {
        //return l[int(random(len(l)))]
        const index = p.int(p.random(list.length));
        return list[index];
    }

    p.draw_rect = (x, y, x_s, y_s, d, r, o, f) => {
        p.stroke(o.r, o.g, o.b, o.a);
        p.fill(f.r, f.g, f.b, f.a);
        p.strokeJoin(p.ROUND);
        p.beginShape();
      
        p.vertex(x - x_s - p.random(-d, d), y - y_s - p.random(-d, d));
        p.vertex(x + x_s - p.random(-d, d), y - y_s - p.random(-d, d));
        p.vertex(x + x_s - p.random(-d, d), y + y_s - p.random(-d, d));
        p.vertex(x - x_s - p.random(-d, d), y + y_s - p.random(-d, d));
      
        p.endShape(p.CLOSE);
      };

      p.process_cell_base_deform = (x, y, x_s, y_s, d) => {
        const o = ColorUtility.createRGBAColor(0, 0, 0, 255);
        const f = ColorUtility.createRGBAColor(0, 0, 255, 0);
        p.draw_rect(x, y, x_s, y_s, d, -1, o, f);
      };

      p.process_cell_back_deform = (x, y, x_s, y_s, d) => {
        const o = ColorUtility.createRGBAColor(0, 0, 0, 0);
        const f = p.get_random_element(colors);
        p.draw_rect(x, y, x_s, y_s, d, -1, o, f);
      };

      p.render = () =>{
        //size(w, h);
        p.createCanvas(w, h);
        p.pixelDensity(2);
        p.background(255);
      
        p.strokeWeight(2);
      
        const grid = [];
        
        for(let i = 0; i< grid_x; i++){
          grid.push([]);
          for(let j = 0; j < grid_y; j++){
            grid[i].push(1);
          }
        }
        
        for(let i = 0; i< grid_x; i++){
          for(let j = 0; j < grid_y; j++){
            if (i < grid_x - 1){
              if (p.random(1) < .3 && grid[i][j] === 1){
                grid[i][j] = 2;
                grid[i + 1][j] = 0;
              }
            }
            if (j < grid_y - 1){
              if (p.random(1) < .3 && grid[i][j] === 1 && grid[i][j + 1] !== 0){
                grid[i][j] = 3;
                grid[i][j + 1] = 0;
              }
            }
            if (i < grid_x - 1 && j < grid_y - 1){
              if (p.random(1) < .2 &&
                  grid[i][j] === 1 &&
                  grid[i][j + 1] === 1 &&
                  grid[i + 1][j] === 1 &&
                  grid[i + 1][j + 1] === 1){
                grid[i][j] = 4;
                grid[i + 1][j] = 0;
                grid[i][j + 1] = 0;
                grid[i + 1][j + 1] = 0;
              }
            }
          } // for j
        } // for i
        
        let current_x = w/2.0 - grid_x_pixels/2.0;
        let current_y = h/2.0 - grid_y_pixels/2.0;
        for(let i = 0; i< grid_x; i++){
          for(let j = 0; j < grid_y; j++){
            // let o = createColor(0, 0, 0, 255);
            // let f = createColor(0, 0, 255, 0);
            let cell = grid[i][j];
            let short_x = sep_x/2 - diff;
            let long_x = sep_x - diff;
            let short_y = sep_y/2 - diff;
            let long_y = sep_y - diff;
            
            let r1 = p.random(-offset, offset);
            let r2 = p.random(-offset, offset);
            if(cell === 1){
                p.process_cell_back_deform(current_x + r1, current_y + r2, short_x, short_y, back_deform);
              p.process_cell_base_deform(current_x, current_y, short_x, short_y, base_deform);
            }
            else if(cell === 2){
                p.process_cell_back_deform(current_x + sep_x/2 + r1, current_y + r2, long_x, short_y, back_deform);
              p.process_cell_base_deform(current_x + sep_x/2, current_y, long_x, short_y, base_deform);
            }
            else if(cell === 3){
                p.process_cell_back_deform(current_x + r1, current_y + sep_y/2 + r2, short_x, long_y, back_deform);
              p.process_cell_base_deform(current_x, current_y + sep_y/2, short_x, long_y, base_deform);
            }
            else if(cell === 4){
              p.process_cell_back_deform(current_x + sep_x/2 + r1, current_y + sep_y/2 + r2, long_x, long_y, back_deform);
              p.process_cell_base_deform(current_x + sep_x/2, current_y + sep_y/2, long_x, long_y, base_deform);
            }
            current_y += sep_y;
          } // for i
          current_y = h/2.0 - grid_y_pixels/2.0;
          current_x += sep_x;
        } // for j
      };

      p.updateSettings = (canvasWidth, canvasHeight, isStatic = false, fps = 30) => {
        w = canvasWidth;
        h = canvasHeight;
        
        grid_x_pixels = .9 * w;
        grid_y_pixels = .9 * h;

        sep_x = grid_x_pixels * 1.0 / (grid_x - 1);
        sep_y = grid_y_pixels * 1.0 / (grid_y - 1);

        P5Utility.switchStaticOrFrames(p, isStatic, fps);

        p.resizeCanvas(w, h);
    };

};