import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':390,'height':780})).new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("localStorage.setItem('whale_guided','1')")
        await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1200);ev=pg.evaluate
        await ev("()=>{menuHide();MODE='peace'}")
        out={}
        for tab in ['a','b','c']:
            await ev("(t)=>{mTab=t;openMInfo()}",tab);await pg.wait_for_timeout(300)
            out[tab]=await ev("()=>({cards:document.querySelectorAll('#mcards .fc').length,names:[...document.querySelectorAll('#mcards .mn')].map(x=>x.textContent),zones:document.querySelectorAll('#mcards .mzh').length,skills:document.querySelectorAll('#mcards .skc').length})")
        print('Tab A',out['a']['cards'],out['a']['names']);print('Tab B',out['b']['cards'],'zones',out['b']['zones'],'skill rows',out['b']['skills']);print('Tab C',out['c']['cards'],out['c']['names'])
        # đối chiếu: mọi Boss trong BD và mọi quái trong MON đều có thẻ
        chk=await ev("()=>{mTab='b';renderM();const nb=[...document.querySelectorAll('#mcards .mn')].map(x=>x.textContent);const miss=BD.filter((d,i)=>!nb.some(n=>n.includes(d.nm))).map(d=>d.nm);mTab='a';renderM();const na=[...document.querySelectorAll('#mcards .mn')].map(x=>x.textContent);const miss2=MK.filter(k=>!na.includes(MON[k].n));return {missingBosses:miss,missingMonsters:miss2,skillKindsUsed:[...new Set(BD.flatMap(d=>d.sk.map(s=>s[0])))].filter(k=>!SKD[k]||!SKI[k]||!SKN[k])}}")
        print('ĐỐI CHIẾU thiếu sót:',chk)
        await ev("()=>{mTab='b';openMInfo()}");await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/mon_b.png')
        await ev("()=>{document.querySelector('#minfo .pn').scrollTop=2600}");await pg.wait_for_timeout(200);await pg.screenshot(path='/tmp/mon_b2.png')
        print('ERRS',errs);await b.close()
asyncio.run(main())
