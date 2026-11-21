#!/usr/bin/env python3
"""Tinh chỉnh dự án Android do Capacitor sinh ra: số phiên bản, toàn màn hình, tai thỏ."""
import os, re, sys
code = os.environ.get('VERSION_CODE', '1'); name = os.environ.get('VERSION_NAME', '1.0')
base = 'android/app'

def edit(path, fn):
    if not os.path.exists(path): print('Bỏ qua (không có):', path); return
    s = open(path, encoding='utf8').read(); n = fn(s)
    if n != s: open(path, 'w', encoding='utf8').write(n); print('Đã sửa:', path)
    else: print('Không đổi:', path)

edit(base + '/build.gradle', lambda s: re.sub(r'versionName\s+"[^"]*"', 'versionName "%s"' % name,
     re.sub(r'versionCode\s+\d+', 'versionCode %s' % code, s)))

def theme(s):
    if 'windowFullscreen' in s: return s
    add = ('        <item name="android:windowFullscreen">true</item>\n'
           '        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>\n')
    return re.sub(r'(<style name="AppTheme\.NoActionBar"[^>]*>\n)', r'\1' + add, s, count=1)
edit(base + '/src/main/res/values/styles.xml', theme)
