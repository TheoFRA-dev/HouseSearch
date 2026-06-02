import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

port = int(os.environ.get("PORT", 3000))

class SilentHTTPRequestHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

if __name__ == "__main__":
    server_address = ("0.0.0.0", port)
    handler_class = SilentHTTPRequestHandler
    httpd = HTTPServer(server_address, handler_class)
    print(f"Serving on port {port}")
    httpd.serve_forever()
