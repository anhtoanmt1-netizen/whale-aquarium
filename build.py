#!/usr/bin/env python3
"""Gộp mã nguồn trong src/ thành 1 file index.html tự chạy được (dán 1 file là chơi).
Chạy:  python3 tools/build.py   (từ thư mục gốc của dự án)"""
import re,os,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=os.path.join(ROOT,'src')
t=open(os.path.join(SRC,'index.src.html'),encoding='utf8').read()
css=open(os.path.join(SRC,'css','style.css'),encoding='utf8').read()
t=t.replace('<link rel="stylesheet" href="css/style.css">','<style>\n'+css+'</style>')
mods=re.findall(r'<script src="(js/[^"]+)"></script>',t)
parts=[]
for m in mods:
    body=open(os.path.join(SRC,m),encoding='utf8').read().rstrip('\n')
    assert '</script' not in body.lower(),m
    parts.append((m,'<script>\n/* ===== '+m+' ===== */\n'+body+'\n</script>'))
first=t.index('<script src="'+mods[0]+'">')
last_tag='<script src="'+mods[-1]+'"></script>'
last_end=t.index(last_tag)+len(last_tag)
head=t[:first];tail=t[last_end:]
text=head
starts=[]
for m,blk in parts:
    starts.append((text.count('\n')+1,m));text+=blk+'\n'
mp=','.join('[%d,"%s"]'%(l,m) for l,m in starts)
text+='<script>window.__where=function(l){var r="";[%s].forEach(function(x){if(l>=x[0])r=x[1]});return r}</script>'%mp+tail
open(os.path.join(ROOT,'index.html'),'w',encoding='utf8').write(text)
print('Đã tạo index.html (%d KB) từ %d module'%(len(text.encode('utf8'))//1024,len(mods)))
