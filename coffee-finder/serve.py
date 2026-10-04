#!/usr/bin/env python3
"""Serve the Manhattan Coffee Finder on your local network.

Run:  python3 serve.py            (port 8080)
      python3 serve.py 9000       (custom port)

Then open the printed http://<your-computer-ip>:PORT address in Chrome or
Safari on an iPad connected to the same Wi-Fi.
"""
import http.server
import os
import socket
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
os.chdir(os.path.dirname(os.path.abspath(__file__)))


def lan_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))  # no packet is sent; picks the outbound interface
        return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        s.close()


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".md": "text/plain; charset=utf-8"}

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


with http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Manhattan Coffee Finder is running.")
    print(f"  On this computer:  http://localhost:{PORT}")
    print(f"  On your iPad:      http://{lan_ip()}:{PORT}   (same Wi-Fi)")
    print("Press Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
