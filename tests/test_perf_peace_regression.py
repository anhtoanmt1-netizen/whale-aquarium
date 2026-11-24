import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':390,'height':780})).new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("localStorage.setItem('whale_guided','1')")
        await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1000);ev=pg.evaluate
        # --- hồi quy Cua/chat ở Thủy Cung ---
        r=await ev("""()=>{menuHide();MODE='peace';S.coins=99999;S.cap=50;S.chat=true;crabs=[];fish=[];swords=[];horses=[];for(let i=0;i<8;i++)fish.push(newFish(2));const c1=newCrab({lv:5});crabs.push(c1);for(let i=0;i<2;i++)swords.push(newSword({lv:2}));horses.push(newHorse({lv:2}));
          for(const f of fish)f.joy=20;const seen=new Set(),o={dash:false,hearts:0,joyUp:0};const j0=fish.reduce((a,f)=>a+f.joy,0);let fired=0;const of=fireHearts;window.fireHearts=function(c){fired++;return of(c)};
          coins.push({x:W-60,y:H-26,v:15,age:0,vy:0,ph:0,rest:1,gold:0});
          for(let i=0;i<600;i++){update(.05);if(c1.dashing)o.dash=true;for(const x of[...swords,...horses,...crabs])if(x.say)seen.add(x.role+':'+x.say.t)}
          o.hearts=fired;o.joyUp=Math.round(fish.reduce((a,f)=>a+f.joy,0)-j0);o.crewLines=[...seen].length;o.sample=[...seen].slice(0,3);return o}""")
        print('REG crab/chat',r)
        # --- hiệu năng: 5 Boss + 40 cá + 33 Chiến Binh + 8 Support + 5 Cua, có vẽ ---
        r=await ev("""()=>{for(const r of CP.rec)r.s=1;CP.td=8;campStart(59);menuHide();document.body.classList.add('incamp');S.wcap=S.scap=S.ccap=S.cap=50;fish=[];swords=[];horses=[];crabs=[];
          for(let i=0;i<40;i++)fish.push(newFish(2));for(let i=0;i<33;i++)swords.push(newSword({lv:4}));for(let i=0;i<8;i++)horses.push(newHorse({lv:4}));for(let i=0;i<5;i++)crabs.push(newCrab({lv:5}));
          CAMP.gapT=0;for(let i=0;i<100;i++){update(.05);for(const w of swords)w.hp=w.max;for(const f of fish)f.hp=999}
          let ms=0,n=0,maxfx=0,maxb=0;for(let i=0;i<600;i++){const t0=performance.now();update(.033);draw();ms+=performance.now()-t0;n++;maxfx=Math.max(maxfx,bfx.length);maxb=Math.max(maxb,bosses.length);for(const w of swords)w.hp=w.max}
          return {msPerFrameUpdateDraw:+(ms/n).toFixed(2),maxBossFx:maxfx,maxBossesInclMinions:maxb,main:bosses.filter(b=>!b.mini&&!b.fake).length}}""")
        print('PERF',r,'ERRS',errs[:3]);await b.close()
asyncio.run(main())
