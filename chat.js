// ================= TRÒ CHUYỆN / PHẢN ỨNG / DANH SÁCH CÁ =================
const pk=a=>a[Math.floor(Math.random()*a.length)],RXS={flee:270,angry:6,shy:18,love:14};
const SOLO=['Cắn cái coi!','Đói bụng quá…','Cho miếng i~','Chào cậu nha!','Biết gì chưa?','Lạnh quá à','Ai gãi dùm tui cái lưng','Iu quá cơ ♥','Hế lô cả nhà!','Bũm!','Ai mới xì hơi vậy?','Nhột quá!','Ê mập!','Ọc ọc…','Tui không biết bơi','Cứu mạng!','Hôm nay lạnh ghê','Ăn gì chưa?','Hôm nay nước ấm ghê','Tui mới tắm xong nè','Ngủ chút nha… zzz','Ai thấy cục xà bông của tui không?','Bơi hoài mỏi vây quá','Ai thả bong bóng đó?','Tui thề tui không ăn vụng','Hồ nhỏ quá, hổng đủ quẩy','Coi chừng quái vật đó!','Tui là cá xinh nhất hồ','Nay mình đẹp trai chưa?','Đừng nhìn tui ăn!','Ai cho tui xin tí xu?','Có ai làm bạn với tui không?','Mẹ ơi con muốn ra biển','Tui đang ăn kiêng… từ mai','Chủ nhân ơi cho ăn đi!','Thả tim cho tui đi mà','Tập thể dục nào, 1-2-3!','Hít sâu… phụt!','Hôm nay thứ mấy ta?','Quên mất tui định nói gì rồi','Cá mà biết bay thì hay ghê','Đố biết tui là ai?','Sao tui buồn ngủ quá trời','Ê, cho mượn cái vây coi','{n} ơi, bơi lẹ lên!','Hỏi nhỏ: {n} có thích tui không?','Tui thấy {n} dễ thương ghê','Ai bóp mũi tui vậy?','Nước hôm nay có vị gì đó…','Tui mơ thấy mình là cá mập!','Hắt xì! Ai nhắc tui vậy?','Cá nào đang lén ăn kìa!','Bơi vòng vòng chóng mặt quá','Tui vừa đẻ được cái bong bóng!'];
const PAIRS=[['Chào cậu nha!',['Chào chào, khỏe không?','Ơ chào! Nay đẹp ghê']],['Ăn gì chưa?',['Chưa, đang chờ chủ thả…','Rồi, no căng bụng luôn!']],['Biết gì chưa?',['Gì dợ? Kể nhanh đi!','Chưa, nói đi nói đi!']],['Ê mập!',['Mập gì, tui nở hoa đó!','Hứ, cậu mới mập á!']],['Ai mới xì hơi vậy?',['Không phải tui nha! 🙈','Chắc {n} rồi…']],['Cắn cái coi!',['Cắn chi, tui ăn kiêng!','Ái da! Đồ cá hung dữ!']],['Hôm nay lạnh ghê',['Lại đây tui ủ ấm cho','Lạnh hả? Bơi cho nóng người!']],['Cho miếng i',['Không, của tui!','Nè, chia đôi nha']],['Ai gãi dùm tui cái lưng',['Để tui, quay lưng qua đây','Tui cũng ngứa nè, gãi qua gãi lại nha']],['Cứu mạng!',['Gì đó? Bơi lẹ lên!','Ai bị gì? Tui tới đây!']],['Nhột quá!',['Hihi, tui đâu có chạm!','Ai chọc cậu vậy?']],['Tui không biết bơi',['Cá mà không biết bơi? 🤣','Ủa vậy nãy giờ cậu làm gì?']],['Iu quá cơ ♥',['Ghê quá nha, tui đỏ mặt rồi','Tui cũng iu cậu nè']],['{n} ơi, cho mượn cái vây',['Mượn rồi nhớ trả nha','Vây của tui mà, không cho!']],['Tránh ra, đây là chỗ của tui!',['Chỗ của cậu hồi nào? Hừ!','Hổng tránh, làm gì nhau?']],['Cậu giành ăn của tui!',['Thì sao? Cắn tui đi!','Đâu có, tại tui nhanh hơn thôi']],['Đồ cá ham ăn!',['Còn hơn đồ cá lười!','Ham ăn mới mau lớn chứ!']],['Kể chuyện cười nghe đi',['Con cá đi mua giày… mà nó không có chân!','Sao cá hổng chơi game? Vì sợ dính lưới!']],['Sao cá không đi học?',['Vì sợ gặp thầy cá mập!','Vì dưới nước hổng có bảng!']],['Đố cậu: con gì ở dưới nước mà khô?',['Con… cá khô!','Hổng biết, cậu nói đi']],['Tui hát cho cậu nghe nha',['Thôi thôi, nước bắn tung tóe hết!','Hát đi, tui vỗ vây cổ vũ']],['Chơi trốn tìm không?',['Chơi! Cậu đếm đi, 1…2…3…','Hồ nhỏ xíu trốn đâu ra?']],['Tui buồn ngủ quá',['Ngủ đi, tui canh cho','Ngủ gì, dậy bơi với tui nè!']]];
const HUNGRY=['Đói bụng quá…','Ọc ọc… ai cho tui ăn đi','Chủ nhân ơi, đói lắm rồi!','Tui sắp xỉu vì đói…','Cho miếng i~','Bụng tui đang biểu tình nè','Có ai còn đồ ăn không?'];
const SAD=['Buồn quá à…','Ai vuốt ve tui đi…','Không ai iu tui hết','Hôm nay tui hơi buồn','Cho tui xin cái ôm…','Tui cô đơn quá trời','Vuốt tui cái đi mà, huhu'];
const ANGRY=['Hứ! Đừng chọc tui!','Tui giận rồi nha!','Cắn cho giờ!','Làm gì đó hả?!'],LOVE=['Hihi, thêm đi~','Làm nũng xíu nè 💕','Ôm cái nào!','Iu chủ nhân quá cơ'],SHY=['Ngại quá đi…','Đừng nhìn tui…','Hổng dám đâu à','Ơ… mắc cỡ quá'],FLEE=['Aaa! Chạy mau!','Cứu!!','Tui chạy đâyyy','Đừng bắt tui!'],PETS=['Sướng quá~','Gãi nữa đi!','Ưm… đúng chỗ rồi','Iu chủ nhân','Rê rê rê~'];
let chatT=2;
function chat(dt){
  chatT-=dt;if(chatT>0||!S.chat)return;chatT=R(1.3,3)*(fish.length>20?.6:1);
  if(fish.filter(f=>f.say).length>=Math.min(6,2+Math.ceil(fish.length/4)))return;
  const free=fish.filter(f=>!f.say&&!f.rep&&!(f.rx&&f.rx.k=='flee'));if(!free.length)return;
  const f=pk(free);
  if(f.hunger>70&&Math.random()<.7){f.say={t:pk(HUNGRY),l:3.2};return}
  if(f.joy<35&&Math.random()<.6){f.say={t:pk(SAD),l:3.2};return}
  const near=free.filter(o=>o!==f&&Math.hypot(o.x-f.x,o.y-f.y)<260);
  if(near.length&&Math.random()<.5){const o=pk(near),p=pk(PAIRS);f.say={t:p[0].replace('{n}',o.name),l:3.2};o.rep={t:pk(p[1]).replace('{n}',f.name),d:1.8};return}
  f.say={t:pk(SOLO).replace('{n}',pk(fish).name),l:3.2};
}
function hearts(x,y){fx.push({x:x+R(-22,22),y:y+R(-6,6),l:.9,m:.9,e:'💗'})}
function petFish(f,d){f.petAcc+=d;f.freeze=.5;
  if(f.petAcc>=45){f.petAcc-=45;f.joy=Math.min(100,f.joy+4);hearts(f.x,f.y-sz(f)*.9);if(!f.say&&Math.random()<.4)f.say={t:pk(PETS),l:2}}}
