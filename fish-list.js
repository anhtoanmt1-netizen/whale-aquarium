// ---- Danh sách cá
const price=f=>[50,100,160][f.stage],esc=v=>String(v).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const TH={};let tp=null,sellId=null,cfAct=null;
function ageTxt(b){const m=Math.floor((Date.now()-b)/60000);if(m<1)return'Vừa mua';if(m<60)return m+' phút';const h=Math.floor(m/60);if(h<24)return h+' giờ '+(m%60)+' phút';return Math.floor(h/24)+' ngày '+(h%24)+' giờ'}
function openList(){renderList();$('flist').classList.add('on')}
function renderList(){
  let h='';
  for(const f of fish)h+=`<div class="fc ${f.sex=='m'?'ml':'fl'}" data-id="${f.id}"><canvas class="fth" width="96" height="72" data-id="${f.id}"></canvas><div class="fi"><div class="fr"><input class="nm" maxlength="14" value="${esc(f.name)}" aria-label="Tên cá"><span class="sx">${f.sex=='m'?'♂':'♀'}</span></div><div class="fa">🎂 Tuổi: <b class="ag"></b> · Cấp <b class="lv"></b></div><div class="bar"><label>🍤 No</label><span class="bg"><i class="b1"></i></span><em class="v1"></em></div><div class="bar"><label>💗 Vui</label><span class="bg"><i class="b2"></i></span><em class="v2"></em></div><div class="fs"></div></div><button class="sell" data-sell="${f.id}">💰 Bán<br>${price(f)}</button></div>`;
  $('fcards').innerHTML=h;updCards(true);
}
function updCards(skip){
  if(!$('flist').classList.contains('on'))return;
  const cards=[...$('fcards').children];
  if(!skip&&(cards.length!==fish.length||cards.some(x=>!fish.find(f=>f.id==x.dataset.id)))){const a=document.activeElement;if(!(a&&a.classList&&a.classList.contains('nm')))renderList();return}
  $('flc').textContent='🐋 '+fish.length+'/'+S.cap;
  for(const x of cards){const f=fish.find(o=>o.id==x.dataset.id),q=k=>x.querySelector(k);
    const full=Math.max(0,Math.min(100,100-f.hunger/1.1)),joy=Math.round(f.joy);
    q('.ag').textContent=ageTxt(f.born);q('.lv').textContent=f.stage+1;
    q('.b1').style.width=full+'%';q('.b1').style.background=full<35?'#ef7a6a':'#5fc79a';q('.v1').textContent=Math.round(full)+'%';
    q('.b2').style.width=joy+'%';q('.b2').style.background=joy<50?'#f0a06a':'#f08ab0';q('.v2').textContent=joy+'%';
    x._ct=(x._ct||0)-.5;if(!x._cs||x._ct<=0){x._cs=pk(SOLO).replace('{n}',pk(fish).name);x._ct=R(3,6)}
    q('.fs').textContent='💬 '+(f.say?f.say.t:x._cs);
  }
}
setInterval(updCards,500);
function drawThumbs(){
  if(!$('flist').classList.contains('on'))return;
  for(const cvs of document.querySelectorAll('#fcards .fth')){
    const f=fish.find(o=>o.id==cvs.dataset.id);if(!f)continue;const rc=cvs.getBoundingClientRect();if(rc.bottom<0||rc.top>innerHeight)continue;const x=cvs.getContext('2d'),w=cvs.width,h=cvs.height;
    x.clearRect(0,0,w,h);
    const g={stage:f.stage,hunger:f.hunger,dir:Math.cos(t*.8+f.ph)>=0?1:-1,ph:f.ph,spout:0,joy:f.joy};
    const cx=w/2+Math.sin(t*.8+f.ph)*8,cy=h/2+4+Math.sin(t*2+f.ph)*3,kk=Math.min(1,26/sz(f));
    if(IM.fish)whale(g,x,cx,cy,kk);else{const sp=whaleSpr(f.stage,f.hunger>70?'h':'n',wagFr(f.ph,t),false);x.save();x.translate(cx,cy);x.scale(g.dir*kk,kk);x.drawImage(sp.cv,-sp.ox,-sp.oy,sp.w,sp.h);x.restore()}
    const hs=TH[f.id];if(hs){x.font='16px sans-serif';x.textAlign='center';for(let i=hs.length-1;i>=0;i--){const o=hs[i];o.l-=.066;if(o.l<=0){hs.splice(i,1);continue}x.globalAlpha=Math.min(1,o.l*2.5);x.fillText('💗',o.x,o.y-(.9-o.l)*40)}x.globalAlpha=1}
  }
}
setInterval(drawThumbs,100);
$('fcards').addEventListener('pointerdown',e=>{const th=e.target.closest('.fth');if(th){tp={id:th.dataset.id,x:e.clientX,y:e.clientY,acc:0};try{th.setPointerCapture(e.pointerId)}catch(_){}}});
$('fcards').addEventListener('pointermove',e=>{if(!tp)return;tp.acc+=Math.hypot(e.clientX-tp.x,e.clientY-tp.y);tp.x=e.clientX;tp.y=e.clientY;
  if(tp.acc>=45){tp.acc-=45;const f=fish.find(o=>o.id==tp.id);if(f){f.joy=Math.min(100,f.joy+4);f.freeze=.4;(TH[f.id]=TH[f.id]||[]).push({x:R(24,72),y:46,l:.9})}}});
const tpEnd=()=>{tp=null};$('fcards').addEventListener('pointerup',tpEnd);$('fcards').addEventListener('pointercancel',tpEnd);
$('fcards').addEventListener('change',e=>{const i=e.target.closest('.nm');if(!i)return;const f=fish.find(o=>o.id==i.closest('.fc').dataset.id);if(!f)return;const v=i.value.trim().slice(0,14);if(v)f.name=v;else i.value=f.name;save()});
$('fcards').addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.classList.contains('nm'))e.target.blur()});
$('fcards').addEventListener('click',e=>{
  const b=e.target.closest('[data-sell]');if(!b)return;const f=fish.find(o=>o.id==b.dataset.sell);if(!f)return;
  if(fish.length<=1){say('Hồ cần ít nhất 1 chú cá 🐋');return}
  sellId=f.id;cfAct=()=>{const i=fish.findIndex(o=>o.id==sellId);if(i>=0&&fish.length>1){S.coins+=price(fish[i]);say('Đã bán '+fish[i].name+' 👋 +'+price(fish[i])+' 🪙');fish.splice(i,1);save()}renderList()};$('cft').innerHTML=`Bán <b>${esc(f.name)}</b> (${f.sex=='m'?'♂':'♀'}, cấp ${f.stage+1}) với giá <b>🪙 ${price(f)}</b>?<br><small style="color:#6f8aa3">Bạn sẽ không lấy lại được chú cá này.</small>`;$('confirm').classList.add('on')});
$('cfno').onclick=()=>$('confirm').classList.remove('on');
$('cfyes').onclick=()=>{const f=cfAct;cfAct=null;$('confirm').classList.remove('on');if(f)f()};
$('cnt').onclick=openList;$('flclose').onclick=()=>$('flist').classList.remove('on');
$('flist').addEventListener('pointerdown',e=>{if(e.target==$('flist'))$('flist').classList.remove('on')});
$('confirm').addEventListener('pointerdown',e=>{if(e.target==$('confirm'))$('confirm').classList.remove('on')});
$('coins').onclick=()=>say('🪙 Xu dùng để mua cá, cua, thức ăn… Chạm xu đang rơi để nhặt!');
