// ================= CÀI ĐẶT =================
function openSet(){setPane(spane);sndUI();perfUI();tabUI();$('flip').checked=S.flip;$('chat').checked=S.chat;lstate();$('set').classList.add('on');document.body.classList.add('so')}
function closeSet(){$('set').classList.remove('on');document.body.classList.remove('so')}
$('gear').onclick=openSet;$('sclose').onclick=closeSet;
$('set').addEventListener('pointerdown',e=>{if(e.target==$('set'))closeSet()});
$('flip').onchange=e=>{S.flip=e.target.checked;save()};
let dp=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e});
addEventListener('appinstalled',()=>say('Đã cài đặt ✅'));
$('inst').onclick=async()=>{
  if(matchMedia('(display-mode: standalone)').matches||navigator.standalone){say('Game đã được cài rồi ✅');return}
  if(dp){dp.prompt();await dp.userChoice;dp=null;return}
  say(/iphone|ipad/i.test(navigator.userAgent)?'Safari: nhấn Chia sẻ → Thêm vào MH chính':'Menu ⋮ → Cài đặt ứng dụng / Thêm vào màn hình chính');
};
function lstate(){$('land').classList.toggle('on',!!document.fullscreenElement)}
$('land').onclick=async()=>{
  try{
    if(!document.fullscreenElement){await document.documentElement.requestFullscreen();try{await screen.orientation.lock('landscape')}catch(e){say('Hãy bật xoay màn hình và xoay ngang điện thoại')}}
    else{try{screen.orientation.unlock()}catch(e){}await document.exitFullscreen()}
  }catch(e){say('Máy không hỗ trợ toàn màn hình. Hãy xoay ngang điện thoại.')}
  lstate();
};
addEventListener('fullscreenchange',()=>{lstate();setTimeout(resize,200)});
addEventListener('orientationchange',()=>setTimeout(resize,300));
