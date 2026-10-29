// ---- Thư viện hình (mỗi loại lưu tối đa 5 hình gần đây)
const KD={bg:{n:'Nền hồ',e:'🌊'},fish:{n:'Cá voi',e:'🐋',a:1,w:256,h:256},sword:{n:'Chiến binh',e:'⚔️',a:384/229,w:384,h:229},horse:{n:'Cá ngựa',e:'🐴',a:.625,w:200,h:320},crab:{n:'Cua',e:'🦀',a:1,w:256,h:256},gold:{n:'Xu vàng',e:'🟡',a:1,w:128,h:128},silver:{n:'Xu bạc',e:'⚪',a:1,w:128,h:128},mgreen:{n:'Quái xanh lá',e:'🟢',a:1,w:256,h:256},mblue:{n:'Quái xanh biển',e:'🔵',a:1,w:256,h:256},mpurple:{n:'Quái tím',e:'🟣',a:1,w:256,h:256},mred:{n:'Quái đỏ',e:'🔴',a:1,w:256,h:256}};
const G={};let tab='bg',pick=null,CR=null;
for(const n in KD){const g=G[n]={k:'whale_'+n+'s',s:'whale_'+n+'sel',list:[],sel:''};try{g.list=JSON.parse(localStorage.getItem(g.k)||'[]')}catch(e){}g.sel=localStorage.getItem(g.s)||'';
  const ok=n=='bg'?'whale_bg':n=='fish'?'whale_fish':null,old=ok&&localStorage.getItem(ok);
  if(old&&!g.list.length){g.list.push({id:'m1',d:old});g.sel='m1';gSave(n);localStorage.removeItem(ok)}
  gApply(n)}
function gSave(n){const g=G[n];try{localStorage.setItem(g.k,JSON.stringify(g.list));localStorage.setItem(g.s,g.sel);return true}catch(e){return false}}
function gApply(n){const g=G[n],it=g.list.find(x=>x.id==g.sel);if(n=='bg'){setBg(it?it.d:null);return}if(!it){delete IM[n];return}const i=new Image();i.onload=()=>{IM[n]=i};i.src=it.d}
function gal(){
  const n=tab,g=G[n],hasDef=['sword','horse','crab'].includes(n);
  let h=`<div class="tl def${hasDef?' di':''}${g.sel?'':' sel'}" data-i="">${hasDef?`<img src="${n}.png" alt="">`:`<span>${KD[n].e}</span>`}<b>Gốc</b></div>`;
  g.list.forEach(x=>h+=`<div class="tl${g.sel==x.id?' sel':''}" data-i="${x.id}"><img src="${x.d}" alt=""><button class="dx" data-del="${x.id}" aria-label="Xoá">✕</button></div>`);
  h+=g.list.length<5?'<div class="tl add" data-add="1"><span>＋</span><b>Thêm</b></div>':'<div class="tl add full" data-add="1"><span>🔒</span><b>Đủ 5</b></div>';
  $('gal').innerHTML=h;$('gn').textContent=g.list.length+'/5';
  $('ghint').textContent=({bg:'Ảnh nền hồ, cắt theo tỉ lệ màn hình.',fish:'Hình cá voi, ảnh nên quay đầu sang PHẢI (nếu bị ngược, bật công tắc bên dưới).',sword:'Hình Cá Chiến Binh, ảnh nên quay đầu sang TRÁI.',horse:'Hình cá ngựa, ảnh nên quay đầu sang TRÁI.',crab:'Hình cua, đi ngang ở đáy hồ để nhặt xu.',gold:'Hình xu vàng (cá cấp 2 đẻ ra).',silver:'Hình xu bạc (cá cấp 1 đẻ ra).',mgreen:'Hình Quái xanh lá (Máu 50).',mblue:'Hình Quái xanh biển (Máu 100).',mpurple:'Hình Quái tím (Máu 200).',mred:'Hình Quái đỏ (Máu 400).'})[n]+' Chạm để chọn · ✕ để xoá · tối đa 5 hình.';
}
function tabUI(){document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t==tab));$('flipw').style.display=tab=='fish'?'':'none';gal()}
$('tabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;tab=b.dataset.t;tabUI()};
$('gal').onclick=e=>{
  const n=tab,g=G[n],d=e.target.closest('[data-del]');
  if(d){g.list=g.list.filter(x=>x.id!=d.dataset.del);if(g.sel==d.dataset.del)g.sel='';gSave(n);gApply(n);gal();return}
  if(e.target.closest('[data-add]')){if(g.list.length>=5){say('Đã đủ 5 hình, hãy xoá bớt để thêm hình mới');return}pick=n;retTo='set';$('file').click();return}
  const tl=e.target.closest('.tl');if(tl){g.sel=tl.dataset.i;gSave(n);gApply(n);gal()}};

// ---- Cắt hình
$('file').onchange=e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
  const im=new Image();im.onload=()=>{CR={kind:pick,img:im,zoom:1,ox:0,oy:0};closeSet();$('minfo').classList.remove('on');$('crop').classList.add('on');
    $('ctitle').textContent='✂️ Cắt hình: '+KD[pick].n;$('asp').style.display=pick=='bg'?'':'none';setupCrop()};
  im.onerror=()=>say('Không đọc được ảnh');im.src=URL.createObjectURL(f)};
