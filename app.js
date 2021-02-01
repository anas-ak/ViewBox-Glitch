import SimplexNoise from 'https://cdn.skypack.dev/simplex-noise@2.4.0';
import { SVG } from 'https://cdn.skypack.dev/@svgdotjs/svg.js';

const simplex = new SimplexNoise();

const width = 200;
const height = 200;

const svg = SVG('svg');

const mask = svg.mask();
mask.attr('id', 'gridMask');

const res = 20;
const cols = 1 + width / res;
const rows = 1 + height / res;

const inc = 0.075;
let zOff = 0;

const maskRects = [];
const displayRects = [];

const grid = svg.group();

const stars = svg.group();
stars.attr('mask', 'url(#gridMask)');

for(let i = 0; i < 60; i++) {
    stars
        .circle(Math.random() * 2)
        .cx(Math.random() * 200)
        .cy(Math.random() * 200)
        .fill("#fff");
}

for(let x = 0; x < cols; x++) {
    svg
       .line(x * res, 0, x * res, 200)
       .stroke({
           width: 2,
           color: 'var(--pink-light)'
       })
       .attr('vector-effect', 'non-scaling-stroke')
}

svg
   .circle(150)
   .cx(100)
   .cy(100)
   .fill('#F8DA28')
   .attr('mask', 'url(#gridMask)')
   .attr('fill', 'url(#sunGradient)')
   .attr('filter', 'url(#shadow)');

for(let i = 0; i < cols; i++){
    maskRects[i] = [];
    displayRects[i] = [];
    for(let j = 0; j < rows; j++) {
        maskRects[i].push( 
            mask
                .rect(res, res)
                .x(i * res)
                .y(j * res)
                .stroke({
                    width: 2,
                    color: '#000'
                })
                .fill('#fff')
                .attr('vector-effect', 'non-scaling-stroke')
        )
        displayRects[i].push(
            grid
                .rect(res, res)
                .x(i * res)
                .y(j * res)
                .stroke({
                    width: 2,
                    color: 'var(--pink-light)'
                })
                .fill('transparent')
                .attr('vector-effect', 'non-scaling-stroke')
        )
    }
}

(function animate() {
    let xOff = 0;

    for(let x = 0; x < cols; x++) {
        xOff += inc;
        let yOff = 0;
        for(let y = 0; y < rows; y++) {
            const noise = simplex.noise3D(xOff, yOff, zOff);

            if (noise > -0.25) {
                maskRects[x][y].opacity(1);
                displayRects[x][y].opacity(1);
            } else {
                maskRects[x][y].opacity(0);
                displayRects[x][y].opacity(0);
            }

            yOff += inc;
        }
    }
    
    zOff += 0.015;

    requestAnimationFrame(animate);
})();

function map(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}