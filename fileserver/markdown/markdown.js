let http = require("http");
let url = require("url");
let util = require("util");
let fs = require("fs");
let showdown = require("showdown");
let converter = new showdown.Converter()


http.createServer((req, resp) => {
	try{
		let params = url.parse(req.url, true).query;
		let id = params.id;
		console.log(params);
		console.log("server/work/" + id + "/introduction.md");
		if (!fs.existsSync("../server/work/" + id + "/introduction.md")) {
			resp.writeHead(404, {'Content-Type': 'text/plain'});
			resp.end('File not found\n');
			return;
		}
		let content = fs.readFileSync("../server/work/" + id + "/introduction.md").toString();
		let rendered = converter.makeHtml(content);
		let html = "<html><head><meta charset='utf-8'></head><body>"+rendered+"</body></html>";
		console.log(html)
		resp.writeHead(200, {'Content-Type': 'text/html', "Access-Control-Allow-Origin": "*"});
		resp.end(html);
	} catch (e) {
		console.error(e);
		resp.writeHead(500, {'Content-Type': 'text/plain'});
		resp.end("server error/n");
	}
}).listen(10002);

console.log("Server started at 10002...")
