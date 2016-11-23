var xmind = require('xmind');
var path = require('path');

module.exports = function(filePath){
    var root = xmind.open(filePath);
    var translateMindToJson = function(doc) {
        var result = {};
        if(doc.children.length){
            doc.children.forEach(function(child){
                result[child.title] = translateMindToJson(child);
            })
        }else{
            result = '';
        }
        return result;
    }
    var resultJson = translateMindToJson(JSON.parse(root.toJSON()).sheets[0].rootTopic);

    return resultJson;

}