'use strict';

angular.module('environmentApp')
.controller('MainCtrl', function ($scope) {
  $scope.title = 'Truss generator';
  
  var CANVAS_WIDTH = 800;
  var CANVAS_HEIGHT = 600;
  
  $scope.supports = [
    {
      label: 'Fixed support',
      value: 'fixed'
    },
    {
      label: 'Rolling support',
      value: 'rolling'
    }
  ];
  
  $scope.nodes = [
    {
      x: 0,
      y: 0
    },
    {
      x: 100,
      y: 0
    },
    {
      x: 100,
      y: 100
    },
    {
      x: 0,
      y: 100
    }
  ];
  
  $scope.newElement = {
    startNode: null,
    endNode: null
  };
  
  $scope.elements = [];
  
  $scope.mat1 = [[]];
  
  var elem = document.getElementById('truss-canvas');
  var params = { width: CANVAS_WIDTH, height: CANVAS_HEIGHT };
  var two = new Two(params).appendTo(elem);
  
  for(var i = 0; i < $scope.nodes.length; i++){
    $scope.nodes[i].nodeGraph = two.makeCircle($scope.nodes[i].x + 50, $scope.nodes[i].y + 50, 10);
    $scope.nodes[i].nodeGraph.fill = '#ccc';
    $scope.nodes[i].nodeGraph.stroke = '#000';
    $scope.nodes[i].nodeGraph.linewidth = 2;
  };
  two.update();
  
  $scope.addNode = function() {
    
    var newNode = {
      x: 0,
      y: 0,
      nodeGraph: two.makeCircle(50, 50, 10)
    };
    newNode.nodeGraph.fill = '#ccc';
    newNode.nodeGraph.stroke = '#000';
    newNode.nodeGraph.linewidth = 1;
    $scope.nodes.push(newNode);
    two.update();
  };
  
  $scope.updateNode = function(i) {
    
    var node = $scope.nodes[i];
    node.nodeGraph.translation.set(node.x + 50, node.y + 50);
    two.update();
  };
  
  $scope.removeNode = function(i) {
    
    two.remove($scope.nodes[i].nodeGraph);
    two.update();
    $scope.nodes.splice(i, 1);
  };
  
  $scope.buildNodeLabel = function(str) {
    
    return parseInt(str) + 1;
  };
  
  $scope.addElement = function() {
    
    var newElement = {
      startNode: $scope.newElement.startNode,
      endNode: $scope.newElement.endNode
    };
    
    var startNode = $scope.nodes[newElement.startNode];
    var endNode = $scope.nodes[newElement.endNode];
    
    newElement.elemGraph = two.makeLine(startNode.x + 50, startNode.y + 50, endNode.x + 50, endNode.y + 50);
    newElement.elemGraph.fill = '#000';
    newElement.elemGraph.stroke = '#000';
    newElement.elemGraph.linewidth = 2;
    $scope.elements.push(newElement);
    two.update();
  };
  
  $scope.removeElement = function(i) {
    
    two.remove($scope.elements[i].elemGraph);
    two.update();
    $scope.elements.splice(i, 1);
  }
  
  $scope.calculateElemLength = function(startIndex, endIndex) {
    
    var startNode = $scope.nodes[startIndex];
    var endNode = $scope.nodes[endIndex];
    var xLine = endNode.x - startNode.x;
    var yLine = endNode.y - startNode.y;
    
    return Math.sqrt(Math.pow(xLine, 2)+Math.pow(yLine, 2));
  };
  
  $scope.calculateElemCosDirX = function(startIndex, endIndex) {
    
    var startNode = $scope.nodes[startIndex];
    var endNode = $scope.nodes[endIndex];
    return (endNode.x - startNode.x)/$scope.calculateElemLength(startIndex, endIndex);
  };
  
  $scope.calculateElemCosDirY = function(startIndex, endIndex) {
    
    var startNode = $scope.nodes[startIndex];
    var endNode = $scope.nodes[endIndex];
    return (endNode.y - startNode.y)/$scope.calculateElemLength(startIndex, endIndex);
  };
  
  $scope.buildMat1 = function() {
    
    $scope.mat1 = [];
    var nodes = $scope.nodes;
    var elements = $scope.elements;
    
    for(var i = 0; i < nodes.length; i++){
      var rowX = {
        label: 'Node' + (parseInt(i)+1) + '-X',
        columns: []
      };
      var rowY = {
        label: 'Node' + (parseInt(i)+1) + '-Y',
        columns: []
      };
      
      for(var j = 0; j < elements.length; j++){
        
        var localStartNode = parseInt(elements[j].startNode);
        var localEndNode = parseInt(elements[j].endNode);
        var xcolumn = {
          key: 'xcos-'+ j,
          value: 0
        }
        var ycolumn = {
          key: 'ycos-'+ j,
          value: 0
        }
        
        if(localStartNode == i){
          xcolumn.value = $scope.calculateElemCosDirX(localStartNode, localEndNode);
          ycolumn.value = $scope.calculateElemCosDirY(localStartNode, localEndNode);
        }
        else if(localEndNode == i){
          xcolumn.value = -$scope.calculateElemCosDirX(localStartNode, localEndNode);
          ycolumn.value = -$scope.calculateElemCosDirY(localStartNode, localEndNode);
        }
        rowX.columns.push(xcolumn);
        rowY.columns.push(ycolumn);
      }
      var reactObjX = {
        key: 'react-x' + i,
        notNumber: true,
        value: '-'
      };
      var reactObjY = {
        key: 'react-y' + i,
        notNumber: true,
        value: '-'
      };
      var reactValObjX = {
        key: 'react-val-x' + i,
        notNumber: true,
        value: '-'
      };
      var reactValObjY = {
        key: 'react-val-y' + i,
        notNumber: true,
        value: '-'
      };
      if(nodes[i].support){
        if(nodes[i].support == 'fixed'){
          reactObjX.value = 'Rx';
          reactObjY.value = 'Ry';
          reactValObjX.value = '?';
          reactValObjY.value = '?';

        }
        else{
          reactObjX.value = 'Rx';
          reactObjY.value = 'Ry';
          reactValObjX.value = '?';
          reactValObjY.value = '?';
        }
        rowX.columns.push(reactObjX);
        rowX.columns.push(reactValObjX);
        rowY.columns.push(reactObjY);
        rowY.columns.push(reactValObjY);
      }
      else{
        rowX.columns.push(reactObjX);
        rowX.columns.push(reactValObjX);
        rowY.columns.push(reactObjY);
        rowY.columns.push(reactValObjY);
      }
      
      $scope.mat1.push(rowX);
      $scope.mat1.push(rowY);
    }
  };
  
});
