const http = require('http');

http.createServer((req, res) => {
  res.end("test IaaS VM!");
}).listen(3000, '0.0.0.0');