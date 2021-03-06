var Polygon = require("./polygon");
//boxes is an array of arrays -
// each array is of the form [startX,startY,endX,endY,...whatever];


function Node(type,data){
    this.type = type;
    this.data = data;
    this.children = [];
}


function isInside(box,containerBox){
    var containerPolygon = new Polygon([
        //startX,startY
        [containerBox[0],containerBox[1]],
        //endX,startY
        [containerBox[2],containerBox[1]],
        //endX,endY
        [containerBox[2],containerBox[3]],
        //startX,startY
        [containerBox[0],containerBox[3]]
    ]);

    var currentPolygon = new Polygon([
        //startX,startY
        [box[0],box[1]],
        //endX,startY
        [box[2],box[1]],
        //endX,endY
        [box[2],box[3]],
        //startX,startY
        [box[0],box[3]]
    ]);
    return containerPolygon.containsPolygon(currentPolygon);
}

function isInsideNode(node,parentNode){
    return isInside(node.data,parentNode.data);
}

function remove(nodes,removables){
    for (var i = removables.length - 1; i >= 0 ; i--) {
        nodes.splice(removables[i],1);
    }
}

function insertInto(parentNode,node) {
    var foundNode = false;
    var removables = [];
    for (var i = 0; i < parentNode.children.length; i++) {
        if(isInsideNode(node,parentNode.children[i])){
            foundNode = true;
            insertInto(parentNode.children[i],node);
        }
        else if(isInsideNode(parentNode.children[i],node)){
            node.children.push(parentNode.children[i]);
            removables.push(i);
        }
    }
    remove(parentNode.children,removables);
    if(!foundNode){
        parentNode.children.push(node);
    }
}

function boxTree(boxes){

    var nodes = boxes.map(function (box) {
        return new Node("node",box);
    });
    var rootNode = new Node("root");
    for (var i = 0; i < nodes.length; i++) {
        insertInto(rootNode,nodes[i]);
    }
    return rootNode;
}

module.exports = boxTree;
