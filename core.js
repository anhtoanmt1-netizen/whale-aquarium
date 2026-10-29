// Làm sạch dữ liệu lưu (tránh lỗi nếu dữ liệu cũ/hỏng làm game đứng)
function sanitizeSave(){
  const n=(v,d)=>Number.isFinite(+v)&&v!==null&&v!==''?+v:d,arr=v=>Array.isArray(v)?v.filter(o=>o&&typeof o=='object'):[];
  S.coins=Math.max(0,n(S.coins,50));S.lv=Math.min(4,Math.max(1,n(S.lv,1)));S.vol=Math.min(1,Math.max(0,n(S.vol,.5)));
  S.fish=arr(S.fish).slice(0,50);if(!S.fish.length)S.fish=[{stage:0,hunger:0},{stage:0,hunger:0}];
  for(const f of S.fish){f.stage=Math.min(2,Math.max(0,Math.floor(n(f.stage,0))));f.hunger=Math.min(120,Math.max(0,n(f.hunger,0)));if(f.joy!=null)f.joy=Math.min(100,Math.max(0,n(f.joy,70)));if(f.born!=null)f.born=n(f.born,Date.now());if(f.name!=null)f.name=String(f.name).slice(0,14)}
  if(S.warriors!=null)S.warriors=arr(S.warriors).slice(0,50);if(S.supports!=null)S.supports=arr(S.supports).slice(0,50);
  for(const w of [].concat(S.warriors||[],S.supports||[])){w.lv=Math.min(5,Math.max(1,Math.floor(n(w.lv,1))));if(w.hp!=null)w.hp=Math.max(1,n(w.hp,50));if(w.born!=null)w.born=n(w.born,Date.now());if(w.spent!=null)w.spent=Math.max(0,n(w.spent,300));if(w.name!=null)w.name=String(w.name).slice(0,14)}
  S.crabs=Math.min(5,Math.max(0,Math.floor(n(S.crabs,0))));S.cap=Math.min(50,Math.max(10,Math.floor(n(S.cap,10))));
}
const cv=document.getElementById('c'),c=cv.getContext('2d'),$=id=>document.getElementById(id);
const PERFS={eco:{fps:30,dpr:1,spk:6,bub:8,fb:10,ray:3},bal:{fps:45,dpr:1.5,spk:18,bub:18,fb:24,ray:5},high:{fps:60,dpr:2,spk:30,bub:26,fb:40,ray:5}};
let PF=PERFS.eco,SQ=1;const SPR={},EM={},CSP={},BUB={};
let W,H,DPR,TOP=110;
function resize(){const nd=Math.min(devicePixelRatio||1,PF.dpr);if(nd!==DPR){DPR=nd;SQ=Math.min(DPR,1.5);for(const o of[SPR,EM,CSP,BUB])for(const k in o)delete o[k]}W=innerWidth;H=innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);c.setTransform(DPR,0,0,DPR,0,0);TOP=$('hud').offsetHeight+6}
addEventListener('resize',resize);resize();
const R=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>a>b?(a+b)/2:Math.max(a,Math.min(b,v));
const MAXF=50;

let S=JSON.parse(localStorage.getItem('whale1')||'null')||{coins:50,lv:1,fish:[{stage:0,hunger:0},{stage:0,hunger:0}]};
S.crabs=S.crabs||0;S.swords=S.swords||0;S.horses=S.horses||0;S.chat=S.chat!==false;S.flip=!!S.flip;S.cap=Math.min(MAXF,Math.max(S.cap||10,S.fish.length));S.snd=S.snd||'wave';S.vol=S.vol==null?.5:S.vol;S.perf=PERFS[S.perf]?S.perf:'eco';PF=PERFS[S.perf];sanitizeSave();resize();
let fish=[],food=[],coins=[],bubbles=[],crabs=[],swords=[],horses=[],fx=[],alien=null,alienT=40,t=0,msgT=0,msgTop=-1,hudT=0;
const IM={},DEF={},img=n=>IM[n]||DEF[n];for(const n of['crab','sword','horse']){DEF[n]=new Image();DEF[n].src=n+'.png'}

