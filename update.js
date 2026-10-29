// ================= CẬP NHẬT =================
let tingT=0;
function update(dt){
  t+=dt;tingT-=dt;
  if(msgT>0){msgT-=dt;if(msgT<=0)$('msg').textContent=''}
  if(msgTop!==TOP){msgTop=TOP;$('msg').style.top=(TOP+4)+'px'}
  for(const f of food){f.x=cl(f.x+(f.vx||0)*dt,10,W-10);f.vx=(f.vx||0)*Math.pow(.15,dt);const vy=f.vy||0;f.vy=vy*Math.pow(.05,dt);if(f.y<H-30)f.y+=(45+vy)*dt;else{f.age+=dt;if(f.age>6)f.dead=true}}
  food=food.filter(f=>!f.dead);
  for(const f of fish){
    const s=sz(f),b=bnd(f);
    if(f.say){f.say.l-=dt;if(f.say.l<=0)f.say=null}
    if(f.rep){f.rep.d-=dt;if(f.rep.d<=0){f.say={t:f.rep.t,l:3.2};f.rep=null}}
    if(f.rx){f.rx.t-=dt;if(f.rx.t<=0)f.rx=null}
    f.hunger+=dt*2.2;f.joy=Math.max(0,f.joy-dt*(f.hunger>70?.5:.25));f.spout-=dt;if(Math.random()<dt*.15)f.spout=1;
    if(Math.random()<dt*.12&&bubbles.length<PF.fb)bubbles.push({x:f.x+f.dir*s*1.1,y:f.y-s*.2,r:R(2,4.5),ph:R(0,6)});
    let target=null,best=1e9;
    if(f.hunger>35&&!(f.rx&&f.rx.k=='flee'))for(const o of food){const d=Math.hypot(o.x-f.x,o.y-f.y);if(d<best){best=d;target=o}}
    if(target){f.tx=target.x;f.ty=target.y}
    else if(!f.rx&&(Math.hypot(f.tx-f.x,f.ty-f.y)<20||Math.random()<dt*.1)){f.tx=R(b.x0,b.x1);f.ty=R(b.y0,b.y1)}
    f.tx=cl(f.tx,b.x0,b.x1);f.ty=cl(f.ty,b.y0,b.y1);
    const dx=f.tx-f.x,dy=f.ty-f.y,d=Math.hypot(dx,dy)||1;let sp=(f.rx&&RXS[f.rx.k])||(target?110:45);if(f.freeze>0){f.freeze-=dt;sp*=.12}
    f.vx+=(dx/d*sp-f.vx)*dt*2;f.vy+=(dy/d*sp-f.vy)*dt*2;
    f.x+=f.vx*dt;f.y+=f.vy*dt;
    const nx=cl(f.x,b.x0,b.x1),ny=cl(f.y,b.y0,b.y1);if(nx!=f.x)f.vx*=-.3;if(ny!=f.y)f.vy*=-.3;f.x=nx;f.y=ny;
    if(Math.abs(f.vx)>8)f.dir=f.vx>0?1:-1;
    if(target&&Math.hypot(target.x-f.x,target.y-f.y)<s*1.3&&!target.dead){target.dead=true;f.hunger=0;f.joy=Math.min(100,f.joy+2);f.eaten++;if(f.eaten>=4&&f.stage<2){f.stage++;f.eaten=0;say('Cá voi lớn lên! ✨')}}
    if(f.stage>0&&f.joy>0){f.coinT-=dt*(f.joy<50?.5:1);if(f.coinT<=0){f.coinT=R(7,11);coins.push({x:f.x,y:f.y,v:f.stage==1?15:40,age:0,vy:-60,ph:R(0,6),rest:0,gold:f.stage==2})}}
    if(f.hunger>110){f.dead=true;say('Một chú cá đói quá 😢')}
  }
  fish=fish.filter(f=>!f.dead);
  chat(dt);
  if(!fish.length){fish.push(newFish());say('Tặng bạn một chú cá mới 🐋')}
  for(const k of coins){k.x=cl(k.x,16,W-16);if(!k.rest){k.vy+=(52-k.vy)*Math.min(1,dt*1.6);k.y+=k.vy*dt;k.x+=Math.sin(t*2+k.ph)*16*dt;if(k.y>=H-26){k.y=H-26;k.rest=1;k.age=0}}else k.age+=dt;if(k.age>10)k.dead=true}
  for(const cr of crabs){
    let tg=null,b=1e9;for(const k of coins){const d=Math.abs(k.x-cr.x)+(k.y<H-100?200:0);if(!k.dead&&d<b){b=d;tg=k}}
    if(tg)cr.tx=tg.x;else if(Math.abs(cr.tx-cr.x)<10||Math.random()<dt*.15)cr.tx=R(40,W-40);
    cr.tx=cl(cr.tx,30,W-30);
    const dx=cr.tx-cr.x;cr.vx+=((Math.abs(dx)>6?Math.sign(dx)*(tg?130:45):0)-cr.vx)*dt*4;cr.x=cl(cr.x+cr.vx*dt,30,W-30);if(Math.abs(cr.vx)>8)cr.dir=cr.vx>0?1:-1;
    for(const k of coins)if(!k.dead&&Math.abs(k.x-cr.x)<36&&k.y>H-90){S.coins+=k.v;k.dead=true;if(tingT<=0){ting();tingT=.25}}
  }
  coins=coins.filter(k=>!k.dead);
  alienT-=dt;
  if(!alien&&alienT<=0&&fish.length)spawnAlien(pickMon());
  if(alien){
    const a=alien;a.hit-=dt;a.atkT-=dt;
    let n=null,b=1e9,isW=false;
    for(const w of swords){const d=Math.hypot(w.x-a.x,w.y-a.y);if(d<b){b=d;n=w;isW=true}}
    let bf=1e9,nf=null;for(const f of fish){const d=Math.hypot(f.x-a.x,f.y-a.y);if(d<bf){bf=d;nf=f}}
    if(!isW||bf<b*.6){n=nf;b=bf;isW=false}
    if(n){const d=b||1,sp=a.kind=='red'?48:55;a.x=cl(a.x+(n.x-a.x)/d*sp*dt,40,W-40);a.y=Math.min(H-40,a.y+(n.y-a.y)/d*sp*dt);
      if(isW){if(b<a.r+48&&a.atkT<=0){a.atkT=1.2;n.hp-=a.dmg;n.hurt=.3;dmgText(n.x,n.y-26,a.dmg);if(n.hp<=0){n.dead=true;say('⚔️ '+n.name+' đã hy sinh 😢')}}}
      else if(b<a.r+14){a.eatT-=dt;if(a.eatT<=0){n.dead=true;a.eatT=4.5;say('Cá bị ăn mất! 😱')}}}
  }
  // chiến binh: lao đâm quái vật
  for(const w of swords){
    w.cd-=dt;w.hurt-=dt;
    if(alien){
      const a=alien,dx=a.x-w.x,dy=a.y-w.y,d=Math.hypot(dx,dy)||1;
      if(w.lunge>0){w.lunge-=dt;
        if(!w.did&&d<a.r+30){w.did=true;a.hp-=w.dmg;a.hit=.3;dmgText(a.x+R(-14,14),a.y-a.r*.6,w.dmg);fx.push({x:a.x,y:a.y,l:.5,e:'💥'});
          if(a.hp<=0)killAlien(w.name+' đã hạ '+MON[a.kind].n)}
      }else{
        w.vx+=(dx/d*270-w.vx)*dt*3;w.vy+=(dy/d*270-w.vy)*dt*3;
        if(d<a.r+130&&w.cd<=0){w.lunge=.3;w.cd=1;w.did=false;w.vx=dx/d*580;w.vy=dy/d*580;fx.push({x:w.x,y:w.y-34,l:.6,e:'💢'})}
      }
    }else{
      w.lunge=0;w.hp=Math.min(w.max,w.hp+dt*.8);
      if(Math.hypot(w.tx-w.x,w.ty-w.y)<30||Math.random()<dt*.08){w.tx=R(60,W-60);w.ty=R(TOP+50,H-70)}
      const dx=w.tx-w.x,dy=w.ty-w.y,d=Math.hypot(dx,dy)||1;w.vx+=(dx/d*75-w.vx)*dt*1.5;w.vy+=(dy/d*75-w.vy)*dt*1.5;
    }
    w.x+=w.vx*dt;w.y+=w.vy*dt;
    const nx=cl(w.x,50,W-50),ny=cl(w.y,TOP+35,H-55);if(nx!=w.x)w.vx*=-.4;if(ny!=w.y)w.vy*=-.4;w.x=nx;w.y=ny;
    const sp=Math.hypot(w.vx,w.vy);if(sp>15){const k=Math.min(1,dt*10);w.hx+=(w.vx/sp-w.hx)*k;w.hy+=(w.vy/sp-w.hy)*k}
  }
  swords=swords.filter(w=>!w.dead);
  // cá ngựa: phun thức ăn
  for(const h of horses){
    if(Math.hypot(h.tx-h.x,h.ty-h.y)<15||Math.random()<dt*.08){h.tx=R(60,W-60);h.ty=R(TOP+50,H*.65)}
    const dx=h.tx-h.x,dy=h.ty-h.y,d=Math.hypot(dx,dy)||1;h.vx+=(dx/d*28-h.vx)*dt;h.vy+=(dy/d*28-h.vy)*dt;
    h.x=cl(h.x+h.vx*dt,45,W-45);h.y=cl(h.y+h.vy*dt,TOP+50,H-90);if(Math.abs(h.vx)>6)h.face=h.vx>0?1:-1;
    h.sp-=dt;h.spitT-=dt;
    if(h.spitT<=0){h.spitT=R(3.5,6);
      if(food.length<16&&fish.some(f=>f.hunger>30)){
        const im=img('horse'),hh=96,ww=im&&im.naturalWidth?hh*im.naturalWidth/im.naturalHeight:62,mx=h.x+h.face*ww*.46,my=h.y-hh*.13;
        food.push({x:mx,y:my,vx:h.face*75,vy:-55,age:0});h.sp=.3;
        for(let i=0;i<3;i++)bubbles.push({x:mx,y:my,r:R(1.5,3),ph:R(0,6)});fx.push({x:mx+h.face*14,y:my-6,l:.4,e:'💦'})}}
  }
  for(let i=fx.length-1;i>=0;i--){fx[i].l-=dt;if(fx[i].l<=0)fx.splice(i,1)}
  for(let i=dn.length-1;i>=0;i--){dn[i].l-=dt*1.1;if(dn[i].l<=0)dn.splice(i,1)}
  for(let i=bubbles.length-1;i>=0;i--){const b=bubbles[i];b.y-=(14+b.r*5)*dt;b.x+=Math.sin(t*1.3+b.ph)*10*dt;
    if(b.y<-10){if(b.amb){b.y=H+10;b.x=R(0,W);b.r=R(2,9)}else bubbles.splice(i,1)}}
  hudT-=dt;if(hudT<=0){hudT=.25;hud()}
}
