import asyncio,json
from playwright.async_api import async_playwright
OLD="localStorage.setItem('whale_guided','1');if(!localStorage.getItem('whale1'))localStorage.setItem('whale1',JSON.stringify({coins:4321,lv:3,cap:20,fish:[{stage:2,hunger:0,name:'Alpha'},{stage:2,hunger:0,name:'Beta'},{stage:1,hunger:0,name:'Gamma'},{stage:2,hunger:0,name:'Delta'}],warriors:[{lv:3,name:'KiemA'},{lv:2,name:'KiemB'}],supports:[{lv:2,name:'HoiMau'}],crabList:[{lv:2,name:'CuaA'}],wcap:10,ccap:5,zoom:1}))"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':780});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
        await pg.add_init_script(OLD)
        await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1200);ev=pg.evaluate
        print('A LEGACY SAVE LOADS',await ev("()=>({fish:fish.map(f=>f.name),sw:swords.map(w=>w.name+w.lv),hs:horses.map(h=>h.name),cr:crabs.map(c=>c.name),coins:S.coins,Z,camp:{pearls:CP.pearls,td:CP.td,rec0:CP.rec[0]}})"))
        # chuyển chế độ nhiều lần: không nhân bản đối tượng, dữ liệu Thủy Cung bất biến
        r=await ev("""()=>{const snap=()=>JSON.stringify({f:fish.map(f=>f.name),s:swords.map(w=>w.name+w.lv),h:horses.map(h=>h.name),c:crabs.map(c=>c.name),coins:S.coins,cap:S.cap,wcap:S.wcap});const base=snap();const res=[];
          for(const r of CP.rec)r.s=1;
          for(let i=0;i<6;i++){campStart(1+i*3);for(let k=0;k<30;k++)update(.05);const inCamp={fish:fish.length,sw:swords.length,coins:S.coins>0};leaveCamp_test:{campExit()}menuHide();MODE='peace';for(let k=0;k<20;k++)update(.05);res.push(snap()===base)}
          return {allIdentical:res.every(Boolean),runs:res.length,counts:{fish:fish.length,sw:swords.length,hs:horses.length,cr:crabs.length,bosses:bosses.length,bfx:bfx.length}}}""")
        print('B REPEATED SWITCH',r)
        # lưu & nạp lại dữ liệu chiến dịch
        await ev("()=>{CP.pearls=321;CP.td=5;CP.rec[0].s=3;CP.rec[0].t=123;CP.rec[1].s=2;saveCamp();save()}")
        await pg.reload();await pg.wait_for_timeout(1200)
        print('C RELOAD',await ev("()=>({pearls:CP.pearls,td:CP.td,r0:CP.rec[0],r1:CP.rec[1].s,unlock3:unlocked(2),unlock4:unlocked(3),peaceFish:fish.map(f=>f.name),coins:S.coins})"))
        # dữ liệu hỏng / thiếu
        for bad in ['{"v":1,"pearls":"abc","td":99,"rec":"x","hist":[1,2,{"lv":99}]}','not json at all','{"rec":[{"s":9,"t":-5,"k":"zz"},null,5],"pearls":-50,"td":0}','null']:
            r=await ev("""(bad)=>{localStorage.setItem('whale_camp',bad);const c=loadCamp();return {pearls:c.pearls,td:c.td,len:c.rec.length,s0:c.rec[0].s,t0:c.rec[0].t,k0:c.rec[0].k,ok:c.rec.every(r=>r.s>=0&&r.s<=3&&r.t>=0),hist:c.hist.length}}""",bad)
            print('D BAD',bad[:40],'->',r)
        # chạm cảm ứng khi đang thu phóng (zoom 1.5 và 2.25) vào Boss
        r=await ev("""()=>{localStorage.removeItem('whale_camp');CP=loadCamp();for(const r of CP.rec)r.s=1;CP.td=3;campStart(5);menuHide();document.body.classList.add('incamp');resetClock();bosses=[];CAMP.gapT=1e9;const o=[];
          for(const z of [1,2]){setZoom(z);bosses=[];const b=spawnBoss(0,LV[4],'top',0,1);b.state='fight';b.vis=1;b.x=W*.5;b.y=H*.5;b.hp=b.max=5000;b.skills=[];CAMP.tapCd=0;
            const sx=b.x/Z,sy=b.y/Z;cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:sx,clientY:sy,pointerType:'touch',bubbles:true}));o.push({zoom:Z,dmg:Math.round(5000-b.hp),expect:TD[2].d})}
          setZoom(0);return o}""")
        print('E TOUCH AT ZOOM',r)
        # hồi quy Thủy Cung: quái thường + Chiến Binh đánh, tụ đàn, cua, chạm tay
        r=await ev("""()=>{campExit_safe:{if(MODE==='camp')campExit()}localStorage.setItem('whale_camp',JSON.stringify(CP));menuHide();MODE='peace';alien=null;bosses=[];spawnAlien('red');alien.x=W/2;alien.y=TOP+50;const a=alien;let fearMax=0,shoal=false;
          for(let i=0;i<300&&alien;i++){update(.05);fearMax=Math.max(fearMax,...fish.map(f=>f.fear||0));if(SHL)shoal=true}
          const killed=!alien;let tap=null;if(!killed){alien.x=100;alien.y=300;const h0=alien.hp;tapFoes(100,300);tap=h0-alien.hp}
          return {swordsAttackedOrAlienDead:killed||alien.hp<a.max,fearMax:+fearMax.toFixed(2),shoalUsed:shoal,tapDmgOnAlien:tap,mode:MODE}}""")
        print('F PEACE REGRESSION',r)
        print('ERRS',errs[:5]);await b.close()
asyncio.run(main())
