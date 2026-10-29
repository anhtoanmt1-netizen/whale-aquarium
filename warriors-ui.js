// ---- Cá Chiến Binh: danh sách, nâng cấp, bán
const wslotCost=()=>400+200*((S.wcap-5)/5);
function wUp(w){if(w.lv>=5)return;const cost=wUpCost(w.lv);if(S.coins<cost){say('Không đủ xu để nâng cấp 🪙');return}
  S.coins-=cost;w.spent+=cost;const old=w.max;w.lv++;const st=wStat(w.lv);w.max=st.h;w.dmg=st.d;w.hp+=w.max-old;say(w.name+' lên Lv '+w.lv+'! ⭐');fx.push({x:w.x,y:w.y-30,l:.8,m:.8,e:'⭐'})}
function openW(){renderW();$('wlist').classList.add('on')}
function renderW(){
  let h='';
  for(const w of swords)h+=`<div class="fc wc" data-id="${w.id}"><canvas class="fth" width="96" height="72" data-id="${w.id}"></canvas><div class="fi"><div class="fr"><input class="nm" maxlength="14" value="${esc(w.name)}" aria-label="Tên chiến binh"><span class="stars"></span></div><div class="fa">🎂 Tuổi: <b class="ag"></b></div><div class="fa">⚔️ Sát thương: <b class="dm"></b> <span class="nx"></span></div><div class="bar"><label>❤️ Máu</label><span class="bg"><i class="b1"></i></span><em class="v1"></em></div></div><div class="wb"><button class="upb" data-up="${w.id}"></button><button class="sell" data-wsell="${w.id}"></button></div></div>`;
  $('wcards').innerHTML=h||'<p class="ds" style="text-align:center;padding:14px">Chưa có chiến binh nào. Hãy mua ở 🛒 Cửa hàng!</p>';updW(true);
}
function updW(skip){
  if(!$('wlist').classList.contains('on'))return;
  const cards=[...$('wcards').querySelectorAll('.wc')];
  if(!skip&&(cards.length!==swords.length||cards.some(x=>!swords.find(w=>w.id==x.dataset.id)))){const a=document.activeElement;if(!(a&&a.classList&&a.classList.contains('nm')))renderW();return}
  $('wlc').textContent='⚔️ '+swords.length+'/'+S.wcap;$('wslotp').textContent=S.wcap>=MAXF?'Tối đa':'🪙 '+wslotCost();$('wslotb').disabled=S.wcap>=MAXF||S.coins<wslotCost();
  for(const x of cards){const w=swords.find(o=>o.id==x.dataset.id),q=k=>x.querySelector(k);if(!w)continue;
    const nxt=w.lv<5?wStat(w.lv+1):null,pct=Math.max(0,Math.min(100,w.hp/w.max*100));
    q('.stars').textContent='★'.repeat(w.lv)+'☆'.repeat(5-w.lv);q('.ag').textContent=ageTxt(w.born);q('.dm').textContent=w.dmg;
    q('.nx').textContent=nxt?'→ Lv'+(w.lv+1)+': ⚔️'+nxt.d+' ❤️'+nxt.h:'(Lv tối đa)';
    q('.b1').style.width=pct+'%';q('.b1').style.background=pct<35?'#ef7a6a':'#5fc79a';q('.v1').textContent=Math.ceil(w.hp)+'/'+w.max;
    const u=q('.upb');if(w.lv>=5){u.innerHTML='⭐ Level<br>tối đa';u.disabled=true}else{const cst=wUpCost(w.lv);u.innerHTML='⬆️ Nâng cấp<br>🪙 '+cst;u.disabled=S.coins<cst}
    q('.sell').innerHTML='💰 Bán<br>🪙 '+Math.round(w.spent*.8);
  }
}
setInterval(updW,500);
function drawWThumbs(){
  if(!$('wlist').classList.contains('on'))return;const im=img('sword');if(!im||!im.naturalWidth)return;
  for(const cvs of document.querySelectorAll('#wcards .fth')){
    const w=swords.find(o=>o.id==cvs.dataset.id);if(!w)continue;const x=cvs.getContext('2d'),cw=cvs.width,ch=cvs.height;x.clearRect(0,0,cw,ch);
    const ww=76,hh=ww*im.naturalHeight/im.naturalWidth,ph=Math.cos(t*.9+w.ph);
    x.save();x.translate(cw/2+Math.sin(t*.9+w.ph)*6,ch/2+Math.sin(t*2+w.ph)*3);if(ph>=0)x.scale(-1,1);x.drawImage(im,-ww/2,-hh/2,ww,hh);x.restore();
  }
}
setInterval(drawWThumbs,100);
$('wcards').addEventListener('click',e=>{
  const u=e.target.closest('[data-up]');if(u){const w=swords.find(o=>o.id==u.dataset.up);if(w)wUp(w);updW(true);return}
  const b=e.target.closest('[data-wsell]');if(!b)return;const w=swords.find(o=>o.id==b.dataset.wsell);if(!w)return;
  const v=Math.round(w.spent*.8),id=w.id;
  cfAct=()=>{const i=swords.findIndex(o=>o.id==id);if(i>=0){S.coins+=v;say('Đã bán '+swords[i].name+' 👋 +'+v+' 🪙');swords.splice(i,1);save()}renderW()};
  $('cft').innerHTML=`Bán <b>${esc(w.name)}</b> (Lv ${w.lv}) và nhận lại <b>🪙 ${v}</b> (80% tổng giá trị)?<br><small style="color:#6f8aa3">Bạn sẽ không lấy lại được chiến binh này.</small>`;$('confirm').classList.add('on')});
$('wcards').addEventListener('change',e=>{const i=e.target.closest('.nm');if(!i)return;const w=swords.find(o=>o.id==i.closest('.wc').dataset.id);if(!w)return;const v=i.value.trim().slice(0,14);if(v)w.name=v;else i.value=w.name;save()});
$('wcards').addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.classList.contains('nm'))e.target.blur()});
$('wslotb').onclick=()=>$('wslot').onclick();
$('cntw').onclick=openW;$('c_sword').onclick=e=>{e.stopPropagation();openW()};
$('wlclose').onclick=()=>$('wlist').classList.remove('on');
$('wlist').addEventListener('pointerdown',e=>{if(e.target==$('wlist'))$('wlist').classList.remove('on')});
