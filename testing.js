var boxtree = require("./index");
var chalk = require('chalk');
var loadJsonFile = require('load-json-file');

loadJsonFile('test/1.json')
    .then(function (json) {
        return json.boxes.map(function (box) {
            return [
                box.startX,
                box.startY,
                box.endX,
                box.endY
            ];
        })
    })
    .then(function(boxes){
        console.log(boxtree(boxes));
    });
