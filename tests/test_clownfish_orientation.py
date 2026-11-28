import asyncio,json
from playwright.async_api import async_playwright
SIM=open('/tmp/t_orient.py').read().split('SIM="""')[1].split('"""')[0]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':390,'height':780})).new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("localStorage.setItem('whale_guided','1')")
        await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1200)
        for name,vw,vh in [('DỌC',390,780),('NGANG',844,390)]:
            await pg.set_viewport_size({'width':vw,'height':vh});await pg.wait_for_timeout(400)
            await pg.evaluate(SIM)
            r=await pg.evaluate("""()=>{const st={n:0,wall:0,cornerStill:0,offscreen:0},tr=new Map();let maxPi=0;
              for(let k=0;k<2400;k++){update(.05);for(const f of fish){st.n++;const nearW=f.x<30||f.x>W-30||f.y<TOP+10||f.y>H-30;if(nearW)st.wall++;if(f.x<0||f.x>W||f.y<0||f.y>H)st.offscreen++;
                const nc=(f.x<100||f.x>W-100)&&(f.y<TOP+90||f.y>H-100)&&Math.hypot(f.vx||0,f.vy||0)<10;const t0=tr.get(f)||0;tr.set(f,nc?t0+.05:0);if(tr.get(f)>3)st.cornerStill++;if(f._pi!==undefined)maxPi=Math.max(maxPi,Math.abs(f._pi))}}
              return {fish:fish.length,wallFrac:+(st.wall/st.n).toFixed(3),cornerStuck:st.cornerStill,offscreen:st.offscreen,maxPitchFish:+maxPi.toFixed(2)}}""")
            print('Cá hề',name,r)
            for k in range(30): await pg.evaluate("()=>{}")
            await pg.wait_for_timeout(900);await pg.screenshot(path=f'/tmp/sw_{vw}.png')
        print('ERRS',errs);await b.close()
asyncio.run(main())
