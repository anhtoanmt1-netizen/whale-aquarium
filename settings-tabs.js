// ---- Cài đặt: các tab
function setPane(p){spane=p;document.querySelectorAll('#stabs button').forEach(b=>b.classList.toggle('on',b.dataset.s==p));document.querySelectorAll('.sp').forEach(d=>d.classList.toggle('on',d.id=='sp_'+p))}
$('stabs').onclick=e=>{const b=e.target.closest('button');if(b)setPane(b.dataset.s)};
$('flistb').onclick=()=>{closeSet();openList()};$('wlistb').onclick=()=>{closeSet();openW()};$('minfob2').onclick=()=>{closeSet();openMInfo()};
const PN={eco:'🔋 Tiết kiệm',bal:'⚖️ Cân bằng',high:'🚀 Mượt 60'};
function perfUI(){document.querySelectorAll('#perf .chip').forEach(b=>b.classList.toggle('on',b.dataset.p==S.perf));$('showfps').checked=!!S.showfps}
$('perf').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;S.perf=b.dataset.p;PF=PERFS[S.perf];resize();buildFx();perfUI();save();
  say(PN[S.perf]+': '+PF.fps+' FPS · độ nét ×'+PF.dpr+' · '+PF.spk+' đốm sáng · '+PF.bub+' bóng nước')};
$('showfps').onchange=e=>{S.showfps=e.target.checked;$('fpsb').style.display=S.showfps?'block':'none';save()};
