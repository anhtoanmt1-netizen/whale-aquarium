import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1280,'height':800})).new_page()
        await pg.add_init_script("localStorage.setItem('whale_guided','1')")
        await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1500)
        await pg.evaluate("""()=>{const cv2=document.createElement('canvas');cv2.width=1280;cv2.height=800;cv2.style.cssText='position:fixed;left:0;top:0;z-index:99;background:#2a86c0';document.body.appendChild(cv2);const X=cv2.getContext('2d');
          const NP=16;const ims={sword:img('sword'),horse:img('horse')};
          for(const nm of['sword','horse']){const sp=DFM[nm];dfmBind(sp,ims[nm]);sp.s=.95;sp.fr={};}
          const rowS=[0,4,8,12],rowH=[0,3,6,9,12,15];
          rowS.forEach((k,i)=>{const fr=dfmFrame(DFM.sword,1,k,NP);X.drawImage(fr.cv,(i%2)*420+4,Math.floor(i/2)*270,fr.cv.width*.98,fr.cv.height*.98)});
          X.fillStyle='#fff';X.font='13px sans-serif';
          rowH.forEach((k,i)=>{const fr=dfmFrame(DFM.horse,1,k,NP);X.drawImage(fr.cv,860+(i%2)*190,Math.floor(i/2)*270,fr.cv.width*.7,fr.cv.height*.7)});}""")
        await pg.screenshot(path='/tmp/dfm_big.png');await b.close()
asyncio.run(main())
