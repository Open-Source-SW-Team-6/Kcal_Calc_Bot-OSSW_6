var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
calculator = require('./avgkal')

console.log(calculator.avg_kg(175,40))
console.log(calculator.day_kal(65,40))
}).listen(3000,'127.0.0.1');
