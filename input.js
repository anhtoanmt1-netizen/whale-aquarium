// ================= CHẠM MÀN HÌNH =================
let ptr=null;
function fishAt(x,y,m=1.25){let b=null,bd=1e9;for(const f of fish){const d=Math.hypot(f.x-x,f.y-y);if(d<sz(f)*m&&d<bd){bd=d;b=f}}return b}
cv.addEventListener('pointerdown',e=>{
  const x=e.clientX,y=e.clientY;
  for(const k of coins){if(!k.dead&&Math.hypot(k.x-x,k.y-y)<34){S.coins+=k.v;k.dead=true;ting();return}}
  if(alien&&Math.hypot(alien.x-x,alien.y-y)<alien.r+18){alien.hit=.2;alien.hp-=TAPD;dmgText(x,y-12,TAPD);if(alien.hp<=0)killAlien('Bạn đã diệt '+MON[alien.kind].n);return}
  ptr={x,y,moved:0,pet:false};
});
cv.addEventListener('pointermove',e=>{
  if(!ptr)return;const x=e.clientX,y=e.clientY,d=Math.hypot(x-ptr.x,y-ptr.y);ptr.moved+=d;ptr.x=x;ptr.y=y;
  if(ptr.moved>16){const f=fishAt(x,y,1.5);if(f){ptr.pet=true;petFish(f,d)}}
});
function endPtr(e){
  if(!ptr)return;const p=ptr;ptr=null;
  if(e.type=='pointercancel'||p.pet||p.moved>16)return;
  const f=fishAt(p.x,p.y);if(f){react(f,p.x,p.y);return}
  if(food.length<S.lv+2+Math.floor(fish.length/8))food.push({x:p.x,y:Math.max(p.y,TOP),age:0});
}
cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',endPtr);
