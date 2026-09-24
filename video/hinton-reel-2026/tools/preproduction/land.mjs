import fs from 'fs'; import * as topo from 'topojson-client';
const t=JSON.parse(fs.readFileSync('node_modules/world-atlas/land-50m.json'));
const land=topo.feature(t,t.objects.land);
const polys=[]; for(const f of (land.features||[land])){const g=f.geometry; const P=g.type==='Polygon'?[g.coordinates]:g.coordinates; for(const p of P) polys.push(p);}
function inRing(x,y,r){let c=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const[xi,yi]=r[i],[xj,yj]=r[j];if(((yi>y)!=(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c;}return c;}
function inLand(x,y){for(const p of polys){if(inRing(x,y,p[0])){let hole=false;for(let k=1;k<p.length;k++)if(inRing(x,y,p[k]))hole=true;if(!hole)return true;}}return false;}
// equal-area-ish dot grid
const pts=[]; const step=1.25;
for(let lat=-58;lat<=78;lat+=step){const n=Math.round(360*Math.cos(lat*Math.PI/180)/step);for(let i=0;i<n;i++){const lon=-180+i*360/n;if(inLand(lon,lat))pts.push([+lon.toFixed(2),+lat.toFixed(2)]);}}
// dense India-region grid
const ind=[]; const s2=0.42;
for(let lat=5;lat<=37;lat+=s2){for(let lon=66;lon<=98;lon+=s2){if(inLand(lon,lat))ind.push([+lon.toFixed(2),+lat.toFixed(2)]);}}
fs.writeFileSync(process.argv[2]+'/land_dots.json',JSON.stringify({world:pts,india:ind}));
console.log(pts.length, ind.length);
