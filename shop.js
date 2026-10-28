// ================= HUD =================
const slotCost=()=>300+150*((S.cap-10)/5);
function hud(){
  const th=$('hud').offsetHeight+6;if(th!==TOP)TOP=th;
  const txt=(id,v)=>{const e=$(id);if(e.textContent!==v)e.textContent=v};
  txt('coins','🪙 '+S.coins);txt('coins2','🪙 '+S.coins);txt('cnt','🐋 '+fish.length+'/'+S.cap+' ›');
  const it=(id,dis,price,cnt)=>{$(id).disabled=dis;txt('p_'+id,price);txt('c_'+id,cnt)};
  it('buy',S.coins<100||fish.length>=S.cap,fish.length>=S.cap?'Đầy chỗ':'🪙 100',fish.length+'/'+S.cap);
  it('sword',S.coins<WB.buy||swords.length>=S.wcap,swords.length>=S.wcap?'Đầy chỗ':'🪙 '+WB.buy,'📋 '+swords.length+'/'+S.wcap);
  $('sword').disabled=false;$('sword').style.opacity=(S.coins<WB.buy||swords.length>=S.wcap)?.5:1;
  it('wslot',S.wcap>=MAXF||S.coins<wslotCost(),S.wcap>=MAXF?'Tối đa':'🪙 '+wslotCost(),S.wcap+' chỗ');
  txt('cntw','⚔️ '+swords.length+' ›');$('cntw').style.display=swords.length?'':'none';
  it('horse',S.coins<SB.buy||horses.length>=S.scap,horses.length>=S.scap?'Đầy chỗ':'🪙 '+SB.buy,'📋 '+horses.length+'/'+S.scap);
  $('horse').disabled=false;$('horse').style.opacity=(S.coins<SB.buy||horses.length>=S.scap)?.5:1;
  it('sslot',S.scap>=MAXF||S.coins<sslotCost(),S.scap>=MAXF?'Tối đa':'🪙 '+sslotCost(),S.scap+' chỗ');
  txt('cnts','🌟 '+horses.length+' ›');$('cnts').style.display=horses.length?'':'none';
  it('crab',S.coins<200||crabs.length>=5,crabs.length>=5?'Tối đa':'🪙 200',crabs.length+'/5');
  it('up',S.lv>=4||S.coins<150*S.lv,S.lv>=4?'Tối đa':'🪙 '+150*S.lv,'Lv'+S.lv);
  it('slot',S.cap>=MAXF||S.coins<slotCost(),S.cap>=MAXF?'Tối đa':'🪙 '+slotCost(),S.cap+' chỗ');
}
$('buy').onclick=()=>{if(fish.length>=S.cap){say('Hồ đã đầy! Hãy mua thêm chỗ 🏝️');return}if(S.coins>=100){S.coins-=100;const nf=newFish();fish.push(nf);say('Chào mừng '+nf.name+(nf.sex=='m'?' ♂':' ♀')+'! 🐋')}};
$('crab').onclick=()=>{if(S.coins>=200&&crabs.length<5){S.coins-=200;S.crabs++;crabs.push(newCrab());say('Cua sẽ nhặt xu ở đáy hồ 🦀')}};
$('up').onclick=()=>{const p=150*S.lv;if(S.lv<4&&S.coins>=p){S.coins-=p;S.lv++;say('Thức ăn nâng cấp! Thả được nhiều viên hơn')}};
$('slot').onclick=()=>{const p=slotCost();if(S.cap<MAXF&&S.coins>=p){S.coins-=p;S.cap+=5;say('Hồ rộng thêm 5 chỗ! 🏝️ ('+S.cap+' chỗ)');save()}};

$('sword').onclick=()=>{if(swords.length>=S.wcap){say('Đã đầy chỗ Chiến Binh! Hãy mua thêm chỗ ⚔️');return}if(S.coins>=WB.buy){S.coins-=WB.buy;const w=newSword();swords.push(w);say('Chiến binh '+w.name+' gia nhập! ⚔️')}else say('Không đủ xu để mua Chiến Binh 🪙')};
$('wslot').onclick=()=>{const p=wslotCost();if(S.wcap<MAXF&&S.coins>=p){S.coins-=p;S.wcap+=5;say('Thêm 5 chỗ Chiến Binh! ('+S.wcap+' chỗ)');save()}};
$('horse').onclick=()=>{if(horses.length>=S.scap){say('Đã đầy chỗ Cá Support! Hãy mua thêm chỗ 🌟');return}if(S.coins>=SB.buy){S.coins-=SB.buy;const h=newHorse();horses.push(h);say('Cá Support '+h.name+' gia nhập! 🌟')}else say('Không đủ xu để mua Cá Support 🪙')};
$('sslot').onclick=()=>{const p=sslotCost();if(S.scap<MAXF&&S.coins>=p){S.coins-=p;S.scap+=5;say('Thêm 5 chỗ Cá Support! ('+S.scap+' chỗ)');save()}};
$('shopb').onclick=()=>$('shop').classList.add('on');
$('shclose').onclick=()=>$('shop').classList.remove('on');
$('shop').addEventListener('pointerdown',e=>{if(e.target==$('shop'))$('shop').classList.remove('on')});
