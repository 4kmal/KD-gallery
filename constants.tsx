
import { LoadingAnimation, User } from './types';

export const MOCK_USERS: Record<string, User> = {
  jinbei: { name: 'JINBEI', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=jinbei', level: 3, xp: 615 },
  fourkmal: { name: '4KMAL', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=fourkmal', level: 3, xp: 510, isMod: true },
  kiyoraka: { name: 'KIYORAKA KEN', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=kiyoraka', level: 3, xp: 500 },
  adam: { name: 'ADAMRAPIDSCREEN', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=adam', level: 2, xp: 280 },
  razeen: { name: 'RAZEENIQBAL', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=razeen', level: 2, xp: 195 },
  moon: { name: 'MOONWIRAJA', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=moon', level: 2, xp: 165 },
  exh: { name: 'EXHAZORDINARY', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=exh', level: 2, xp: 165 },
};

export const SOUND_URLS = {
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  copy: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
  generate: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
};

export const INITIAL_ANIMATIONS: LoadingAnimation[] = [
  {
    id: 'emerald-orbit',
    name: 'Toxic Orbit',
    description: 'A radioactive green ring with a fast orbital particle.',
    category: 'Spinnners',
    author: MOCK_USERS.jinbei,
    html: `<div class="relative w-16 h-16">
  <div class="absolute inset-0 rounded-full border-4 border-emerald-950"></div>
  <div class="absolute inset-0 rounded-full border-4 border-t-emerald-400 animate-spin"></div>
  <div class="absolute -inset-1 rounded-full bg-emerald-500/10 blur-sm"></div>
</div>`,
    tailwindClasses: 'relative w-16 h-16\n  absolute inset-0 rounded-full border-4 border-emerald-950\n  absolute inset-0 rounded-full border-4 border-t-emerald-400 animate-spin\n  absolute -inset-1 rounded-full bg-emerald-500/10 blur-sm'
  },
  {
    id: 'green-pulse',
    name: 'Bio Echo',
    description: 'Rhythmic green dots pulsing in sequence.',
    category: 'Dots',
    author: MOCK_USERS.adam,
    html: `<div class="flex space-x-2">
  <div class="w-3 h-3 bg-emerald-500 rounded-none animate-bounce [animation-delay:-0.3s]"></div>
  <div class="w-3 h-3 bg-emerald-500 rounded-none animate-bounce [animation-delay:-0.15s]"></div>
  <div class="w-3 h-3 bg-emerald-500 rounded-none animate-bounce"></div>
</div>`,
    tailwindClasses: 'flex space-x-2\n  w-3 h-3 bg-emerald-500 rounded-none animate-bounce [animation-delay:-0.3s]\n  w-3 h-3 bg-emerald-500 rounded-none animate-bounce [animation-delay:-0.15s]\n  w-3 h-3 bg-emerald-500 rounded-none animate-bounce'
  },
  {
    id: 'grid-terminal',
    name: 'Matrix Grid',
    description: 'A data grid that pulses with green energy.',
    category: 'Shape Shift',
    author: MOCK_USERS.razeen,
    html: `<div class="grid grid-cols-2 gap-1">
  <div class="w-5 h-5 bg-green-400 animate-pulse"></div>
  <div class="w-5 h-5 bg-green-600/40 animate-pulse [animation-delay:200ms]"></div>
  <div class="w-5 h-5 bg-green-600/40 animate-pulse [animation-delay:400ms]"></div>
  <div class="w-5 h-5 bg-green-400 animate-pulse [animation-delay:600ms]"></div>
</div>`,
    tailwindClasses: 'grid grid-cols-2 gap-1\n  w-5 h-5 bg-green-400 animate-pulse\n  w-5 h-5 bg-green-600/40 animate-pulse [animation-delay:200ms]\n  w-5 h-5 bg-green-600/40 animate-pulse [animation-delay:400ms]\n  w-5 h-5 bg-green-400 animate-pulse [animation-delay:600ms]'
  },
  {
    id: 'bit-bars',
    name: 'Signal Bars',
    description: 'Emerald signal bars modulating at high frequency.',
    category: 'Bars',
    author: MOCK_USERS.moon,
    html: `<div class="flex items-end space-x-1 h-10">
  <div class="w-3 bg-emerald-500 animate-[bounce_1s_infinite] h-full"></div>
  <div class="w-3 bg-emerald-500 animate-[bounce_1.2s_infinite] h-2/3"></div>
  <div class="w-3 bg-emerald-500 animate-[bounce_0.8s_infinite] h-1/2"></div>
</div>`,
    tailwindClasses: 'flex items-end space-x-1 h-10\n  w-3 bg-emerald-500 animate-bounce h-full\n  w-3 bg-emerald-500 animate-[bounce_1.2s_infinite] h-2/3\n  w-3 bg-emerald-500 animate-[bounce_0.8s_infinite] h-1/2'
  },
  {
    id: 'hacker-snake',
    name: 'Ghost Trail',
    description: 'A pixelated tail fading in a circular motion.',
    category: 'Spinnners',
    author: MOCK_USERS.exh,
    html: `<div class="relative w-10 h-10 animate-spin">
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400"></div>
  <div class="absolute top-1 right-1.5 w-2 h-2 bg-emerald-400/80"></div>
  <div class="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400/60"></div>
  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400/20"></div>
</div>`,
    tailwindClasses: 'relative w-10 h-10 animate-spin\n  absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400\n  absolute top-1 right-1.5 w-2 h-2 bg-emerald-400/80\n  absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400/60\n  absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400/20'
  },
  {
    id: 'slime-blob',
    name: 'Ectoplasm',
    description: 'Amorphous green substance in flux.',
    category: 'Shape Shift',
    author: MOCK_USERS.fourkmal,
    html: `<div class="w-14 h-14 bg-emerald-500 animate-pulse blur-[1px]"></div>`,
    tailwindClasses: 'w-14 h-14 bg-emerald-500 animate-pulse blur-[1px]'
  },
  {
    id: 'minimal-spinner',
    name: 'Void Ring',
    description: 'A sleek minimal ring for modern terminals.',
    category: 'Spinnners',
    author: MOCK_USERS.kiyoraka,
    html: `<div class="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>`,
    tailwindClasses: 'w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin'
  },
  // Westworld Category - Canvas-based animations
  {
    id: 'ww-sphere-scan',
    name: '3D Sphere Scan',
    description: 'Rotating sphere with scanning beam effect.',
    category: 'Westworld',
    author: MOCK_USERS.fourkmal,
    html: `<div class="relative w-[120px] h-[120px]"><canvas width="120" height="120"></canvas></div>
<script>
(function(){
  const canvas = document.currentScript.previousElementSibling.querySelector('canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=120,H=120,cx=W/2,cy=H/2,radius=W*0.38;
  let time=0,lastTime=0;
  const dots=[];
  for(let i=0;i<200;i++){
    const theta=Math.acos(1-2*(i/200));
    const phi=Math.sqrt(200*Math.PI)*theta;
    dots.push({x:radius*Math.sin(theta)*Math.cos(phi),y:radius*Math.sin(theta)*Math.sin(phi),z:radius*Math.cos(theta)});
  }
  function animate(ts){
    if(!lastTime)lastTime=ts;
    time+=(ts-lastTime)*0.00025;
    lastTime=ts;
    ctx.clearRect(0,0,W,H);
    const rotY=time*0.5,scanLine=(Math.sin(time*2.5)*radius);
    dots.forEach(d=>{
      let x=d.x*Math.cos(rotY)-d.z*Math.sin(rotY);
      let z=d.x*Math.sin(rotY)+d.z*Math.cos(rotY);
      let y=d.y;
      const scale=(z+radius*1.5)/(radius*2.5);
      const distScan=Math.abs(y-scanLine);
      const scanInf=distScan<25?Math.cos((distScan/25)*(Math.PI/2)):0;
      const size=Math.max(0,scale*1.5+scanInf*2);
      const op=Math.max(0,scale*0.6+scanInf*0.4);
      ctx.beginPath();
      ctx.arc(cx+x,cy+y,size,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+op+')';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
</script>`,
    tailwindClasses: 'Canvas animation - 3D sphere with scan effect'
  },
  {
    id: 'ww-crystalline',
    name: 'Crystalline Refraction',
    description: 'Grid of dots with wave displacement effect.',
    category: 'Westworld',
    author: MOCK_USERS.fourkmal,
    html: `<div class="relative w-[120px] h-[120px]"><canvas width="120" height="120"></canvas></div>
<script>
(function(){
  const canvas = document.currentScript.previousElementSibling.querySelector('canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=120,H=120,cx=W/2,cy=H/2;
  let time=0,lastTime=0;
  const dots=[];
  const gs=10,sp=W/(gs-1);
  for(let r=0;r<gs;r++)for(let c=0;c<gs;c++)dots.push({x:c*sp,y:r*sp});
  function animate(ts){
    if(!lastTime)lastTime=ts;
    time+=(ts-lastTime)*0.08;
    lastTime=ts;
    ctx.clearRect(0,0,W,H);
    const waveR=time%(W*1.2),waveW=40;
    dots.forEach(d=>{
      const dist=Math.hypot(d.x-cx,d.y-cy);
      const distWave=Math.abs(dist-waveR);
      let disp=0;
      if(distWave<waveW/2){
        disp=Math.sin((distWave/(waveW/2))*Math.PI)*8;
      }
      const angle=Math.atan2(d.y-cy,d.x-cx);
      const dx=Math.cos(angle)*disp,dy=Math.sin(angle)*disp;
      const op=0.2+(Math.abs(disp)/8)*0.8;
      const size=1+(Math.abs(disp)/8)*1.5;
      ctx.beginPath();
      ctx.arc(d.x+dx,d.y+dy,size,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+op+')';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
</script>`,
    tailwindClasses: 'Canvas animation - Crystalline wave refraction'
  },
  {
    id: 'ww-sonar',
    name: 'Sonar Sweep',
    description: 'Radar-style scanning animation with fading dots.',
    category: 'Westworld',
    author: MOCK_USERS.fourkmal,
    html: `<div class="relative w-[120px] h-[120px]"><canvas width="120" height="120"></canvas></div>
<script>
(function(){
  const canvas = document.currentScript.previousElementSibling.querySelector('canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=120,H=120,cx=W/2,cy=H/2;
  let time=0;
  const rings=[],fadeTime=2000;
  for(let r=15;r<=50;r+=12)for(let i=0;i<r/3;i++)rings.push({r,angle:(i/(r/3))*Math.PI*2,lastSeen:-fadeTime});
  function animate(ts){
    time=ts;
    ctx.clearRect(0,0,W,H);
    const scanAngle=(time*0.0004*Math.PI)%(Math.PI*2);
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx+55*Math.cos(scanAngle),cy+55*Math.sin(scanAngle));
    ctx.strokeStyle='rgba(255,255,255,0.5)';
    ctx.lineWidth=1;
    ctx.stroke();
    rings.forEach(d=>{
      let diff=Math.abs(d.angle-scanAngle);
      if(diff>Math.PI)diff=Math.PI*2-diff;
      if(diff<0.05)d.lastSeen=time;
      const since=time-d.lastSeen;
      if(since<fadeTime){
        const op=1-(since/fadeTime);
        const size=1+op*1.5;
        ctx.beginPath();
        ctx.arc(cx+d.r*Math.cos(d.angle),cy+d.r*Math.sin(d.angle),size,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,'+op+')';
        ctx.fill();
      }
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
</script>`,
    tailwindClasses: 'Canvas animation - Sonar sweep radar'
  },
  {
    id: 'ww-helix',
    name: 'Helix Scanner',
    description: 'DNA-style double helix with scanning beam.',
    category: 'Westworld',
    author: MOCK_USERS.fourkmal,
    html: `<div class="relative w-[120px] h-[120px]"><canvas width="120" height="120"></canvas></div>
<script>
(function(){
  const canvas = document.currentScript.previousElementSibling.querySelector('canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=120,H=120,cx=W/2,cy=H/2;
  let time=0,lastTime=0;
  const dots=[],radius=25,height=80;
  for(let i=0;i<60;i++)dots.push({angle:i*0.35,y:(i/60)*height-height/2});
  function animate(ts){
    if(!lastTime)lastTime=ts;
    time+=(ts-lastTime)*0.0005;
    lastTime=ts;
    ctx.clearRect(0,0,W,H);
    const scanY=Math.sin(time*2)*(height/2);
    dots.forEach(d=>{
      const x=radius*Math.cos(d.angle+time);
      const z=radius*Math.sin(d.angle+time);
      const scale=(z+radius)/(radius*2);
      const distScan=Math.abs(d.y-scanY);
      const scanInf=distScan<20?Math.cos((distScan/20)*(Math.PI/2)):0;
      const size=Math.max(0,scale*1.5+scanInf*2.5);
      const op=Math.max(0,scale*0.4+scanInf*0.6);
      ctx.beginPath();
      ctx.arc(cx+x,cy+d.y,size,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+op+')';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
</script>`,
    tailwindClasses: 'Canvas animation - Helix scanner'
  },
  {
    id: 'ww-waves',
    name: 'Interconnecting Waves',
    description: 'Concentric rings with pulsing connections.',
    category: 'Westworld',
    author: MOCK_USERS.fourkmal,
    html: `<div class="relative w-[120px] h-[120px]"><canvas width="120" height="120"></canvas></div>
<script>
(function(){
  const canvas = document.currentScript.previousElementSibling.querySelector('canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=120,H=120,cx=W/2,cy=H/2;
  let time=0,lastTime=0;
  const rings=[{r:15,c:8},{r:32,c:16},{r:50,c:24}];
  function animate(ts){
    if(!lastTime)lastTime=ts;
    time+=(ts-lastTime)*0.0005;
    lastTime=ts;
    ctx.clearRect(0,0,W,H);
    rings.forEach((ring,ri)=>{
      if(ri<rings.length-1){
        const next=rings[ri+1];
        for(let i=0;i<ring.c;i++){
          const a=(i/ring.c)*Math.PI*2;
          const pulse=Math.sin(time*2-ri*0.4)*2;
          const x1=cx+Math.cos(a)*(ring.r+pulse);
          const y1=cy+Math.sin(a)*(ring.r+pulse);
          const ratio=next.c/ring.c;
          for(let j=0;j<ratio;j++){
            const na=((i*ratio+j)/next.c)*Math.PI*2;
            const pulse2=Math.sin(time*2-(ri+1)*0.4)*2;
            const x2=cx+Math.cos(na)*(next.r+pulse2);
            const y2=cy+Math.sin(na)*(next.r+pulse2);
            const op=0.1+((Math.sin(time*3-ri*0.5+i*0.3)+1)/2)*0.3;
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.strokeStyle='rgba(255,255,255,'+op+')';
            ctx.lineWidth=0.5;
            ctx.stroke();
          }
        }
      }
      for(let i=0;i<ring.c;i++){
        const a=(i/ring.c)*Math.PI*2;
        const pulse=Math.sin(time*2-ri*0.4)*2;
        const x=cx+Math.cos(a)*(ring.r+pulse);
        const y=cy+Math.sin(a)*(ring.r+pulse);
        const op=0.4+Math.sin(time*2-ri*0.4+i*0.2)*0.6;
        ctx.beginPath();
        ctx.arc(x,y,1.2,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,'+op+')';
        ctx.fill();
      }
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
</script>`,
    tailwindClasses: 'Canvas animation - Interconnecting wave rings'
  },
  {
    id: 'ww-cylinder',
    name: 'Cylindrical Analysis',
    description: '3D rotating cylinder with scan line.',
    category: 'Westworld',
    author: MOCK_USERS.fourkmal,
    html: `<div class="relative w-[120px] h-[120px]"><canvas width="120" height="120"></canvas></div>
<script>
(function(){
  const canvas = document.currentScript.previousElementSibling.querySelector('canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=120,H=120,cx=W/2,cy=H/2;
  let time=0,lastTime=0;
  const radius=40,height=70,layers=10,dpl=18;
  function animate(ts){
    if(!lastTime)lastTime=ts;
    time+=(ts-lastTime)*0.0005;
    lastTime=ts;
    ctx.clearRect(0,0,W,H);
    const scanY=cy+((Math.sin(time*2)+1)/2-0.5)*height;
    for(let i=0;i<layers;i++){
      const layerY=cy+(i/(layers-1)-0.5)*height;
      const rot=time*(0.2+(i%2)*0.1);
      for(let j=0;j<dpl;j++){
        const a=(j/dpl)*Math.PI*2+rot;
        const x=Math.cos(a)*radius,z=Math.sin(a)*radius;
        const scale=(z+radius)/(radius*2);
        const pX=cx+x*scale;
        const distScan=Math.abs(layerY-scanY);
        const scanInf=distScan<12?Math.cos((distScan/12)*(Math.PI/2)):0;
        const size=Math.max(0,scale*1.2+scanInf*1.8);
        const op=Math.max(0,scale*0.5+scanInf*0.5);
        ctx.beginPath();
        ctx.arc(pX,layerY,size,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,'+op+')';
        ctx.fill();
      }
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
</script>`,
    tailwindClasses: 'Canvas animation - Cylindrical analysis'
  },
  {
    id: 'ww-voxel',
    name: 'Voxel Matrix Morph',
    description: '3D rotating cube grid with wave distortion.',
    category: 'Westworld',
    author: MOCK_USERS.fourkmal,
    html: `<div class="relative w-[120px] h-[120px]"><canvas width="120" height="120"></canvas></div>
<script>
(function(){
  const canvas = document.currentScript.previousElementSibling.querySelector('canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=120,H=120,cx=W/2,cy=H/2;
  let time=0,lastTime=0;
  const pts=[],gs=4,sp=14;
  for(let x=0;x<gs;x++)for(let y=0;y<gs;y++)for(let z=0;z<gs;z++)
    pts.push({x:(x-(gs-1)/2)*sp,y:(y-(gs-1)/2)*sp,z:(z-(gs-1)/2)*sp});
  function animate(ts){
    if(!lastTime)lastTime=ts;
    time+=(ts-lastTime)*0.00025;
    lastTime=ts;
    ctx.clearRect(0,0,W,H);
    const rotX=time*0.4,rotY=time*0.6;
    const scanL=(Math.sin(time*2)*30);
    pts.forEach(p=>{
      let x=p.x,y=p.y,z=p.z;
      let nx=x*Math.cos(rotY)-z*Math.sin(rotY);
      let nz=x*Math.sin(rotY)+z*Math.cos(rotY);
      x=nx;z=nz;
      let ny=y*Math.cos(rotX)-z*Math.sin(rotX);
      nz=y*Math.sin(rotX)+z*Math.cos(rotX);
      y=ny;z=nz;
      const distScan=Math.abs(y-scanL);
      const scanInf=distScan<25?Math.cos((distScan/25)*(Math.PI/2)):0;
      const disp=1+scanInf*0.4;
      const scale=(z+60)/120;
      const size=Math.max(0,scale*1.8+scanInf*1.8);
      const op=Math.max(0.1,scale*0.7+scanInf*0.3);
      ctx.beginPath();
      ctx.arc(cx+x*disp,cy+y*disp,size,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+op+')';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
</script>`,
    tailwindClasses: 'Canvas animation - Voxel matrix morph'
  },
  {
    id: 'ww-phased',
    name: 'Phased Array Emitter',
    description: 'Concentric rings with 3D wave propagation.',
    category: 'Westworld',
    author: MOCK_USERS.fourkmal,
    html: `<div class="relative w-[120px] h-[120px]"><canvas width="120" height="120"></canvas></div>
<script>
(function(){
  const canvas = document.currentScript.previousElementSibling.querySelector('canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=120,H=120,cx=W/2,cy=H/2,fov=200;
  let time=0,lastTime=0;
  const pts=[],radii=[15,28,42],ppr=[8,12,18];
  radii.forEach((r,i)=>{for(let j=0;j<ppr[i];j++)pts.push({x:Math.cos((j/ppr[i])*Math.PI*2)*r,y:Math.sin((j/ppr[i])*Math.PI*2)*r,z:0});});
  function animate(ts){
    if(!lastTime)lastTime=ts;
    time+=(ts-lastTime)*0.0005;
    lastTime=ts;
    ctx.clearRect(0,0,W,H);
    const rotX=0.8,rotY=time*0.2;
    const waveR=(time*80)%70,waveW=35;
    const toDraw=[];
    pts.forEach(p=>{
      let x=p.x,y=p.y,z=p.z;
      const dist=Math.hypot(x,y);
      const distW=Math.abs(dist-waveR);
      let wInf=0;
      if(distW<waveW/2){z=Math.sin((1-distW/(waveW/2))*Math.PI)*12;wInf=z/12;}
      let nx=x*Math.cos(rotY)-z*Math.sin(rotY);
      let nz=x*Math.sin(rotY)+z*Math.cos(rotY);
      x=nx;z=nz;
      let ny=y*Math.cos(rotX)-z*Math.sin(rotX);
      nz=y*Math.sin(rotX)+z*Math.cos(rotX);
      y=ny;z=nz;
      const scale=fov/(fov+z+80);
      const size=(1.2+wInf*2)*scale;
      const op=0.4+wInf*0.6;
      toDraw.push({x:cx+x*scale,y:cy+y*scale,z,size,op});
    });
    toDraw.sort((a,b)=>a.z-b.z).forEach(p=>{
      if(p.size<0.1)return;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+p.op+')';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
</script>`,
    tailwindClasses: 'Canvas animation - Phased array emitter'
  },
  {
    id: 'ww-cube-refraction',
    name: 'Crystalline Cube',
    description: '3D rotating cube with expanding wave effect.',
    category: 'Westworld',
    author: MOCK_USERS.fourkmal,
    html: `<div class="relative w-[120px] h-[120px]"><canvas width="120" height="120"></canvas></div>
<script>
(function(){
  const canvas = document.currentScript.previousElementSibling.querySelector('canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=120,H=120,cx=W/2,cy=H/2,fov=180;
  let time=0,lastTime=0;
  const pts=[],gs=5,sp=10;
  const half=((gs-1)*sp)/2;
  for(let x=0;x<gs;x++)for(let y=0;y<gs;y++)for(let z=0;z<gs;z++)
    pts.push({x:x*sp-half,y:y*sp-half,z:z*sp-half});
  const maxDist=Math.hypot(half,half,half);
  function animate(ts){
    if(!lastTime)lastTime=ts;
    time+=(ts-lastTime)*0.00015;
    lastTime=ts;
    ctx.clearRect(0,0,W,H);
    const rotX=time*2,rotY=time*3;
    const waveR=(ts*0.02)%(maxDist*1.5),waveW=30;
    const toDraw=[];
    pts.forEach(p=>{
      let x=p.x,y=p.y,z=p.z;
      const dist=Math.hypot(x,y,z);
      const distW=Math.abs(dist-waveR);
      let dispAmt=0;
      if(distW<waveW/2){dispAmt=Math.cos((distW/(waveW/2))*(Math.PI/2))*8;}
      if(dispAmt>0&&dist>0){const r=(dist+dispAmt)/dist;x*=r;y*=r;z*=r;}
      let nx=x*Math.cos(rotY)-z*Math.sin(rotY);
      let nz=x*Math.sin(rotY)+z*Math.cos(rotY);
      x=nx;z=nz;
      let ny=y*Math.cos(rotX)-z*Math.sin(rotX);
      nz=y*Math.sin(rotX)+z*Math.cos(rotX);
      y=ny;z=nz;
      const scale=fov/(fov+z);
      const wInf=dispAmt/8;
      const size=(1.2+wInf*2)*scale;
      const op=Math.max(0.1,scale*0.7+wInf*0.4);
      if(size>0.1)toDraw.push({x:cx+x*scale,y:cy+y*scale,z,size,op});
    });
    toDraw.sort((a,b)=>a.z-b.z).forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+p.op+')';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
</script>`,
    tailwindClasses: 'Canvas animation - Crystalline cube refraction'
  }
];
