// ---- Bảng thông tin quái vật
function openMInfo(){renderM();$('minfo').classList.add('on')}
function renderM(){
  const bg={green:'#e4f6ee',blue:'#e2f0fb',purple:'#efeafd',red:'#ffe4e0'};let h='';
  for(const k of MK){const m=MON[k],cust=G['m'+k].sel;
    h+=`<div class="fc mc" style="background:${bg[k]}"><div class="mcv"><canvas class="mth" data-k="${k}" width="96" height="96"></canvas><small>✏️ Chạm để đổi hình</small>${cust?`<button class="rs" data-reset="${k}">↺ Hình gốc</button>`:''}</div><div class="fi"><b class="mn">${m.n}</b><div class="fa">❤️ Máu: <b>${m.hp}</b></div><div class="fa">⚔️ Sát thương: <b>${m.dmg}</b></div><div class="bar"><label>🎲 Xuất hiện</label><span class="bg"><i style="width:${m.p}%;background:${m.c2}"></i></span><em>${m.p}%</em></div><div class="fa">🪙 Thưởng khi diệt: <b>${m.rw}</b></div></div></div>`}
  $('mcards').innerHTML=h;
}
function drawMThumbs(){
  if(!$('minfo').classList.contains('on'))return;
  for(const cvs of document.querySelectorAll('#mcards .mth')){const k=cvs.dataset.k,m=MON[k],x=cvs.getContext('2d');x.clearRect(0,0,cvs.width,cvs.height);drawMon(x,k,48,46+Math.sin(t*2)*2,Math.min(1,30/m.r),t)}
}
setInterval(drawMThumbs,100);
function changeMon(k){const n='m'+k,g=G[n];
  if(g.list.length>=5){say('Đã đủ 5 hình, hãy xoá bớt trong ⚙️ → Hình ảnh');$('minfo').classList.remove('on');tab=n;spane='img';openSet();return}
  pick=n;retTo='minfo';$('file').click()}
$('mcards').addEventListener('click',e=>{
  const r=e.target.closest('[data-reset]');if(r){const n='m'+r.dataset.reset;G[n].sel='';gSave(n);gApply(n);renderM();return}
  const th=e.target.closest('.mth');if(th)changeMon(th.dataset.k)});
$('miclose').onclick=()=>$('minfo').classList.remove('on');
$('minfo').addEventListener('pointerdown',e=>{if(e.target==$('minfo'))$('minfo').classList.remove('on')});
$('minfob').onclick=openMInfo;
