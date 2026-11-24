import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':780});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
        await pg.add_init_script("localStorage.setItem('whale_guided','1')")
        await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1000);ev=pg.evaluate
        await ev("""()=>{for(const r of CP.rec)r.s=1;CP.td=6;campStart(45);menuHide();document.body.classList.add('incamp');resetClock();
          S.wcap=S.scap=S.ccap=S.cap=50;for(let i=0;i<10;i++)fish.push(newFish(2));for(let i=0;i<8;i++){const w=newSword({lv:3});swords.push(w)}for(let i=0;i<3;i++)horses.push(newHorse({lv:3}));
          CAMP.gapT=1e9;bosses=[];
          const mk=(bid,x,y,sk)=>{const b=spawnBoss(bid,LV[44],'top',0,1);b.state='fight';b.vis=1;b.x=x;b.y=y;b.skills=[{k:sk,cd:999,t:0,ph:0}];b.skGap=0;b.hp=b.max*.9;return b};
          mk(12,110,300,'hole');mk(5,300,200,'laser');mk(16,200,520,'meteor');}""")
        await pg.wait_for_timeout(1500);await pg.screenshot(path='/tmp/v_a.png')
        await pg.wait_for_timeout(1800);await pg.screenshot(path='/tmp/v_b.png')
        # chạm tay thật bằng chuột vào Boss + hiệu ứng cấp 6
        pos=await ev("()=>{const b=bosses.find(x=>x.bid==16);return [b.x/Z,b.y/Z,b.hp]}")
        await pg.mouse.click(pos[0],pos[1]);await pg.wait_for_timeout(120);await pg.screenshot(path='/tmp/v_c.png')
        hp2=await ev("()=>bosses.find(x=>x.bid==16).hp")
        print('MOUSE TAP dmg',round(pos[2]-hp2),'(kỳ vọng ≈',36,'cấp 6, có thể trừ hồi máu/khiên)','errs',errs[:3]);await b.close()
asyncio.run(main())
