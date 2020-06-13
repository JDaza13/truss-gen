'use strict';

angular.module('environmentApp')
.controller('MainCtrl', function ($scope) {
  $scope.title = 'Truss generator';
  
  var CANVAS_WIDTH = 800;
  var CANVAS_HEIGHT = 600;
  
  $scope.supports = initSupports;
  $scope.nodes = initNodes;
  
  $scope.newElement = {
    startNode: null,
    endNode: null
  };
  
  $scope.elements = initElements;
  
  $scope.mat1 = [[]];
  $scope.resultForcesVector = [];
  $scope.resultForcesVirtualVector = [];
  $scope.elementsDeflectionsVector = [];
  
  $scope.virtualForcesNode = null;
  
  $scope.materials = initMaterials;
  
  var elem = document.getElementById('truss-canvas');
  var params = { width: CANVAS_WIDTH, height: CANVAS_HEIGHT };
  var two = new Two(params).appendTo(elem);
  
  var psx = function (coordinate) {
    
    return (coordinate*100) + 50;
  };
  
  var psy = function (coordinate) {
    
    return (CANVAS_HEIGHT - (coordinate*100)) - 50;
  };
  
  var  degrees_to_radians = function(degrees) {
    var pi = Math.PI;
    return degrees * (pi/180);
  };
  
  for(var i = 0; i < $scope.nodes.length; i++){
    $scope.nodes[i].nodeGraph = two.makeCircle(psx($scope.nodes[i].x), psy($scope.nodes[i].y), 10);
    $scope.nodes[i].nodeGraph.fill = '#ccc';
    $scope.nodes[i].nodeGraph.stroke = '#000';
    $scope.nodes[i].nodeGraph.linewidth = 2;
  }
  two.update();
  
  for(var i = 0; i < $scope.elements.length; i++){
    var startNode = $scope.nodes[$scope.elements[i].startNode];
    var endNode = $scope.nodes[$scope.elements[i].endNode];
    
    $scope.elements[i].elemGraph = two.makeLine(psx(startNode.x), psy(startNode.y), psx(endNode.x), psy(endNode.y));
    $scope.elements[i].elemGraph.fill = '#000';
    $scope.elements[i].elemGraph.stroke = '#000';
    $scope.elements[i].elemGraph.linewidth = 2;
  }
  two.update();
  
  $scope.addNode = function() {
    
    var newNode = {
      x: 0,
      y: 0,
      nodeGraph: two.makeCircle(psx(0), psy(0), 10)
    };
    newNode.nodeGraph.fill = '#ccc';
    newNode.nodeGraph.stroke = '#000';
    newNode.nodeGraph.linewidth = 1;
    $scope.nodes.push(newNode);
    two.update();
  };
  
  $scope.updateNode = function(i) {
    
    var node = $scope.nodes[i];
    node.nodeGraph.translation.set(psx(node.x), psy(node.y));
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
      endNode: $scope.newElement.endNode,
      area: $scope.newElement.area,
      material: $scope.newElement.material
    };
    
    var startNode = $scope.nodes[newElement.startNode];
    var endNode = $scope.nodes[newElement.endNode];
    
    newElement.elemGraph = two.makeLine(psx(startNode.x), psy(startNode.y), psx(endNode.x), psy(endNode.y));
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
  };
  
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
        hasReact: false,
        columns: []
      };
      var rowY = {
        label: 'Node' + (parseInt(i)+1) + '-Y',
        hasReact: false,
        columns: []
      };
      
      for(var j = 0; j < elements.length; j++){
        
        var localStartNode = parseInt(elements[j].startNode);
        var localEndNode = parseInt(elements[j].endNode);
        var xcolumn = {
          key: 'xcos-'+ j,
          value: 0
        };
        var ycolumn = {
          key: 'ycos-'+ j,
          value: 0
        };
        
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
      var loadValObjX = {
        key: 'load-val-x' + i,
        value: nodes[i].load && nodes[i].angle ? nodes[i].load * Math.cos(degrees_to_radians(nodes[i].angle)) : 0
      };
      var loadValObjY = {
        key: 'load-val-y' + i,
        value: nodes[i].load && nodes[i].angle ? nodes[i].load * Math.sin(degrees_to_radians(nodes[i].angle)) : 0
      };
      if(nodes[i].support){
        if(nodes[i].support == 'fixed'){
          reactObjX.value = 'Rx';
          reactObjY.value = 'Ry';
          // put flag to later separate matrix
          rowX.hasReact = true;
          rowY.hasReact = true;
        }
        else if (nodes[i].support == 'vrolling'){
          reactObjY.value = 'Ry';
          // put flag to later separate matrix
          rowY.hasReact = true;
        }
        else if (nodes[i].support == 'hrolling'){
          reactObjX.value = 'Rx';
          // put flag to later separate matrix
          rowX.hasReact = true;
        }
        rowX.columns.push(reactObjX);
        rowX.columns.push(loadValObjX);
        rowY.columns.push(reactObjY);
        rowY.columns.push(loadValObjY);
      }
      else{
        rowX.columns.push(reactObjX);
        rowX.columns.push(loadValObjX);
        rowY.columns.push(reactObjY);
        rowY.columns.push(loadValObjY);
      }
      
      $scope.mat1.push(rowX);
      $scope.mat1.push(rowY);
    }
    $scope.buildSectionedMatrix();
  };
  
  $scope.buildSectionedMatrix = function() {
    
    var reactMat = [];
    var nonReactMat = [];
    var loadsVector = [];
    
    var invNonReactMat = null;
    
    for(var i = 0; i < $scope.mat1.length; i++){
      var elem = $scope.mat1[i];
      var filteredColumns = elem.columns.filter(function(e) {
        return e.key.indexOf('cos') >= 0;
      });
      var plainColumns = [];
      
      for(var j = 0; j < filteredColumns.length; j++){
        plainColumns.push(filteredColumns[j].value);
      }
      
      if(elem.hasReact) {
        reactMat.push(plainColumns);
      }
      else{
        nonReactMat.push(plainColumns);
        loadsVector.push(elem.columns[elem.columns.length - 1].value);
      }
    }
    invNonReactMat = math.inv(nonReactMat);
    $scope.resultForcesVector = math.multiply(invNonReactMat, loadsVector);
  };
  
  $scope.buildVirtualForcesVector = function() {
    
    var reactMat = [];
    var nonReactMat = [];
    var loadsVector = [];
    
    var invNonReactMat = null;
    
    for(var i = 0; i < $scope.mat1.length; i++){
      var elem = $scope.mat1[i];
      var filteredColumns = elem.columns.filter(function(e) {
        return e.key.indexOf('cos') >= 0;
      });
      var plainColumns = [];
      
      for(var j = 0; j < filteredColumns.length; j++){
        plainColumns.push(filteredColumns[j].value);
      }
      
      if(elem.hasReact) {
        reactMat.push(plainColumns);
      }
      else{
        nonReactMat.push(plainColumns);
        if(elem.label == $scope.virtualForcesNode){
          loadsVector.push(1);
        }
        else{
          loadsVector.push(0);
        }
      }
    }
    invNonReactMat = math.inv(nonReactMat);
    $scope.resultForcesVirtualVector = math.multiply(invNonReactMat, loadsVector);
    $scope.buildElementsDeflectionVector();
  };
  
  $scope.buildElementsDeflectionVector = function() {
  
    $scope.elementsDeflectionsVector = [];
    var resultValue = null;
  
    for(var i = 0; i < $scope.resultForcesVector.length; i++){
      resultValue = ($scope.resultForcesVector[i] * $scope.resultForcesVirtualVector[i] * $scope.calculateElemLength($scope.elements[i].startNode, $scope.elements[i].endNode))/
        ($scope.elements[i].area * parseInt($scope.elements[i].material));
      $scope.elementsDeflectionsVector.push(resultValue);
    }
  };
  
  $scope.calculateDeflectionVectorSum = function(vector) {
    
    var sum = 0;
    for(var i = 0; i < vector.length; i++){
      sum = sum + vector[i];
    }
    
    return sum;
  }
  
});
