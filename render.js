// ================= VẼ =================
function whale(f,X=c,px=f.x,py=f.y,k=1){
  const rxk=f.rx&&f.rx.k,s=sz(f)*k*(rxk=='shy'?.85:1),hungry=f.hunger>70;
  X.save();X.translate(px+(rxk=='angry'?Math.sin(t*50)*2.5:0),py);if(rxk=='love')X.rotate(Math.sin(t*14)*.22);
  if(IM.fish&&!f.vec){
    const z=s*2.6;X.scale(f.dir*(S.flip?-1:1),1);X.rotate(Math.sin(t*6+f.ph)*.06);X.drawImage(IM.fish,-z/2,-z/2,z,z);X.restore();
    if(hungry){drawEmo('😢',px,py-s*1.3,20,X)}return;
  }
  X.scale(f.dir,1);
  const wag=Math.sin(t*6+f.ph)*.25,fill=rxk=='angry'?'#d6a2a8':hungry?'#9fbf9f':'#8ea6cc',line='#566b94';
  X.lineWidth=2.5;X.strokeStyle=line;X.lineJoin='round';
  if(f.spout>0){X.strokeStyle='#bfe6ff';X.lineWidth=3;X.beginPath();X.moveTo(s*.1,-s*.9);X.lineTo(s*.1,-s*1.4);X.moveTo(s*.1,-s*1.4);X.quadraticCurveTo(s*-.1,-s*1.6,s*-.2,-s*1.35);X.moveTo(s*.1,-s*1.4);X.quadraticCurveTo(s*.3,-s*1.6,s*.4,-s*1.35);X.stroke();X.strokeStyle=line;X.lineWidth=2.5}
  X.save();X.translate(-s*.95,0);X.rotate(wag);X.fillStyle=fill;X.beginPath();
  X.moveTo(s*.3,0);X.bezierCurveTo(-s*.1,-s*.15,-s*.4,-s*.7,-s*.75,-s*.6);X.bezierCurveTo(-s*.55,-s*.2,-s*.55,s*.2,-s*.75,s*.6);X.bezierCurveTo(-s*.4,s*.7,-s*.1,s*.15,s*.3,0);X.fill();X.stroke();X.restore();
  X.fillStyle=fill;X.beginPath();X.ellipse(0,0,s*1.15,s*.9,0,0,7);X.fill();X.stroke();
  X.save();X.beginPath();X.ellipse(0,0,s*1.15,s*.9,0,0,7);X.clip();
  X.fillStyle='#fff';X.beginPath();X.ellipse(s*.15,s*.65,s*1.1,s*.55,0,0,7);X.fill();
  X.strokeStyle='#b9c8e3';X.lineWidth=1.5;for(let i=-3;i<=3;i++){X.beginPath();X.moveTo(s*(.15+i*.22),s*.3);X.lineTo(s*(.15+i*.22),s*.8);X.stroke()}X.restore();
  X.strokeStyle=line;X.lineWidth=2.5;X.beginPath();X.ellipse(0,0,s*1.15,s*.9,0,0,7);X.stroke();
  X.fillStyle=fill;X.beginPath();X.ellipse(-s*.1,s*.45,s*.3,s*.14,.6+Math.sin(t*5+f.ph)*.2,0,7);X.fill();X.stroke();
  X.fillStyle='#ff9fb0aa';X.beginPath();X.ellipse(s*.45,s*.2,s*.16,s*.1,0,0,7);X.fill();
  if(f.bl!==undefined?f.bl:Math.sin(t*.9+f.ph*3)>.97){X.strokeStyle='#222';X.beginPath();X.arc(s*.6,-s*.05,s*.12,.2,2.9);X.stroke()}
  else{X.fillStyle='#222';X.beginPath();X.arc(s*.6,-s*.05,s*.17,0,7);X.fill();X.fillStyle='#fff';X.beginPath();X.arc(s*.65,-s*.1,s*.06,0,7);X.arc(s*.55,0,s*.03,0,7);X.fill()}
  X.strokeStyle='#222';X.lineWidth=2;X.beginPath();
  if(hungry)X.arc(s*.8,s*.38,s*.1,3.4,6);else X.arc(s*.8,s*.2,s*.1,.3,2.8);
  X.stroke();X.restore();
}
function drawCrab(cr){const im=img('crab');if(!im||!im.naturalWidth)return;const r=im.naturalHeight/im.naturalWidth;let w=64,h=w*r;if(h>72){h=72;w=h/r}
  const bob=Math.abs(Math.sin(t*10+cr.ph))*(Math.abs(cr.vx)>10?4:0);c.save();c.translate(cr.x,H-8-bob);c.scale(cr.dir,1);c.drawImage(im,-w/2,-h,w,h);c.restore()}