function react(f,px,py){
  const good=f.joy>=60,r=Math.random(),w=good?[.15,.55,.8]:[.35,.5,.75],k=r<w[0]?'angry':r<w[1]?'love':r<w[2]?'shy':'flee';
  f.rx={k,t:k=='flee'?2.2:k=='angry'?1.6:2};f.say={t:pk({angry:ANGRY,love:LOVE,shy:SHY,flee:FLEE}[k]),l:2.4};
  if(k=='angry')f.joy=Math.max(0,f.joy-2);
  if(k=='love'){f.joy=Math.min(100,f.joy+3);for(let i=0;i<3;i++)hearts(f.x,f.y-sz(f)*.8)}
  if(k=='flee'){let ax=f.x-px,ay=f.y-py;const d=Math.hypot(ax,ay)||1,b=bnd(f);ax/=d;ay/=d;f.tx=cl(f.x+ax*320,b.x0,b.x1);f.ty=cl(f.y+ay*220,b.y0,b.y1);
    if(Math.hypot(f.tx-f.x,f.ty-f.y)<60){f.tx=R(b.x0,b.x1);f.ty=R(b.y0,b.y1)}f.vx=ax*260;f.vy=ay*260}
}
function drawMood(f){const s=sz(f);let e=null;
  if(f.rx)e={angry:'💢',love:'💗',shy:'😳',flee:'💨'}[f.rx.k];else if(f.joy<=0)e='💔';else if(f.joy<50)e='😟';
  if(!e)return;drawEmo(e,f.x+f.dir*s*.4,f.y-s*1.15+Math.sin(t*6)*2,18)}
function rr(x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function wrapT(txt,maxW){const ws=txt.split(' '),ls=[];let l='';for(const w of ws){const tt=l?l+' '+w:w;if(c.measureText(tt).width>maxW&&l){ls.push(l);l=w}else l=tt}ls.push(l);return ls}
function drawSay(){
  c.font='700 12px Montserrat,sans-serif';c.textAlign='center';c.textBaseline='middle';
  for(const f of fish){if(!f.say)continue;
    const sy=f.say;if(!sy.ls){sy.ls=wrapT(sy.t,118);sy.w=Math.max(...sy.ls.map(l=>c.measureText(l).width))+20;sy.h=sy.ls.length*15+12}const ls=sy.ls,w=sy.w,h=sy.h,s=sz(f);
    const bx=cl(f.x-w/2,4,W-w-4),by=Math.max(TOP-4,f.y-s*1.5-h-10),tx=cl(f.x,bx+14,bx+w-14);
    c.globalAlpha=Math.min(1,f.say.l*3);c.fillStyle='rgba(255,255,255,.96)';c.strokeStyle='#bcd8ee';c.lineWidth=1.5;
    rr(bx,by,w,h,10);c.fill();c.stroke();
    c.beginPath();c.moveTo(tx-5,by+h-.5);c.lineTo(tx+5,by+h-.5);c.lineTo(tx,by+h+7);c.closePath();c.fill();
    c.fillStyle='#35506b';ls.forEach((l,i)=>c.fillText(l,bx+w/2,by+6+i*15+7.5));
  }
  c.globalAlpha=1;
}
