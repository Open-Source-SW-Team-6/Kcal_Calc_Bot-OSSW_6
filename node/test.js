var express = require('express');
var http = require('http');
var calc = require('./avgkal')
var app = express();

http.createServer(app).listen(3000, function() {
    console.log('예제 코드...');
    console.log(calc.stWeight(168.7, 1) + "");
    console.log(calc.dayKcal(24, 1, 168.7, 59.7, 1.11)+"kcal")
});