import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':780});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
        await pg.add_init_script("localStorage.setItem('whale_guided','1')")
        await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1200);ev=pg.evaluate
        await ev("()=>{menuHide();document.body.classList.add('incamp')}")
        # --- Hút máu (leech) ---
        r=await ev("""()=>{for(const r of CP.rec)r.s=1;campStart(30);bosses=[];fish=[];swords=[];horses=[];crabs=[];for(let i=0;i<5;i++){const w=newSword({lv:3});swords.push(w);w.x=200;w.y=300}
          CAMP.gapT=9999;const b=spawnBoss(8,LV[29],'top',0,1);b.state='fight';b.vis=1;b.hp=b.max*.5;b.x=200;b.y=250;b.skills=b.skills.filter(s=>s.k=='leech');b.skills[0].t=0;b.skGap=0;
          let casted=false,hp0=b.hp,healed=0,dmgU=0;const w0=swords.reduce((a,w)=>a+w.hp,0);
          for(let i=0;i<80;i++){if(b.cast&&b.cast.k=='leech')casted=true;update(.05)}
          return {casted,bossHpGain:Math.round(b.hp-hp0),unitDmg:Math.round(w0-swords.reduce((a,w)=>a+w.hp,0))}}""")
        print('LEECH',r)
        # --- 5 Boss cùng lúc ---
        r=await ev("""()=>{campStart(58);bosses=[];fish=[];swords=[];horses=[];crabs=[];for(let i=0;i<6;i++){fish.push(newFish(2));swords.push(newSword({lv:3}))}
          CAMP.gapT=0;for(let i=0;i<150;i++){update(.05);for(const w of swords)w.hp=w.max}
          const bs=bosses.filter(x=>!x.mini&&!x.fake);let minr=9,out=0;for(let i=0;i<bs.length;i++){if(bs[i].x<-5||bs[i].x>W+5||bs[i].y<TOP-5||bs[i].y>H+5)out++;for(let j=i+1;j<bs.length;j++)minr=Math.min(minr,Math.hypot(bs[i].x-bs[j].x,bs[i].y-bs[j].y)/(bs[i].r+bs[j].r))}
          return {n:bs.length,states:bs.map(x=>x.state),sides:bs.map(x=>x.side),minSepRatio:+minr.toFixed(2),outside:out,wave:CAMP.wave}}""")
        print('MULTI5',r)
        # --- sát thương chạm, khiên, miễn nhiễm khi đổi giai đoạn ---
        r=await ev("""()=>{campStart(5);bosses=[];fish=[];swords=[];horses=[];crabs=[];CAMP.gapT=9999;const b=spawnBoss(0,LV[4],'top',0,1);b.state='fight';b.vis=1;b.hp=b.max=10000;b.skills=[];const o={};
          const dmgAt=lv=>{CP.td=lv;CAMP.tapCd=0;const h=b.hp;tapBoss(b,b.x,b.y);return Math.round(h-b.hp)};
          o.dmgPerLevel=[1,2,3,4,5,6,7,8].map(dmgAt);CP.td=1;CAMP.tapCd=0;tapBoss(b,b.x,b.y);const h1=b.hp;tapBoss(b,b.x,b.y);o.cooldownBlocks=(b.hp==h1);
          b.shield=b.shieldMax=100;CAMP.tapCd=0;CP.td=8;const hh=b.hp;tapBoss(b,b.x,b.y);o.shieldAbsorb={hpLost:Math.round(hh-b.hp),shieldLeft:Math.round(b.shield)};
          b.state='trans';const hh2=b.hp;bossHit(b,500,'x',b.x,b.y,false);o.transInvuln=(b.hp==hh2);b.state='fight';
          const sw=newSword({lv:1});swords.push(sw);sw.x=b.x;sw.y=b.y;const hs=b.hp;b.shield=0;dmgFoe(b,sw.dmg,sw.name,b.x,b.y);o.swordDmg=Math.round(hs-b.hp);o.tapStats=CAMP.taps;return o}""")
        print('DAMAGE',r)
        # --- luồng hoàn thành ải 1 ---
        r=await ev("""()=>{CP=migrateCamp(null);saveCamp();campStart(1);CAMP.gapT=0;const o={};fish=fish.slice(0,3);
          for(let i=0;i<5;i++)update(.05);o.wave=CAMP.wave;o.bosses=bosses.length;
          // đủ vàng nhưng CHƯA bấm trả
          S.coins=2500;campHud(true);o.btnEnabled=!$('cqbtn').disabled;const c0=S.coins;for(let i=0;i<40;i++)update(.05);o.autoDeduct=(S.coins!=c0);o.paid0=CAMP.paid;
          // hạ Boss trước khi trả → chưa hoàn thành
          const b=bosses.find(x=>!x.mini);b.state='fight';b.vis=1;b.hp=3;CAMP.tapCd=0;CP.td=1;tapBoss(b,b.x,b.y);for(let i=0;i<60;i++)update(.05);o.bossDone=CAMP.bossDone;o.overBeforePay=CAMP.over;o.kills=CAMP.kills;
          return o}""")
        print('FLOW-A',r)
        await pg.click('#cqbtn',force=True);await pg.wait_for_timeout(200)
        print('CONFIRM TEXT',await ev("()=>({on:$('confirm').classList.contains('on'),txt:$('cft').innerText.replace(/\\n/g,' ').slice(0,90),coins:S.coins,paid:CAMP.paid,label:$('cfyes').textContent})"))
        await pg.click('#cfno');await pg.wait_for_timeout(200)
        print('CANCEL',await ev("()=>({coins:S.coins,paid:CAMP.paid,label:$('cfyes').textContent})"))
        await pg.click('#cqbtn',force=True);await pg.wait_for_timeout(100);await pg.click('#cfyes');await pg.wait_for_timeout(300)
        print('PAID',await ev("()=>({coins:S.coins,paid:CAMP.paid})"))
        await ev("()=>{for(let i=0;i<10;i++)update(.05)}");await pg.wait_for_timeout(400)
        r=await ev("()=>({over:CAMP.over,win:CAMP.win,res:CAMP.res&&{stars:CAMP.res.sr.stars,sc:CAMP.res.sr.sc,p:CAMP.res.sr.p,pearls:CAMP.res.pearls},rec1:CP.rec[0],unlock2:unlocked(1),unlock3:unlocked(2),panel:$('cres').classList.contains('on'),pearls:CP.pearls})")
        print('WIN',json.dumps(r))
        await pg.screenshot(path='/tmp/f_win.png')
        # --- chơi lại với kết quả TỆ HƠN: thành tích cũ phải giữ ---
        await pg.click('#rretry');await pg.wait_for_timeout(1300)
        r=await ev("""()=>{const best={...CP.rec[0]};CAMP.gapT=0;for(let i=0;i<5;i++)update(.05);const b=bosses.find(x=>!x.mini);b.state='fight';b.vis=1;b.hp=2;CAMP.t=900;CAMP.hits=40;CAMP.lost=20;S.coins=2100;CAMP.paid=true;S.coins-=2000;CAMP.tapCd=0;tapBoss(b,b.x,b.y);for(let i=0;i<80;i++)update(.05);
          return {best,after:{...CP.rec[0]},stars:CAMP.res&&CAMP.res.sr.stars,sc:CAMP.res&&CAMP.res.sr.sc,pearlsGain:CAMP.res&&CAMP.res.pearls,plays:CP.rec[0].n,clears:CP.rec[0].c}}""")
        print('REPLAY-WORSE',json.dumps(r))
        print('ERRS',errs[:5]);await b.close()
asyncio.run(main())
