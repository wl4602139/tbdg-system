# -*- coding: utf-8 -*-
import http.server
import socketserver
import os
import socket
import sys

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8080
HTML_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "html")

def get_lan_ips():
    ips = ["127.0.0.1", "localhost"]
    try:
        hostname = socket.gethostname()
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if not ip.startswith("127."):
                ips.append(ip)
    except Exception:
        pass
    return list(set(ips))

class LanHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=HTML_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        mime = super().guess_type(path)
        if path.endswith('.js') or path.endswith('.mjs'):
            return 'application/javascript; charset=utf-8'
        if path.endswith('.css'):
            return 'text/css; charset=utf-8'
        if path.endswith('.html'):
            return 'text/html; charset=utf-8'
        if path.endswith('.json'):
            return 'application/json; charset=utf-8'
        if path.endswith('.svg'):
            return 'image/svg+xml'
        return mime

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

def main():
    os.chdir(HTML_DIR)
    lan_ips = get_lan_ips()
    
    server_address = ('0.0.0.0', PORT)
    try:
        httpd = ThreadingHTTPServer(server_address, LanHandler)
    except OSError:
        httpd = ThreadingHTTPServer(('0.0.0.0', 8000), LanHandler)

    active_port = httpd.server_address[1]
    
    print("=" * 60)
    print("【特变电工能碳双中心 HTML 原型 · 局域网服务已启动】")
    print("根目录: " + str(HTML_DIR))
    print("本机访问: http://localhost:" + str(active_port) + "/")
    print("局域网设备访问地址:")
    for ip in lan_ips:
        if not ip.startswith("127.") and ip != "localhost":
            print("  -> http://" + str(ip) + ":" + str(active_port) + "/")
    print("=" * 60)
    print("提示: 服务正在运行中...")
    
    httpd.serve_forever()

if __name__ == '__main__':
    main()
