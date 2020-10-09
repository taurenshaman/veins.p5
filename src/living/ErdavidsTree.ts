"use strict";
// Ref: https://github.com/erdavids/Portfolio/blob/master/generative-plants/generative-plants.js

const ErdavidsTree = p => {
    // Common
    let w = 1000, h = 1000;

    const opts = {
        // Generation Details
        Iterations: 5,
        Length: 300,
        Length_Change: .5,
        Length_Drift: .05,
        Angle: 25,
        Angle_Drift: 5,
        rule0a: 'F',
        rule0b: 'Go[-F]S[+G+F*][+F]S[-G-F*]',
        rule1a: 'G',
        rule1b: 'G[+F]G[-F]S',
        Background: [211, 206, 194],
        Shape: [172, 187, 173],
        Fruit: [200, 140, 100],
        Red_Drift: 20,
        Green_Drift: 20,
        Blue_Drift: 20,
        Line_Color: [0, 0, 0],
        Line_Width: 1,
        Line_Opacity: 150,
        Opacity_Drift: 50
    };

    let ang;
    let axiom = "F";
    let sentence = axiom;
    let len = opts.Length;

    let rules = [];
    rules[0] = {
        a: opts.rule0a,
        b: opts.rule0b
    };
    rules[1] = {
        a: opts.rule1a,
        b: opts.rule1b,
    };

    p.updateRules = () => {
        rules[0] = {
            a: opts.rule0a,
            b: opts.rule0b
        };

        rules[1] = {
            a: opts.rule1a,
            b: opts.rule1b,
        };

        len = opts.Length
    };

    p.randomize = () => {
        p.randomSeed(p.random(10000));
        p.updateRules();
        p.setup();
    };

    p.turtle = (iter) => {
        p.background(opts.Background);

        p.fill(opts.Shape)
        p.noStroke()
        // pushMatrix()
        p.translate(w / 2, h / 2)
        p.rotate(p.random(p.PI))
        p.rect(-200, -200, 400, 400)
        // popMatrix()

        p.stroke(0, 100)
        p.resetMatrix();
        p.translate(w / 2, h);

        var circle_calls = 0
        for (var i = 0; i < sentence.length; i++) {
            var current = sentence.charAt(i);
            if (current == 'F' || current == 'G') {
                p.stroke(opts.Line_Color[0],
                    opts.Line_Color[1],
                    opts.Line_Color[2],
                    opts.Line_Opacity + p.random(-opts.Opacity_Drift,opts.Opacity_Drift));
                p.line(0, 0, 0, -len)
                p.translate(0, -len);
            } else if (current == '+') {
                ang = p.radians(p.random(opts.Angle - opts.Angle_Drift, opts.Angle + opts.Angle_Drift));
                p.rotate(ang);
            } else if (current == '-') {
                ang = p.radians(p.random(opts.Angle - opts.Angle_Drift, opts.Angle + opts.Angle_Drift));
                p.rotate(-ang);
            } else if (current == '[') {
                p.push();
            } else if (current == ']') {
                p.pop();
            } else if (current == 'S') {
                p.translate(0, -len / 4);
            } else if (current == '*') {
                p.noFill();
                circle_calls += 1;
                if (circle_calls > 50 && p.random(1) < .4) {
                    p.fill(opts.Fruit[0] + p.random(-opts.Red_Drift, opts.Red_Drift),
                        opts.Fruit[1] + p.random(-opts.Green_Drift, opts.Green_Drift),
                        opts.Fruit[2] + p.random(-opts.Blue_Drift, opts.Blue_Drift));
                    p.circle(0, 0, p.random(4, 13));
                }
            }
        } // for i

        p.resetMatrix()
    };

    p.generate = (iter) => {
        var nextSentence = "";

        len *= opts.Length_Change + p.random(-opts.Length_Drift, opts.Length_Drift)

        for (var i = 0; i < sentence.length; i++) {
            var current = sentence.charAt(i);
            var found = false;

            for (var j = 0; j < rules.length; j++) {
                if (current == rules[j].a) {
                    found = true;
                    nextSentence += rules[j].b;
                    break;
                }
            }
            if (!found) {
                nextSentence += current;
            }
        }
        sentence = nextSentence;

        p.turtle(iter);
    };

    p.createPlant = () => {
        for (var i = 0; i < p.int(opts.Iterations); i++) {
            p.generate(i);
        }
    }

    p.draw = () => {
        let renderer = p.createCanvas(w, h);
        P5Utility.placeCanvasTo(p, renderer, true, -10);

        p.pixelDensity(2);

        ang = p.radians(opts.Angle);
        len = opts.Length;

        p.strokeWeight(opts.Line_Width);
        p.background(211, 206, 194);

        sentence = axiom;
        p.createPlant();
    };

    p.updateSettings = (settings: GeneratorSettings) => {
        w = settings.canvasWidth;
        h = settings.canvasHeight;

        P5Utility.switchStaticOrFrames(p, settings.isStatic, settings.fps);

        p.resizeCanvas(w, h);
    };

};