function drawSword(w){const im=img('sword');if(!im||!im.naturalWidth)return;const ww=120,hh=ww*im.naturalHeight/im.naturalWidth,a=Math.atan2(w.hy,w.hx);
  c.save();c.translate(w.x+(w.hurt>0?R(-3,3):0),w.y);if(Math.cos(a)>=0){c.rotate(a);c.scale(-1,1)}else c.rotate(a-Math.PI);
  if(w.lunge<=0)c.rotate(Math.sin(t*5+w.ph)*.04);if(w.hurt>0)c.globalAlpha=.7;c.drawImage(im,-ww/2,-hh/2,ww,hh);c.restore();
  const bw=44,by=w.y-hh/2-14;c.fillStyle='#0006';c.fillRect(w.x-bw/2,by,bw,5);c.fillStyle=w.hp/w.max<.35?'#ef5350':'#5fc79a';c.fillRect(w.x-bw/2,by,bw*Math.max(0,w.hp/w.max),5);
  c.font='800 10px Montserrat,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#f5b400';c.fillText('★'.repeat(w.lv),w.x,by-7)}
function drawHorse(h){const im=img('horse');if(!im||!im.naturalWidth)return;const hh=96,ww=hh*im.naturalWidth/im.naturalHeight,k=1+(h.sp>0?.1*h.sp/.3:0);
  c.save();c.translate(h.x,h.y+Math.sin(t*2+h.ph)*3);c.rotate(Math.sin(t*1.5+h.ph)*.07);c.scale(-h.face*k,k);c.drawImage(im,-ww/2,-hh/2,ww,hh);c.restore()}

// ---- Bộ nhớ đệm hình (sprite): vẽ cá/xu/emoji/bóng 1 lần, sau đó chỉ drawImage → nhẹ máy
const FR=12;
function wagFr(ph,tt){const x=((tt*6+ph)/(2*Math.PI))%1;return Math.floor((x<0?x+1:x)*FR)%FR}
function whaleSpr(stage,st,fr,bl){
  const key=stage+st+fr+(bl?'b':'');let sp=SPR[key];if(sp)return sp;
  const s0=26+stage*9,w=Math.ceil(s0*3.8),h=Math.ceil(s0*2.5),pr=SQ,cv2=document.createElement('canvas');cv2.width=Math.ceil(w*pr);cv2.height=Math.ceil(h*pr);
  const X=cv2.getContext('2d');X.setTransform(pr,0,0,pr,0,0);const ox=w/2-s0*.15,oy=h/2,tt=t;t=0;
  whale({stage,hunger:st=='h'?100:0,dir:1,ph:fr/FR*Math.PI*2,spout:0,joy:100,rx:st=='a'?{k:'angry'}:null,bl:!!bl,vec:true},X,ox,oy,1);t=tt;
  return SPR[key]={cv:cv2,w,h,ox,oy}}
function emoSpr(e,sz0){const k=e+sz0;let s0=EM[k];if(s0)return s0;const pr=SQ,d=Math.ceil(sz0*1.5),cv2=document.createElement('canvas');cv2.width=cv2.height=Math.ceil(d*pr);
  const X=cv2.getContext('2d');X.setTransform(pr,0,0,pr,0,0);X.font=sz0+'px sans-serif';X.textAlign='center';X.textBaseline='middle';X.fillText(e,d/2,d/2);return EM[k]={cv:cv2,d}}
function drawEmo(e,x,y,sz0,X=c){const s0=emoSpr(e,sz0);X.drawImage(s0.cv,x-s0.d/2,y-s0.d/2,s0.d,s0.d)}
function bubSpr(r){r=Math.max(1,Math.round(r));let s0=BUB[r];if(s0)return s0;const pr=SQ,d=r*2+4,cv2=document.createElement('canvas');cv2.width=cv2.height=Math.ceil(d*pr);
  const X=cv2.getContext('2d');X.setTransform(pr,0,0,pr,0,0);X.translate(d/2,d/2);X.lineWidth=1.2;X.fillStyle='rgba(255,255,255,.10)';X.strokeStyle='rgba(255,255,255,.5)';X.beginPath();X.arc(0,0,r,0,7);X.fill();X.stroke();
  X.fillStyle='rgba(255,255,255,.75)';X.beginPath();X.arc(-r*.35,-r*.35,Math.max(.8,r*.22),0,7);X.fill();return BUB[r]={cv:cv2,d}}
