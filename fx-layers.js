// Lớp nền, tia nắng, lấp lánh, bóng nước nổi: dựng bằng CSS (chạy trên GPU, gần như không tốn CPU)
function setBg(d){const b=$('bgL');b.style.backgroundImage=d?'url('+d+')':'';document.body.classList.toggle('cbg',!!d)}
function buildFx(){
  const rays=$('rays'),spk=$('spk'),bub=$('bubs');rays.innerHTML='';spk.innerHTML='';bub.innerHTML='';
  for(let i=0;i<5;i++){const d=document.createElement('div');d.className='ray';d.style.left=(i*22+2)+'%';d.style.width=(8+(i%2)*6)+'%';d.style.animationDuration=(8+i*1.7)+'s';d.style.animationDelay=(-i*2)+'s';rays.appendChild(d)}
  for(let i=0;i<PF.spk;i++){const d=document.createElement('div');d.className='spk';d.style.left=R(2,96)+'%';d.style.top=R(4,82)+'%';const z=R(7,15);d.style.width=d.style.height=z+'px';d.style.animationDuration=R(2.2,4.5)+'s';d.style.animationDelay=(-R(0,4))+'s';spk.appendChild(d)}
  for(let i=0;i<PF.bub;i++){const d=document.createElement('div');d.className='bub';const z=R(5,16);d.style.width=d.style.height=z+'px';d.style.left=R(0,98)+'%';d.style.animationDuration=R(11,24)+'s';d.style.animationDelay=(-R(0,20))+'s';bub.appendChild(d)}
}
buildFx();
