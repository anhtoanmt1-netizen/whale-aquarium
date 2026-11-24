import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':780});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
        await pg.add_init_script("localStorage.setItem('whale_guided','1');if(!localStorage.getItem('whale1'))localStorage.setItem('whale1',JSON.stringify({coins:777,lv:2,cap:15,fish:[{stage:2,hunger:0,name:'Alpha'},{stage:1,hunger:0,name:'Beta'},{stage:0,hunger:0,name:'Gamma'}],warriors:[{lv:3,name:'KiemA'}],supports:[],crabList:[{lv:2,name:'CuaA'}],wcap:10}))")
        await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1500);ev=pg.evaluate
        print('1 BOOT',await ev("()=>({mode:MODE,fish:fish.length,coins:S.coins,sw:swords.length,cr:crabs.length})"))
        # chuyển sang Thủy Cung bằng nút thật
        await pg.click('.mb[data-m=peace]');await pg.wait_for_timeout(1400)
        print('2 PEACE',await ev("()=>({mode:MODE,menuOn:$('menu').classList.contains('on'),hudShown:getComputedStyle($('hud')).display,fish:fish.length,coins:S.coins})"))
        for i in range(60): await ev("()=>update(.05)")
        await pg.click('#menub');await pg.wait_for_timeout(500)
        print('3 BACK MENU',await ev("()=>({mode:MODE,menuOn:$('menu').classList.contains('on')})"))
        # survival modal
        await pg.click('.mb[data-m=surv]');await pg.wait_for_timeout(400)
        print('4 SURV',await ev("()=>({on:$('svm').classList.contains('on'),txt:$('svm').innerText.replace(/\\n/g,' ')})"));await pg.click('#svok')
        # level select
        await pg.click('.mb[data-m=camp]');await pg.wait_for_timeout(900)
        r=await ev("""()=>{const cs=[...document.querySelectorAll('#lvlist .lc')];const tops=[...new Set(cs.map(c=>Math.round(c.offsetTop)))];
          const cols=getComputedStyle(document.querySelector('.lvg')).gridTemplateColumns.split(' ').length;
          return {cells:cs.length,rows:tops.length,cols,states:cs.reduce((a,c)=>{a[c.dataset.st]=(a[c.dataset.st]||0)+1;return a},{}),hdr:[$('lvdone').textContent,$('lvstars').textContent,$('lvpearl').textContent]}}""")
        print('5 LVSEL',r)
        await pg.screenshot(path='/tmp/f_lvsel.png')
        await pg.click('#lvlist .lc[data-l="5"]');await pg.wait_for_timeout(300)
        print('6 LOCKED L5 modal?',await ev("()=>$('lvinfo').classList.contains('on')"))
        await pg.click('#lvlist .lc[data-l="1"]');await pg.wait_for_timeout(400);await pg.screenshot(path='/tmp/f_info.png')
        print('7 INFO L1',await ev("()=>$('lvinfo').classList.contains('on')"))
        snap=await ev("()=>localStorage.getItem('whale1')")
        await pg.click('#lvigo');await pg.wait_for_timeout(1500)
        print('8 CAMP START',await ev("()=>({mode:MODE,coins:S.coins,fish:fish.length,sw:swords.length,chud:getComputedStyle($('chud')).display,lvl:CAMP.lv,peaceKept:!!PEACE,peaceCoins:PEACE&&PEACE.coins})"))
        for i in range(40): await ev("()=>update(.05)")
        after=await ev("()=>localStorage.getItem('whale1')")
        a=json.loads(after);print('9 PEACE SAVE untouched while in camp: coins',a['coins'],'fish',[f.get('name') for f in a['fish']],'warriors',[w.get('name') for w in a['warriors']],'crabs',[c.get('name') for c in a['crabList']])
        await pg.screenshot(path='/tmp/f_camp.png')
        # thoát ải bằng nút → bản đồ → menu → peace: dữ liệu cũ còn nguyên, không nhân đôi
        await pg.click('#chexit');await pg.wait_for_timeout(300);await pg.click('#cfyes');await pg.wait_for_timeout(700)
        print('10 LEFT',await ev("()=>({mode:MODE,lvsel:$('lvsel').classList.contains('on'),fish:fish.map(f=>f.name),sw:swords.map(w=>w.name+w.lv),cr:crabs.map(c=>c.name+c.lv),coins:S.coins,boss:bosses.length,peace:PEACE})"))
        print('ERRS',errs[:5]);await b.close()
asyncio.run(main())
