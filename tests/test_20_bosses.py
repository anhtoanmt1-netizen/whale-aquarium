import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':780});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
        await pg.add_init_script("localStorage.setItem('whale_guided','1')")
        await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1200);ev=pg.evaluate
        await ev("()=>{for(const r of CP.rec)r.s=1;MODE='menu';campStart(40);menuHide();document.body.classList.add('incamp')}")
        setup="""(bid)=>{bosses=[];bfx=[];CAMP.hits=0;CAMP.lost=0;fish=[];swords=[];horses=[];crabs=[];S.cap=50;S.wcap=50;S.scap=50;S.ccap=50;
          for(let i=0;i<8;i++){const f=newFish(2);fish.push(f)}for(let i=0;i<6;i++){const w=newSword({lv:4});swords.push(w)}for(let i=0;i<2;i++)horses.push(newHorse({lv:4}));for(let i=0;i<2;i++)crabs.push(newCrab({lv:2}));
          CAMP.wave=-1;CAMP.gapT=9999;const b=spawnBoss(bid,LV[40],'top',0,1);b.hp=b.max=1e9;b.state='fight';b.vis=1;b.y=TOP+100;return b.id}"""
        # A: từng Boss chiến đấu 90 giây giả lập (cuồng nộ thử bằng cách ép mốc máu)
        out=[]
        for bid in range(20):
            await ev(setup,bid)
            r=await ev("""(bid)=>{const fired={},orig=fireSkill;window.fireSkill=function(b,cs){fired[cs.k]=(fired[cs.k]||0)+1;return orig(b,cs)};
              let b=bosses[0],mn=1e9,drawErr=null;const hp0=swords.reduce((a,w)=>a+w.hp,0);let lostU=0,t0=performance.now(),frames=0;
              for(let i=0;i<1800;i++){ // 90s
                if(i==600){b.hp=b.max*.45}if(i==1100){b.hp=b.max*.22}if(i==1500&&bid==19){b.hp=b.max*.1}
                if(i%3==0)for(const w of swords){w.hp=Math.max(w.hp,w.max*.5)} // giữ đội hình để thấy hết kỹ năng
                update(.05);frames++;if(i%20==0){try{draw()}catch(e){drawErr=String(e)+e.stack.split('\\n')[1]}}
                for(const o of bosses)if(!o.mini&&!o.fake)mn=Math.min(mn,o.x,o.y)}
              window.fireSkill=orig;const m=bosses.find(x=>!x.mini&&!x.fake);
              return {n:BD[bid].nm,ph:m?m.ph:-1,fired,hits:CAMP.hits,lost:CAMP.lost,minions:bosses.filter(x=>x.mini).length,fakes:bosses.filter(x=>x.fake).length,drawErr,msPerFrame:+((performance.now()-t0)/frames).toFixed(2),inArena:m?(m.x>0&&m.x<W&&m.y>0&&m.y<H):null}}""",bid)
            out.append(r)
            print(bid+1,r['n'],'| ph',r['ph'],'| skills',r['fired'],'| hits',r['hits'],'lost',r['lost'],'| ms',r['msPerFrame'],'|draw',r['drawErr'],'|arena',r['inArena'])
        kinds=set()
        for r in out: kinds|=set(r['fired'].keys())
        print('SKILL KINDS FIRED',sorted(kinds),len(kinds))
        print('ERRS',errs[:5]);await b.close()
asyncio.run(main())
