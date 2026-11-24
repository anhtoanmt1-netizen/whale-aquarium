import asyncio,json,sys
from playwright.async_api import async_playwright
BOT="""
(L,opts)=>{
 opts=opts||{};
 for(const r of CP.rec)r.s=Math.max(r.s,1);CP.td=opts.td||(L<=2?1:L<=4?2:L<=6?3:L<=9?4:L<=13?5:L<=19?6:L<=27?7:8);
 menuHide();document.body.classList.add('incamp');campStart(L);const lv=LV[L-1];
 let T=0,lastBuy=0,lastFeed=0,lastTap=0,lastPet=0,peakLost=0,log=[];const dt=.05;
 const spend=(c)=>{if(S.coins>=c){S.coins-=c;return true}return false};
 while(!CAMP.over&&T<opts.maxT){
   T+=dt;update(dt);
   if(!CAMP||CAMP.over)break;
   lastPet+=dt;if(lastPet>=.5){lastPet=0;let lo=null;for(const f of fish)if(!lo||f.joy<lo.joy)lo=f;if(lo)lo.joy=Math.min(100,lo.joy+9)}
   // thu xu (mỗi lần quét thu hết xu đang có trên màn hình — tay người chơi giỏi + cua)
   for(const k of coins)if(!k.dead){earn(k.v);k.dead=true}
   // cho ăn
   lastFeed+=dt;if(lastFeed>.35){lastFeed=0;let n=0;for(const f of fish){if(n>=4)break;if(f.hunger>30&&!food.some(o=>Math.hypot(o.x-f.x,o.y-f.y)<160)&&food.length<24){food.push({x:f.x,y:Math.max(TOP+20,f.y-30),vx:0,vy:0,age:0});n++}}}
   // mua sắm mỗi giây (chiến thuật ổn định: cá trước, sau đó quân theo tỉ lệ)
   lastBuy+=dt;if(lastBuy>=1){lastBuy=0;
     const tgtFish=Math.min(50,Math.round(10+L*.75)),swTarget=Math.min(50,Math.round(3+L*.5));
     if(fish.length<tgtFish&&fish.length<S.cap&&S.coins>=100){S.coins-=100;fish.push(newFish())}
     if(fish.length>=S.cap&&S.cap<50&&S.cap<tgtFish+5&&S.coins>=slotCost()+200){S.coins-=slotCost();S.cap+=5}
     if(S.lv<4&&S.coins>=150*S.lv+200)spend(150*S.lv)&&S.lv++;
     if(fish.length>=Math.min(tgtFish,8)||T>lv.grace-30){
       if(swords.length<Math.min(S.wcap,swTarget)&&S.coins>=WB.buy)spend(WB.buy)&&swords.push(newSword());
       else if(swords.length>=S.wcap&&S.wcap<50&&swords.length<swTarget&&S.coins>=wslotCost())spend(wslotCost())&&(S.wcap+=5);
       const wsort=swords.slice().sort((a,b)=>a.lv-b.lv)[0];if(wsort&&wsort.lv<5&&swords.length>=Math.min(S.wcap,swTarget)&&S.coins>=wUpCost(wsort.lv)+100){const c=wUpCost(wsort.lv);S.coins-=c;wsort.spent+=c;const old=wsort.max;wsort.lv++;const st=wStat(wsort.lv);wsort.max=st.h;wsort.dmg=st.d;wsort.hp+=wsort.max-old}
       if(horses.length<Math.ceil(swords.length/4)&&horses.length<S.scap&&S.coins>=SB.buy)spend(SB.buy)&&horses.push(newHorse());
       const hs=horses.slice().sort((a,b)=>a.lv-b.lv)[0];if(hs&&hs.lv<5&&S.coins>=sUpCost(hs.lv)+300){const c=sUpCost(hs.lv);S.coins-=c;hs.spent+=c;hs.lv++}
       if(crabs.length<Math.min(6,Math.ceil(L/10)+1)&&crabs.length<S.ccap&&S.coins>=CB.buy+500)spend(CB.buy)&&crabs.push(newCrab());
     }
   }
   // hồi sinh quân bị tụt (mua lại cá nếu hồ trống)
   if(!fish.length&&S.coins>=100){S.coins-=100;fish.push(newFish())}
   // trả nhiệm vụ ngay khi đủ vàng
   if(!CAMP.paid&&S.coins>=lv.G){S.coins-=lv.G;CAMP.paid=true;CAMP.paidGold=lv.G}
   // chạm Boss 4 lần/giây vào Boss gần nhất
   lastTap+=dt;if(lastTap>=.25){lastTap=0;let bb=null,bd=1e9;for(const b of bosses)if(b.state==='fight'&&!b.fake){const d=b.hp;if(d<bd){bd=d;bb=b}}if(bb){CAMP.tapCd=0;tapBoss(bb,bb.x,bb.y)}}
   if(Math.floor(T)%60==0&&Math.abs(T-Math.round(T))<dt/2&&Math.round(T)%30==0&&opts.log)log.push({t:Math.round(T),coins:S.coins,joy:Math.round(fish.reduce((a,f)=>a+f.joy,0)/Math.max(1,fish.length)),st:[0,1,2].map(q=>fish.filter(f=>f.stage==q).length),fear:Math.round(100*fish.reduce((a,f)=>a+(f.fear||0),0)/Math.max(1,fish.length)),fish:fish.length,sw:swords.length,boss:bosses.filter(b=>!b.mini&&!b.fake).map(b=>Math.round(b.hp/b.max*100)+'%'),wave:CAMP.wave+1,paid:CAMP.paid});
 }
 const L2=LV[L-1],r=CAMP.res;
 return {L,fightT:(CAMP.fightEnd!=null&&CAMP.bossT0!=null)?Math.round(CAMP.fightEnd-CAMP.bossT0):null,over:CAMP.over,win:CAMP.win,T:Math.round(CAMP.t),G:L2.G,t3:L2.t3,t2:L2.t2,tmax:L2.tmax,stars:r&&r.sr?r.sr.stars:0,sc:r&&r.sr?r.sr.sc:0,th:[L2.th2,L2.th3],lost:CAMP.lost,hits:CAMP.hits,hitsOK:L2.hitsOK,kills:CAMP.kills,fish:fish.length,sw:swords.length,bossLeft:bosses.filter(b=>!b.mini&&!b.fake).length,wave:CAMP.wave+1+'/'+L2.wv.length,coins:S.coins,log}
}
"""
async def main():
    levels=[int(x) for x in sys.argv[1].split(',')]
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':780});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
        await pg.add_init_script("localStorage.setItem('whale_guided','1')")
        await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1000)
        for L in levels:
            r=await pg.evaluate(BOT,[L,{'maxT':1800,'log':len(sys.argv)>2}]) if False else await pg.evaluate("([L,o])=>("+BOT.strip()+")(L,o)",[L,{'maxT':1800,'log':len(sys.argv)>2}])
            print(json.dumps({k:r[k] for k in r if k!='log'}));
            [print('   ',x) for x in (r.get('log') or [])[:14]]
        print('ERRS',errs[:4]);await b.close()
asyncio.run(main())
