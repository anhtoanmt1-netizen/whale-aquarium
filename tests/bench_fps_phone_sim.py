import asyncio,json
from playwright.async_api import async_playwright
SETUP=open('/tmp/bench.py').read().split('SETUP="""')[1].split('"""')[0]
async def one(url,label,perf,autoq,thr=4):
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':780},device_scale_factor=2.75);pg=await ctx.new_page()
        cdp=await ctx.new_cdp_session(pg);await cdp.send('Emulation.setCPUThrottlingRate',{'rate':thr})
        await pg.add_init_script("localStorage.setItem('whale_guided','1')")
        await pg.goto(url);await pg.wait_for_timeout(1200)
        await pg.evaluate("(a)=>{window.__perf=a[0];S.autoq=a[1];}",[perf,autoq])
        await pg.evaluate(SETUP)
        await pg.evaluate("()=>{for(let i=0;i<120;i++){update(.033);draw()}}")   # tương đương thời gian làm nóng trong Menu
        await pg.evaluate("(a)=>{S.perf=a;PF=PERFS[a];resize();buildFx()}",perf)
        await pg.wait_for_timeout(1500)
        r=await pg.evaluate("""()=>new Promise(res=>{const T=window.__T;T.u=T.d=T.n=0;let n=0,t0=performance.now();function f(t){n++;if(t-t0<6000)requestAnimationFrame(f);else res({fps:+(n*1000/(t-t0)).toFixed(1),updMs:+(T.u/Math.max(1,T.n)).toFixed(2),drawMs:+(T.d/Math.max(1,T.n)).toFixed(2),dpr:+DPR.toFixed(2),QL:typeof QL=='undefined'?'-':QL,heapMB:performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null})}requestAnimationFrame(f)})""")
        print(f'{label:34s}',json.dumps(r));await b.close()
async def main():
    for perf in ['eco','high']:
        await one('http://localhost:8766/index.html',f'CŨ  v15 · {perf}',perf,False)
        await one('http://localhost:8765/index.html',f'MỚI v16 · {perf} · tự điều chỉnh TẮT',perf,False)
        await one('http://localhost:8765/index.html',f'MỚI v16 · {perf} · tự điều chỉnh BẬT',perf,True)
asyncio.run(main())
