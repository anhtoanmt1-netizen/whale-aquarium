// ---- Vòng lặp chính: giữ đúng số khung hình mỗi giây theo chế độ hiệu năng (30 / 45 / 60 FPS)
let last=performance.now(),lastDraw=last,acc=0,fpsN=0,fpsT=last,slowN=0,slowWarned=false;
function loop(n){requestAnimationFrame(loop);
  acc+=Math.min(n-last,100);last=n;const iv=1000/PF.fps;if(acc<iv-2)return;acc=(acc-iv>iv)?0:acc-iv;
  const dt=Math.min(.06,(n-lastDraw)/1000);lastDraw=n;update(dt);draw();
  fpsN++;if(n-fpsT>=1000){const fp=Math.round(fpsN*1000/(n-fpsT));if(S.showfps)$('fpsb').textContent='FPS '+fp+' / '+PF.fps+' · '+PN[S.perf]+' · ×'+DPR;
    if(fp<PF.fps*.6&&S.perf!=='eco'){if(++slowN>=4&&!slowWarned){slowWarned=true;say('Máy đang hơi nặng ('+fp+' FPS). Thử chế độ 🔋 Tiết kiệm trong ⚙️ → Hiển thị')}}else slowN=0;
    fpsN=0;fpsT=n}}
requestAnimationFrame(loop);
$('fpsb').style.display=S.showfps?'block':'none';
say('Chạm màn hình để thả thức ăn 🍤 · vuốt ve cá để thả tim 💗');
if(!localStorage.getItem('whale_guided')){setTimeout(()=>{openGuide();try{localStorage.setItem('whale_guided','1')}catch(e){}},900)}
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
