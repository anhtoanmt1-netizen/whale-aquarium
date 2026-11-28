import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':780});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("localStorage.setItem('whale_guided','1')")
        await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1200);ev=pg.evaluate
        await pg.click('.mb[data-m=peace]');await pg.wait_for_timeout(1300)
        await ev("()=>{S.coins=12000;hud(true)}")
        print('1 TRƯỚC',await ev("()=>({coins:S.coins,pearls:CP.pearls,shown:getComputedStyle($('pearl')).display,btnDisabled:$('pearl').disabled,price:$('p_pearl').textContent})"))
        await pg.click('#shopb');await pg.wait_for_timeout(300)
        await pg.click('#pearl');await pg.wait_for_timeout(200)
        print('2 MUA 1',await ev("()=>({coins:S.coins,pearls:CP.pearls,saved:JSON.parse(localStorage.getItem('whale_camp')).pearls,badge:$('c_pearl').innerText})"))
        await pg.click('#pearl');await pg.wait_for_timeout(100)
        print('3 MUA THÊM (còn 2000 → phải từ chối)',await ev("()=>({coins:S.coins,pearls:CP.pearls})"))
        await ev("()=>{S.coins=60000;hud(true)}");await pg.wait_for_timeout(150)
        await pg.click('#pearl10');await pg.wait_for_timeout(150)
        print('4 ×10 hỏi xác nhận:',await ev("()=>({confirmOn:$('confirm').classList.contains('on'),text:$('cft').innerText.slice(0,70),coinsUnchanged:S.coins})"))
        await pg.click('#cfyes');await pg.wait_for_timeout(200)
        print('5 SAU XÁC NHẬN',await ev("()=>({coins:S.coins,pearls:CP.pearls,label:$('cfyes').textContent})"))
        await pg.screenshot(path='/tmp/pearl_shop.png')
        # nâng cấp sức mạnh chạm từ Cửa hàng
        await pg.click('#tdbtn');await pg.wait_for_timeout(500);await pg.screenshot(path='/tmp/pearl_td.png')
        r=await ev("()=>({tdLevel:CP.td,cost:TD[CP.td]&&TD[CP.td].cost,pearls:CP.pearls,hasBuyBtn:!!$('tdbuy'),upDisabled:$('tdup')&&$('tdup').disabled,emojiShell:document.body.innerText.includes('🐚')})")
        print('6 BẢNG NÂNG CẤP',r)
        await ev("()=>{CP.pearls=40;renderTdp()}");await pg.click('#tdup');await pg.wait_for_timeout(200)
        print('7 SAU NÂNG CẤP',await ev("()=>({tdLevel:CP.td,pearls:CP.pearls,dmg:TD[CP.td-1].d})"))
        await pg.click('#tdbuy');await pg.wait_for_timeout(150)
        print('8 ĐỔI TRONG BẢNG',await ev("()=>({coins:S.coins,pearls:CP.pearls})"))
        # chế độ chinh phục: ẩn thẻ ngọc trai, không đổi được
        await ev("()=>{$('tdp').classList.remove('on');$('shop').classList.remove('on');for(const r of CP.rec)r.s=1;campStart(1);hud(true)}");await pg.wait_for_timeout(300)
        print('9 TRONG ẢI',await ev("()=>({mode:MODE,pearlShown:getComputedStyle($('pearl')).display,buy:buyPearls(1),pearls:CP.pearls})"))
        # tải lại: giữ ngọc trai + cấp chạm
        await pg.reload();await pg.wait_for_timeout(1200)
        print('10 TẢI LẠI',await ev("()=>({pearls:CP.pearls,td:CP.td})"));print('ERRS',errs);await b.close()
asyncio.run(main())
