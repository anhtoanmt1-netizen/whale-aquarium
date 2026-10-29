// ================= ÂM THANH (WebAudio, không cần file) =================
let AC=null,MG,REV,cur=null;
function audioInit(){
  if(AC){AC.resume();return}
  AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=S.vol*.8;MG.connect(AC.destination);
  REV=AC.createConvolver();const n=Math.floor(AC.sampleRate*1.3),b=AC.createBuffer(2,n,AC.sampleRate);
  for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3)}
  REV.buffer=b;REV.connect(MG);
}
function noise(brown){const n=AC.sampleRate*3,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);let l=0;
  for(let i=0;i<n;i++){const w=Math.random()*2-1;l=brown?(l+.02*w)/1.02:w;d[i]=brown?l*3.5:w}
  const s=AC.createBufferSource();s.buffer=b;s.loop=true;return s}
function lfo(freq,amt,param){const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=freq;g.gain.value=amt;o.connect(g);g.connect(param);o.start();return o}
function setSound(k){
  S.snd=k;save();
  if(cur){const o=cur,now=AC.currentTime;o.bus.gain.setTargetAtTime(0,now,.3);o.send.gain.setTargetAtTime(0,now,.3);setTimeout(()=>o.stops.forEach(f=>{try{f()}catch(e){}}),2000);cur=null}
  if(k=='off'||!AC)return;
  const now=AC.currentTime,bus=AC.createGain(),send=AC.createGain(),stops=[];
  bus.gain.value=0;bus.gain.setTargetAtTime(1,now,.9);send.gain.value=0;send.gain.setTargetAtTime(1,now,.9);bus.connect(MG);send.connect(REV);cur={bus,send,stops};
  const wet=(n,a)=>{n.connect(bus);const w=AC.createGain();w.gain.value=a;n.connect(w);w.connect(send)};
  const loopT=(fn,a,b)=>{let on=true;(function r(){if(!on)return;fn();setTimeout(r,R(a,b))})();stops.push(()=>on=false)};
  if(k=='wave'){
    const n=noise(1),f=AC.createBiquadFilter(),g=AC.createGain();f.type='lowpass';f.frequency.value=520;g.gain.value=.55;
    n.connect(f);f.connect(g);g.connect(bus);n.start();
    stops.push(()=>n.stop());
    const l1=lfo(.1,.3,g.gain),l2=lfo(.07,220,f.frequency);stops.push(()=>l1.stop(),()=>l2.stop());
  }else if(k=='pad'){
    const ch=[[130.8,164.8,196,246.9],[110,130.8,164.8,196],[87.3,130.8,174.6,220],[98,146.8,196,246.9]],f=AC.createBiquadFilter();
    f.type='lowpass';f.frequency.value=900;wet(f,.5);let idx=0;
    const os=ch[0].map((fr,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=i%2?'triangle':'sine';o.frequency.value=fr;o.detune.value=R(-6,6);g.gain.value=.09;o.connect(g);g.connect(f);o.start();stops.push(()=>o.stop());return o});
    const tr=lfo(.12,.25,bus.gain);stops.push(()=>tr.stop());
    loopT(()=>{idx=(idx+1)%4;os.forEach((o,i)=>o.frequency.setTargetAtTime(ch[idx][i],AC.currentTime,1.6))},8000,8000);
  }else if(k=='box'){
    const sc=[523.25,587.33,659.25,783.99,880,1046.5,1174.7];
    const note=fr=>{const t0=AC.currentTime,g=AC.createGain();g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.13,t0+.005);g.gain.exponentialRampToValueAtTime(.0001,t0+1.8);
      [1,2.01].forEach((m,i)=>{const o=AC.createOscillator(),og=AC.createGain();o.type=i?'sine':'triangle';o.frequency.value=fr*m;og.gain.value=i?.25:1;o.connect(og);og.connect(g);o.start(t0);o.stop(t0+1.9)});wet(g,.7)};
    loopT(()=>{const i=Math.floor(R(0,sc.length));note(sc[i]);if(Math.random()<.4)setTimeout(()=>note(sc[Math.min(sc.length-1,i+2)]),260)},700,1700);
  }else{
    const n=noise(1),f=AC.createBiquadFilter(),g=AC.createGain();f.type='lowpass';f.frequency.value=260;g.gain.value=.3;n.connect(f);f.connect(g);g.connect(bus);n.start();stops.push(()=>n.stop());
    loopT(()=>{const t0=AC.currentTime,o=AC.createOscillator(),e=AC.createGain(),f0=R(260,620);o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(f0*2.3,t0+.11);
      e.gain.setValueAtTime(.0001,t0);e.gain.exponentialRampToValueAtTime(.16,t0+.02);e.gain.exponentialRampToValueAtTime(.0001,t0+.2);o.connect(e);wet(e,.4);o.start(t0);o.stop(t0+.25)},450,1900);
  }
}
function ting(){if(!AC||S.snd=='off')return;const t0=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(1318,t0);o.frequency.setValueAtTime(1760,t0+.07);
  g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.09,t0+.01);g.gain.exponentialRampToValueAtTime(.0001,t0+.3);o.connect(g);g.connect(MG);o.start(t0);o.stop(t0+.32)}
addEventListener('pointerdown',()=>{if(!AC&&S.snd!='off'){audioInit();setSound(S.snd)}else if(AC)AC.resume()},{capture:true});
document.addEventListener('visibilitychange',()=>{if(AC)document.hidden?AC.suspend():AC.resume()});
function sndUI(){document.querySelectorAll('#snd .chip').forEach(b=>b.classList.toggle('on',b.dataset.k==S.snd));$('vol').value=S.vol}
$('snd').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;audioInit();setSound(b.dataset.k);sndUI()};
$('vol').oninput=e=>{S.vol=+e.target.value;if(AC)MG.gain.setTargetAtTime(S.vol*.8,AC.currentTime,.05);save()};