const cc=$('cc');
function aspect(){if(CR.kind!='bg')return KD[CR.kind].a;const v=$('asp').value;return v=='16:9'?16/9:v=='9:16'?9/16:W/H}
function setupCrop(){
  const a=aspect();let pw=Math.min(W-60,340),ph=pw/a;const mh=H-270;if(ph>mh){ph=Math.max(mh,120);pw=ph*a}
  cc.width=Math.round(pw);cc.height=Math.round(ph);cc.style.width=pw+'px';cc.style.height=ph+'px';
  CR.ox=CR.oy=0;CR.zoom=1;$('zm').min=CR.kind=='bg'?1:.3;$('zm').value=1;redraw();
}
$('asp').onchange=setupCrop;
function clampCrop(w,h){if(CR.kind!='bg')return;const s=Math.max(w/CR.img.width,h/CR.img.height)*CR.zoom,mx=Math.max(0,(CR.img.width*s-w)/2),my=Math.max(0,(CR.img.height*s-h)/2);CR.ox=cl(CR.ox,-mx,mx);CR.oy=cl(CR.oy,-my,my)}
function drawCrop(x,w,h,k){x.clearRect(0,0,w,h);const i=CR.img,s=Math.max(w/i.width,h/i.height)*CR.zoom,dw=i.width*s,dh=i.height*s;x.drawImage(i,(w-dw)/2+CR.ox*k,(h-dh)/2+CR.oy*k,dw,dh)}
function redraw(){clampCrop(cc.width,cc.height);drawCrop(cc.getContext('2d'),cc.width,cc.height,1)}
$('zm').oninput=e=>{CR.zoom=+e.target.value;redraw()};
let drag=null;
cc.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY};cc.setPointerCapture(e.pointerId)};
cc.onpointermove=e=>{if(!drag)return;const sc=cc.width/cc.getBoundingClientRect().width;CR.ox+=(e.clientX-drag.x)*sc;CR.oy+=(e.clientY-drag.y)*sc;drag={x:e.clientX,y:e.clientY};redraw()};
cc.onpointerup=cc.onpointercancel=()=>drag=null;
function endCrop(){$('crop').classList.remove('on');CR=null;if(retTo=='minfo')openMInfo();else{tab=pick||tab;openSet()}}
$('cx').onclick=endCrop;
$('cs').onclick=()=>{
  const n=CR.kind,g=G[n],a=aspect();let ow,oh;
  if(n!='bg'){ow=KD[n].w;oh=KD[n].h}else if(a>=1){ow=1280;oh=Math.round(1280/a)}else{oh=1280;ow=Math.round(1280*a)}
  const o=document.createElement('canvas');o.width=ow;o.height=oh;drawCrop(o.getContext('2d'),ow,oh,ow/cc.width);
  const d=n=='bg'?o.toDataURL('image/jpeg',.82):o.toDataURL('image/png'),id='i'+Date.now();
  g.list.push({id,d});g.sel=id;
  if(!gSave(n)){g.list.pop();g.sel='';gSave(n);say('Bộ nhớ máy đầy, hãy xoá bớt hình cũ')}else{gApply(n);say('Đã lưu và áp dụng ✅')}
  endCrop();
};
