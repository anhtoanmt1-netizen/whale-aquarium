// ---- Cá Support: danh sách, nâng cấp, bán
const sslotCost=()=>300+150*((S.scap-5)/5);
function sUp(h){if(h.lv>=5)return;const cost=sUpCost(h.lv);if(S.coins<cost){say('Không đủ xu để nâng cấp 🪙');return}
  S.coins-=cost;h.spent+=cost;h.lv++;say(h.name+' lên Lv '+h.lv+'! ⭐');fx.push({x:h.x,y:h.y-30,l:.8,m:.8,e:'⭐'})}
function openS(){renderS();$('slist').classList.add('on')}
function renderS(){
  let h='';
  for(const o of horses)h+=`<div class="fc sc" data-id="${o.id}"><canvas class="fth" width="96" height="72" data-id="${o.id}"></canvas><div class="fi"><div class="fr"><input class="nm" maxlength="14" value="${esc(o.name)}" aria-label="Tên Cá Support"><span class="stars"></span></div><div class="fa">🎂 Tuổi: <b class="ag"></b></div><div class="bar"><label>❤️ Máu</label><span class="bg"><i class="b1"></i></span><em class="v1"></em></div></div><div class="sk"><span class="skn"></span><br><span class="skx"></span></div><div class="wb"><button class="upb" data-sup="${o.id}"></button><button class="sell" data-ssell="${o.id}"></button></div></div>`;
  $('scards').innerHTML=h||'<p class="ds" style="text-align:center;padding:14px">Chưa có Cá Support nào. Hãy mua ở 🛒 Cửa hàng!</p>';updS(true);
}
function updS(skip){
  if(!$('slist').classList.contains('on'))return;
  const cards=[...$('scards').querySelectorAll('.sc')];
  if(!skip&&(cards.length!==horses.length||cards.some(x=>!horses.find(o=>o.id==x.dataset.id)))){const a=document.activeElement;if(!(a&&a.classList&&a.classList.contains('nm')))renderS();return}
  $('slc').textContent='🌟 '+horses.length+'/'+S.scap;$('sslotp').textContent=S.scap>=MAXF?'Tối đa':'🪙 '+sslotCost();$('sslotb').disabled=S.scap>=MAXF||S.coins<sslotCost();
  for(const x of cards){const o=horses.find(z=>z.id==x.dataset.id),q=k=>x.querySelector(k);if(!o)continue;
    const pct=Math.max(0,Math.min(100,o.hp/o.max*100));
    q('.stars').textContent='★'.repeat(o.lv)+'☆'.repeat(5-o.lv);q('.ag').textContent=ageTxt(o.born);
    q('.b1').style.width=pct+'%';q('.b1').style.background=pct<35?'#ef7a6a':'#5fc79a';q('.v1').textContent=Math.ceil(o.hp)+'/'+o.max;
    q('.skn').textContent='Kỹ năng: '+SKT[o.lv];q('.skx').textContent=o.lv<5?'Lv'+(o.lv+1)+': '+SKT[o.lv+1]:'(Level tối đa)';
    const u=q('.upb');if(o.lv>=5){u.innerHTML='⭐ Level<br>tối đa';u.disabled=true}else{const cst=sUpCost(o.lv);u.innerHTML='⬆️ Nâng cấp<br>🪙 '+cst;u.disabled=S.coins<cst}
    q('.sell').innerHTML='💰 Bán<br>🪙 '+Math.round(o.spent*.8);
  }
}
setInterval(updS,500);
function drawSThumbs(){
  if(!$('slist').classList.contains('on'))return;const im=img('horse');if(!im||!im.naturalWidth)return;
  for(const cvs of document.querySelectorAll('#scards .fth')){
    const o=horses.find(z=>z.id==cvs.dataset.id);if(!o)continue;const x=cvs.getContext('2d'),cw=cvs.width,ch=cvs.height;x.clearRect(0,0,cw,ch);
    const hh=62,ww=hh*im.naturalWidth/im.naturalHeight,ph=Math.cos(t*.7+o.ph);
    x.save();x.translate(cw/2+Math.sin(t*.7+o.ph)*8,ch/2+Math.sin(t*2+o.ph)*3);x.rotate(Math.sin(t*1.5+o.ph)*.07);if(ph>=0)x.scale(-1,1);x.drawImage(im,-ww/2,-hh/2,ww,hh);x.restore();
  }
}
setInterval(drawSThumbs,100);
$('scards').addEventListener('click',e=>{
  const u=e.target.closest('[data-sup]');if(u){const o=horses.find(z=>z.id==u.dataset.sup);if(o)sUp(o);updS(true);return}
  const b=e.target.closest('[data-ssell]');if(!b)return;const o=horses.find(z=>z.id==b.dataset.ssell);if(!o)return;
  const v=Math.round(o.spent*.8),id=o.id;
  cfAct=()=>{const i=horses.findIndex(z=>z.id==id);if(i>=0){S.coins+=v;say('Đã bán '+horses[i].name+' 👋 +'+v+' 🪙');horses.splice(i,1);save()}renderS()};
  $('cft').innerHTML=`Bán <b>${esc(o.name)}</b> (Lv ${o.lv}) và nhận lại <b>🪙 ${v}</b> (80% tổng giá trị)?<br><small style="color:#6f8aa3">Bạn sẽ không lấy lại được Cá Support này.</small>`;$('confirm').classList.add('on')});
$('scards').addEventListener('change',e=>{const i=e.target.closest('.nm');if(!i)return;const o=horses.find(z=>z.id==i.closest('.sc').dataset.id);if(!o)return;const v=i.value.trim().slice(0,14);if(v)o.name=v;else i.value=o.name;save()});
$('scards').addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.classList.contains('nm'))e.target.blur()});
$('sslotb').onclick=()=>$('sslot').onclick();
$('cnts').onclick=openS;$('c_horse').onclick=e=>{e.stopPropagation();openS()};
$('slclose').onclick=()=>$('slist').classList.remove('on');
$('slist').addEventListener('pointerdown',e=>{if(e.target==$('slist'))$('slist').classList.remove('on')});
$('slistb').onclick=()=>{closeSet();openS()};
