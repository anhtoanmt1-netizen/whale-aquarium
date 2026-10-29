// ---- Vòng lặp chính: giới hạn khung hình theo chế độ hiệu năng (30 hoặc 60 fps)
let last=performance.now();
function loop(n){requestAnimationFrame(loop);const el=n-last;if(el<1000/PF.fps-3)return;last=n;update(Math.min(.06,el/1000));draw()}
requestAnimationFrame(loop);
say('Chạm màn hình để thả thức ăn 🍤 · vuốt ve cá để thả tim 💗');
if(!localStorage.getItem('whale_guided')){setTimeout(()=>{openGuide();try{localStorage.setItem('whale_guided','1')}catch(e){}},900)}
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
