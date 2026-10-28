// ================= QUÁI VẬT / CHIẾN BINH =================
const MON={green:{n:'Quái xanh lá',hp:50,dmg:5,p:40,r:38,c1:'#7ed957',c2:'#3c8a1d',rw:60},blue:{n:'Quái xanh biển',hp:100,dmg:6,p:30,r:42,c1:'#5ab8f0',c2:'#1f6fa8',rw:120},purple:{n:'Quái tím',hp:200,dmg:6,p:20,r:48,c1:'#b07be0',c2:'#6a3da8',rw:240},red:{n:'Quái đỏ',hp:400,dmg:6,p:10,r:56,c1:'#ef6a5a',c2:'#a82d22',rw:480}};
const MK=['green','blue','purple','red'],TAPD=5,dn=[];let retTo='set',spane='snd';
function pickMon(){let r=Math.random()*100;for(const k of MK){r-=MON[k].p;if(r<0)return k}return'green'}
function spawnAlien(k){const m=MON[k];alien={kind:k,x:R(60,W-60),y:-50,hp:m.hp,max:m.hp,dmg:m.dmg,r:m.r,hit:0,eatT:4,atkT:1};say('⚠️ '+m.n+' xuất hiện! Chạm liên tục để đánh!')}
function killAlien(msg){const m=MON[alien.kind];S.coins+=m.rw;say(msg+'! +'+m.rw+' 🪙');alien=null;alienT=R(35,55)}
function dmgText(x,y,v,heal){dn.push({x,y,v,l:1,h:!!heal})}
function drawDn(){c.font='800 18px Montserrat,sans-serif';c.textAlign='center';c.textBaseline='middle';c.lineWidth=4;c.strokeStyle='rgba(255,255,255,.92)';c.lineJoin='round';
  for(const d of dn){c.globalAlpha=Math.min(1,d.l*2);const y=d.y-(1-d.l)*38,tx=(d.h?'+':'-')+d.v;c.fillStyle=d.h?'#2e9e5b':'#e53935';c.strokeText(tx,d.x,y);c.fillText(tx,d.x,y)}c.globalAlpha=1}
function drawMon(X,k,x,y,sc,tt){
  const m=MON[k],im=IM['m'+k],r=m.r*sc;X.save();X.translate(x,y);
  if(im){const z=r*2.5;X.drawImage(im,-z/2,-z/2,z,z)}
  else{
    const w=Math.sin(tt*8)*3*sc,e=r/38;X.fillStyle=m.c1;X.strokeStyle=m.c2;X.lineWidth=Math.max(2,3*sc);X.lineJoin='round';
    if(k=='red'){X.beginPath();X.moveTo(-r*.7,-r*.55);X.lineTo(-r*.85,-r*1.3);X.lineTo(-r*.25,-r*.9);X.closePath();X.moveTo(r*.7,-r*.55);X.lineTo(r*.85,-r*1.3);X.lineTo(r*.25,-r*.9);X.closePath();X.fill();X.stroke()}
    if(k=='purple'){X.beginPath();X.moveTo(-r*.4,-r*.9);X.lineTo(-r*.5,-r*1.3);X.moveTo(r*.4,-r*.9);X.lineTo(r*.5,-r*1.3);X.stroke();X.beginPath();X.arc(-r*.5,-r*1.3,r*.1,0,7);X.moveTo(r*.6,-r*1.3);X.arc(r*.5,-r*1.3,r*.1,0,7);X.fill()}
    if(k=='blue'){X.beginPath();X.moveTo(-r*.95,-r*.1);X.lineTo(-r*1.3,-r*.4);X.lineTo(-r*1.2,r*.3);X.closePath();X.moveTo(r*.95,-r*.1);X.lineTo(r*1.3,-r*.4);X.lineTo(r*1.2,r*.3);X.closePath();X.fill();X.stroke()}
    X.beginPath();X.arc(0,0,r,0,7);X.fill();X.stroke();
    for(let i=-1;i<=1;i++){X.beginPath();X.moveTo(i*r*.53,r*.84);X.lineTo(i*r*.53+w,r*1.36);X.stroke()}
    X.fillStyle='#fff';X.beginPath();X.arc(-13*e,-6*e,11*e,0,7);X.moveTo(24*e,-6*e);X.arc(13*e,-6*e,11*e,0,7);X.fill();
    X.fillStyle='#222';X.beginPath();X.arc(-11*e,-5*e,5*e,0,7);X.moveTo(20*e,-5*e);X.arc(15*e,-5*e,5*e,0,7);X.fill();
    if(k=='purple'){X.fillStyle='#fff';X.beginPath();X.arc(0,-r*.5,6*e,0,7);X.fill();X.fillStyle='#222';X.beginPath();X.arc(e,-r*.5,3*e,0,7);X.fill()}
    X.strokeStyle='#222';X.lineWidth=Math.max(1.5,2*sc);X.beginPath();X.moveTo(-10*e,16*e);X.lineTo(-4*e,12*e);X.lineTo(4*e,16*e);X.lineTo(10*e,12*e);X.stroke();
    if(k=='red'){X.beginPath();X.moveTo(-22*e,-18*e);X.lineTo(-5*e,-12*e);X.moveTo(22*e,-18*e);X.lineTo(5*e,-12*e);X.stroke()}
  }
  X.restore();
}
function drawAlien(){
  const a=alien;drawMon(c,a.kind,a.x+(a.hit>0?R(-4,4):0),a.y,1,t);
  const w=Math.max(60,a.r*1.7),y=a.y-a.r-24;c.fillStyle='#0007';c.fillRect(a.x-w/2,y,w,8);c.fillStyle='#ff4d4d';c.fillRect(a.x-w/2,y,w*Math.max(0,a.hp/a.max),8);
  c.font='800 10px Montserrat,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';c.strokeStyle='#0008';c.lineWidth=3;
  const tx=Math.ceil(a.hp)+'/'+a.max;c.strokeText(tx,a.x,y-8);c.fillText(tx,a.x,y-8);
}
