import asyncio,json,sys
from playwright.async_api import async_playwright
SIM="""()=>{MODE='peace';menuHide();document.body.classList.remove('inmenu');alien=null;alienT=1e9;S.coins=9999;S.cap=50;S.wcap=50;S.scap=50;S.ccap=50;fish=[];swords=[];horses=[];crabs=[];
  for(let i=0;i<14;i++){const f=newFish(1);f.x=R(60,W-60);f.y=R(TOP+50,H-80);fish.push(f)}
  for(let i=0;i<14;i++){const w=newSword({lv:2});w.x=R(60,W-60);w.y=R(TOP+50,H-80);swords.push(w)}
  for(let i=0;i<6;i++){const h=newHorse({lv:2});h.x=R(60,W-60);h.y=R(TOP+50,H-80);horses.push(h)}
  for(let k=0;k<200;k++)update(.05);return {W,H}}"""
MEASURE="""()=>{
  const ang=o=>{if(o.pitch!==undefined)return o.pitch;const a=Math.atan2(o.hy||0,Math.abs(o.hx||1));return a};   // cũ: góc heading; mới: pitch
  const stats={n:0,steep:0,steep60:0,wall:0,cornerStill:0,maxAbs:0,flips:0,offscreen:0};const track=new Map(),fl=new Map();
  for(let k=0;k<2400;k++){update(.05);                    // 120 giây mô phỏng
    for(const o of swords){stats.n++;const a=Math.abs(ang(o));stats.maxAbs=Math.max(stats.maxAbs,a);if(a>.6)stats.steep++;if(a>1.05)stats.steep60++;
      const nearW=o.x<=52||o.x>=W-52||o.y<=TOP+37||o.y>=H-57;if(nearW)stats.wall++;
      if(o.x<0||o.x>W||o.y<0||o.y>H)stats.offscreen++;
      const nearC=(o.x<110||o.x>W-110)&&(o.y<TOP+95||o.y>H-115)&&Math.hypot(o.vx,o.vy)<18;const t0=track.get(o)||0;track.set(o,nearC?t0+.05:0);if(track.get(o)>2.5)stats.cornerStill++;}
  }
  return {W,H,sampled:stats.n,steepFrac:+(stats.steep/stats.n).toFixed(3),verySteepFrac:+(stats.steep60/stats.n).toFixed(3),maxPitch:+stats.maxAbs.toFixed(2),wallFrac:+(stats.wall/stats.n).toFixed(3),cornerStuckFrames:stats.cornerStill,offscreenFrames:stats.offscreen}}"""
async def run(url,label):
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':390,'height':780})).new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("localStorage.setItem('whale_guided','1')")
        await pg.goto(url);await pg.wait_for_timeout(1200)
        await pg.evaluate(SIM)
        await pg.set_viewport_size({'width':844,'height':390});await pg.wait_for_timeout(500)   # xoay sang NGANG giữa chừng
        r=await pg.evaluate(MEASURE);print(label,'DỌC→NGANG',json.dumps(r),errs[:2])
        await pg.evaluate(SIM)                                         # chơi hẳn ở màn ngang
        r=await pg.evaluate(MEASURE);print(label,'NGANG    ',json.dumps(r))
        await pg.set_viewport_size({'width':390,'height':780});await pg.wait_for_timeout(500)
        r=await pg.evaluate(MEASURE);print(label,'NGANG→DỌC',json.dumps(r));await b.close()
async def main():
    await run('http://localhost:8766/index.html','CŨ (v15) ')
    await run('http://localhost:8765/index.html','MỚI (v16)')
asyncio.run(main())