const sz=f=>26+f.stage*9;
function bnd(f){const s=sz(f);return{x0:s*1.5,x1:W-s*1.5,y0:TOP+s*1.3,y1:H-s-12}}
function newFish(stage=0,hunger=0,m={}){const f={x:0,y:0,vx:R(-30,30),vy:0,dir:1,stage,hunger,eaten:0,coinT:R(4,8),spout:0,ph:R(0,6),id:m.id||('f'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)),name:m.name||NAMES[Math.floor(Math.random()*NAMES.length)],sex:m.sex||(Math.random()<.5?'m':'f'),born:m.born||Date.now(),joy:m.joy==null?R(65,90):m.joy,say:null,rep:null,rx:null,freeze:0,petAcc:0};const b=bnd(f);f.x=R(b.x0,b.x1);f.y=R(b.y0,b.y1);f.tx=R(b.x0,b.x1);f.ty=R(b.y0,b.y1);f.x=cl(f.x,b.x0,b.x1);f.y=cl(f.y,b.y0,b.y1);return f}
function newCrab(){return{x:R(40,W-40),dir:1,vx:0,tx:R(40,W-40),ph:R(0,6)}}
const NAMES=['Bông','Mướp','Bơ','Su Su','Nụ','Chíp','Mochi','Pudding','Bắp','Heo','Cốm','Xíu','Mít','Na','Tèo','Bé Ú','Kem','Bánh Bao','Khoai','Sữa','Cún','Gấu','Đậu','Mận','Ốc','Tép','Bin','Sóc','Nấm','Xoài'];
S.fish.forEach(f=>fish.push(newFish(f.stage,f.hunger,f)));
const WB={dmg:5,hp:50,buy:300,up:200},WNAMES=['Kiếm Sĩ','Thần Tốc','Sấm Sét','Bão Táp','Tia Chớp','Hắc Phong','Thiết Giáp','Lôi Đình','Hỏa Long','Băng Tâm'];
function wStat(lv){let d=WB.dmg,h=WB.hp;for(let i=1;i<lv;i++){d=Math.ceil(d*1.2);h=Math.ceil(h*1.2)}return{d,h}}
function wUpCost(lv){return Math.ceil(WB.up*Math.pow(1.2,lv-1)-1e-9)}
function newSword(m={}){const lv=m.lv||1,st=wStat(lv);return{id:m.id||('w'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)),name:m.name||WNAMES[Math.floor(Math.random()*WNAMES.length)],born:m.born||Date.now(),lv,max:st.h,hp:m.hp==null?st.h:Math.max(1,Math.min(m.hp,st.h)),dmg:st.d,spent:m.spent||WB.buy,x:R(80,W-80),y:R(TOP+60,H-100),vx:R(-30,30),vy:0,hx:-1,hy:0,tx:R(80,W-80),ty:R(TOP+60,H-100),cd:0,lunge:0,did:false,hurt:0,dead:false,ph:R(0,6)}}
const SB={hp:50,buy:250,up:150},SNAMES=['Hải Mã','Sen','Mận','Gió','Suối','Sao','Mây','Nắng','Trăng','Sương'];
const SK=[null,{n:1,hs:0,hw:0},{n:2,hs:0,hw:0},{n:3,hs:0,hw:0},{n:3,hs:2,hw:2},{n:3,hs:2,hw:5}];
const SKT=[null,'🍤 Phun 1 viên thức ăn','🍤 Phun 2 viên thức ăn','🍤 Phun 3 viên thức ăn','🍤 3 viên + 💚 hồi 2 máu/giây cho Chiến Binh & Support bị thương','🍤 3 viên + 💚 hồi 2 máu/giây cho Support, 5 máu/giây cho Chiến Binh bị thương'];
function sUpCost(lv){return Math.ceil(SB.up*Math.pow(1.2,lv-1)-1e-9)}
function newHorse(m={}){return{id:m.id||('s'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)),name:m.name||SNAMES[Math.floor(Math.random()*SNAMES.length)],born:m.born||Date.now(),lv:m.lv||1,max:SB.hp,hp:m.hp==null?SB.hp:Math.max(1,Math.min(m.hp,SB.hp)),spent:m.spent||SB.buy,
  x:R(60,W-60),y:R(TOP+60,H*.6),vx:0,vy:0,face:-1,tx:R(60,W-60),ty:R(TOP+60,H*.6),spitT:R(2,4),sp:0,ph:R(0,6),hurt:0,dead:false,heal:0,healT:0,beam:null}}
for(let i=0;i<S.crabs;i++)crabs.push(newCrab());
if(!S.warriors)S.warriors=Array.from({length:S.swords||0},()=>({}));
S.wcap=Math.min(50,Math.max(S.wcap||5,S.warriors.length));
for(const m of S.warriors)swords.push(newSword(m));
if(!S.supports)S.supports=Array.from({length:S.horses||0},()=>({}));
S.scap=Math.min(50,Math.max(S.scap||5,S.supports.length));
for(const m of S.supports)horses.push(newHorse(m));
function save(){S.supports=horses.map(h=>({id:h.id,name:h.name,born:h.born,lv:h.lv,hp:Math.ceil(h.hp),spent:h.spent}));S.warriors=swords.map(w=>({id:w.id,name:w.name,born:w.born,lv:w.lv,hp:Math.ceil(w.hp),spent:w.spent}));S.fish=fish.map(f=>({stage:f.stage,hunger:Math.floor(f.hunger),joy:Math.floor(f.joy),name:f.name,sex:f.sex,born:f.born,id:f.id}));try{localStorage.setItem('whale1',JSON.stringify(S))}catch(e){}}
setInterval(save,4000);
function say(m){const e=$('msg');e.textContent=m;msgT=2.8}
