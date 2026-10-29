// ---- Hướng dẫn
function openGuide(){$('guide').classList.add('on')}
$('helpb').onclick=openGuide;$('helps').onclick=()=>{closeSet();openGuide()};
$('gclose').onclick=$('gdone').onclick=()=>$('guide').classList.remove('on');
$('guide').addEventListener('pointerdown',e=>{if(e.target==$('guide'))$('guide').classList.remove('on')});
$('chat').onchange=e=>{S.chat=e.target.checked;save()};
