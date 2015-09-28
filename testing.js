var boxtree = require("./index");
var chalk = require('chalk');
var loadJsonFile = require('load-json-file');

var typeToComponent = [
    'Text',
    'Image',
    'Button',
    'Input',
    'Dropdown',
    'Datepicker',
    'Tabs',
    'Region'
];

function convertTree(node,destNode){

    if(node.type === "root"){
        destNode = {
            type : "Region",
            children : []
        };
        for (var i = 0; i < node.children.length; i++) {
            destNode.children.push(
                convertTree(node.children[i],destNode)
            );
        }
        return destNode;
    }
    else{
        var newNode = {
            type : typeToComponent[node.data[4]],
            children : []
        };
        for (var i = 0; i < node.children.length; i++) {
            newNode.children.push(
                convertTree(node.children[i],newNode)
            );
        }
        return newNode;
    }
}

loadJsonFile('test/test.json')
    .then(function (json) {
        return json.boxes.map(function (box) {
            return [
                box.startX,
                box.startY,
                box.endX,
                box.endY,
                box.type
            ];
        })
    })
    .then(function(boxes){
        var tree = boxtree(boxes);
        console.log(tree);
        console.log(convertTree(tree));
    });