function coinSpr(g){const k=g?'g':'s';if(CSP[k])return CSP[k];const pr=SQ,cv2=document.createElement('canvas');cv2.width=cv2.height=Math.ceil(36*pr);
  const X=cv2.getContext('2d');X.setTransform(pr,0,0,pr,0,0);X.translate(18,18);X.fillStyle=g?'#ffc400':'#d6dde6';X.strokeStyle=g?'#a87800':'#8895a5';X.lineWidth=2.5;X.beginPath();X.arc(0,0,16,0,7);X.fill();X.stroke();
  X.fillStyle=X.strokeStyle;X.font='bold 16px Montserrat,sans-serif';X.textAlign='center';X.textBaseline='middle';X.fillText('$',0,1);return CSP[k]=cv2}

function drawFish(f){
  if(IM.fish){whale(f);return}
  const rxk=f.rx&&f.rx.k,st=rxk=='angry'?'a':f.hunger>70?'h':'n',bl=Math.sin(t*.9+f.ph*3)>.97,sp=whaleSpr(f.stage,st,wagFr(f.ph,t),bl),sh=rxk=='shy'?.85:1;
  c.save();c.translate(f.x+(rxk=='angry'?Math.sin(t*50)*2.5:0),f.y);if(rxk=='love')c.rotate(Math.sin(t*14)*.22);c.scale(f.dir*sh,sh);c.drawImage(sp.cv,-sp.ox,-sp.oy,sp.w,sp.h);
  if(f.spout>0){const s=sz(f);c.strokeStyle='#bfe6ff';c.lineWidth=3;c.lineJoin='round';c.beginPath();c.moveTo(s*.1,-s*.9);c.lineTo(s*.1,-s*1.4);c.moveTo(s*.1,-s*1.4);c.quadraticCurveTo(s*-.1,-s*1.6,s*-.2,-s*1.35);c.moveTo(s*.1,-s*1.4);c.quadraticCurveTo(s*.3,-s*1.6,s*.4,-s*1.35);c.stroke()}
  c.restore();
}
function drawCoin(k){
  const im=IM[k.gold?'gold':'silver'],sx=k.rest?1:.35+.65*Math.abs(Math.cos(t*2.6+k.ph)),a=k.age>8?Math.max(0,1-(k.age-8)/2):1;
  c.globalAlpha=a;c.setTransform(DPR*sx,0,0,DPR,k.x*DPR,k.y*DPR);c.drawImage(im||coinSpr(k.gold),-18,-18,36,36);
}
function drawFx(){for(const f of fx){c.globalAlpha=Math.min(1,f.l*2.5);drawEmo(f.e,f.x,f.y-((f.m||.6)-f.l)*45,22)}c.globalAlpha=1}
function draw(){
  c.clearRect(0,0,W,H);
  for(const b of bubbles){const sp=bubSpr(b.r),x=b.x+Math.sin(t*.8+b.ph)*6;c.globalAlpha=Math.min(1,Math.max(0,b.y/(H*.12)));c.drawImage(sp.cv,x-sp.d/2,b.y-sp.d/2,sp.d,sp.d)}
  c.globalAlpha=1;
  for(const f of food){c.fillStyle=f.age>3?'#8a6b3a':'#ff8a4c';c.beginPath();c.arc(f.x,f.y,7,0,7);c.fill();c.fillStyle='#fff6';c.beginPath();c.arc(f.x-2,f.y-2,2.5,0,7);c.fill()}
  for(const cr of crabs)drawCrab(cr);
  for(const f of fish)drawFish(f);for(const h of horses)drawHorse(h);for(const w of swords)drawSword(w);for(const f of fish)drawMood(f);
  for(const k of coins)drawCoin(k);
  c.setTransform(DPR,0,0,DPR,0,0);c.globalAlpha=1;
  drawFx();drawSay();
  if(alien)drawAlien();
  drawDn();
}
