let http = require("http")
let url = require("url")

http.createServer((req, resp) => {
	console.log(req.headers.origin);
	resp.writeHead(200, {'Content-Type': 'text/plain'});
	resp.end('Hello World\n');
}).listen(10003)
