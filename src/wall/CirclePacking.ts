"use strict";

const CirclePacking = p => {
    let w = 1000, h = 1000;
  
    let circles = [];
    let gridless = [];
  
    const grid_width = 30;
    const grid_height = 30;
  
    let cell_width = w * 1.0 /grid_width;
    let cell_height = h * 1.0 /grid_height;
  
    const color_palette = [ColorUtility.createRGBColor(229, 115, 118),
        ColorUtility.createRGBColor(235, 167, 114),
        ColorUtility.createRGBColor(114, 178, 241),
        ColorUtility.createRGBColor(211, 173, 223),
        ColorUtility.createRGBColor(170, 198, 166)];
  
    // Find and set a random color from predefined palette
    p.set_palette_color = () => {
      const index = p.int(p.random(color_palette.length));
      const c = color_palette[index];
      p.fill(c.r, c.g, c.b);
    };
    
    // Convert pixel position to grid element
    p.get_grid_position = (x, y) => {
      return p.int(x/cell_width) + p.int(y/cell_height) * grid_width;
    };
    
    p.get_grid_position_of_circle = (circle) => {
      let x = circle.position.x;
      let y = circle.position.y;
      return p.get_grid_position(x, y);
    };
    
    p.getDistance = (x1, y1, x2, y2) =>{
      const pow_sum = Math.pow(y1 - y2, 2) + Math.pow(x1 - x2, 2);
      return Math.sqrt(pow_sum);
    };
    
    p.add_gridless = (circle) => {
      for(let i = 0; i< 20; i++){
        circle.position = {
          x: p.random(w),
          y: p.random(h)
        };
        let valid = true;
        _.forEach(gridless, c =>{
          let distance = p.getDistance(c.position.x, c.position.y, circle.position.x, circle.position.y);
          if (distance < (c.size/2 + circle.size/2 + 2)){
            valid = false;
          }
        }); // _.forEach
        if (circle.position.x + circle.size/2 > w || circle.position.x - circle.size/2 < 0 || circle.position.y + circle.size/2 > h || circle.position.y - circle.size/2 < 0){
          valid = false;
        }
        if(valid){
          gridless.push(circle);
          p.display(circle);
          break;
        }
      } // for i
    }; // p.add_gridless
    
    p.place_manually = (circle, position) =>{
      circle.position = position;
      gridless.push(circle);
      p.display(circle);
    };
    
    // Compare each circle against neighbors in cell and neighboring cells
    p.find_valid_position = (circle) =>{
      for(let i = 0; i< 20; i++){
        circle.position = {
          x: p.random(w),
          y: p.random(h)
        };
        let circle_pos = p.get_grid_position_of_circle(circle);
        let grid_position = p.int(circle_pos);
        let compare_list = [];
        _.forEach(gridless, c => {
          compare_list.push(c);
        });
        _.forEach(circles[grid_position], c => {
          compare_list.push(c);
        });
        if (grid_position % grid_width > 0){
          _.forEach(circles[grid_position - 1], c => {
            compare_list.push(c);
          });
        }
        if (grid_position % grid_width < grid_width - 1){
          _.forEach(circles[grid_position + 1], c => {
            compare_list.push(c);
          });
        }
        if (grid_position >= grid_width){
          _.forEach(circles[grid_position - grid_width], c => {
            compare_list.push(c);
          });
        }
        if (grid_position < (grid_width * grid_height) - grid_width){
          _.forEach(circles[grid_position + grid_width], c => {
            compare_list.push(c);
          });
        }
        if (grid_position % grid_width > 0 && grid_position > grid_width){
          _.forEach(circles[grid_position - grid_width - 1], c => {
            compare_list.push(c);
          });
        }
        if (grid_position % grid_width > 0 && grid_position < (grid_width * grid_height) - grid_width){
          _.forEach(circles[grid_position + grid_width - 1], c => {
            compare_list.push(c);
          });
        }
        if (grid_position % grid_width < grid_width - 1 && grid_position > grid_width){
          _.forEach(circles[grid_position - grid_width + 1], c => {
            compare_list.push(c);
          });
        }
        if (grid_position % grid_width < grid_width - 1 && grid_position < (grid_width * grid_height) - grid_width){
          _.forEach(circles[grid_position + grid_width + 1], c => {
            compare_list.push(c);
          });
        }
        
        let valid = true;
        _.forEach(compare_list, c =>{
          let distance = p.getDistance(c.position.x, c.position.y, circle.position.x, circle.position.y);
          if (distance < (c.size/2 + circle.size/2 + 1)){
            valid = false;
          }
        });
        
        if (circle.position.x + circle.size/2 > w || circle.position.x - circle.size/2 < 0 || circle.position.y + circle.size/2 > h || circle.position.y - circle.size/2 < 0){
          valid = false;
        }
        if(valid){
          circles[grid_position].push(circle);
          p.display(circle);
          break;
        }
      } // for i
    }; // p.find_valid_position
    
    p.display = (cir) => {
      const color = color_palette[p.int(p.random(color_palette.length))];
      p.fill(color.r, color.g, color.b);
      p.circle(cir.position.x, cir.position.y, cir.size);
    };
    
    p.draw = () =>{
      let renderer = p.createCanvas(w, h);
      P5Utility.placeCanvasTo(p, renderer, true, -10);

      p.pixelDensity(2);
      p.background(30, 30, 30);
      p.noStroke();

      // clear
      circles = [];
      gridless = [];
  
      const max = grid_width * grid_height;
      for(let i =0; i< max; i++){
        circles.push([]);
      }
  
      for(let i =0; i< 20; i++){
        let c = ShapeUtility.createCircle(75);
        p.add_gridless(c);
      }
  
      for(let i =0; i< 50; i++){
        let c = ShapeUtility.createCircle(50);
        p.add_gridless(c);
      }
  
      for(let i =0; i< 800; i++){ // 2000
        let c = ShapeUtility.createCircle(20);
        p.find_valid_position(c);
      }
  
      for(let i =0; i< 4000; i++){ // 10000
        let c = ShapeUtility.createCircle(3);
        p.find_valid_position(c);
      }
  
    }; // p.setup

    p.updateSettings = (settings: GeneratorSettings) => {
      w = settings.canvasWidth;
      h = settings.canvasHeight;
      
      cell_width = w * 1.0 /grid_width;
      cell_height = h * 1.0 /grid_height;

      P5Utility.switchStaticOrFrames(p, settings.isStatic, settings.fps);

      p.resizeCanvas(w, h);
  };
    
  };
  