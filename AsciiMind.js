'use strict';

const mindToJSON = require('./mindToJSON');
const MindNode = require('./MindNode');
/**
 * 主文件
 * 算法思路：
 *
 * 树状深度布局法。
 * 不断布局，直到树的末端，然后回硕，
 */
class AsciiMind {
    /**
     * 初始化实例
     * @param _config.w 画布宽度
     * @param _config.h 画布高度
     * @param _config.defaultDot [optional] 空位占位符，默认是中文全角空格
     */
    constructor(_config) {
        this.w = _config.w || 100;
        this.h = _config.h || 100;
        this.defaultDot = _config.defaultDot || '\u3000';
        this.map = [];

        for(var i = 0; i < this.h; i++) {
            var m = [];
            for(var n = 0; n < this.w; n++) {
                m.push(this.defaultDot);
            }
            this.map.push(m);
        }
        //每次添加完一个node就记住当前侵占的最大范围
        this.xMaxNow = 0;
        this.yMaxNow = 0;

        this.xDrawPointNow = 0;
        this.yDrawPointNow = 0;

        this.nowDrawDepth = 1;
    }

    /**
     * 添加一个node到某个位置
     * @param node MindNode节点
     * @param x x轴位置
     * @param y y轴位置
     */
    drawNode(node, x, y) {
        try{
            var nodeMap = node.map;
            node.x = x;
            node.y = y;
            var nextX = x + node.w;
            var nextY = y + node.h;
            if(nextX > this.xMaxNow) this.xMaxNow = nextX;
            if(nextY > this.yMaxNow) this.yMaxNow = nextY;
            // console.log('Drawing: ' + node.str + ' POS: ' + x + ' - ' + y);
            for(var line = y; line < nodeMap.length + y; line++) {
                var sourceArray = nodeMap[line - y];
                var targetArray = this.map[line];
                for(var char = x; char < sourceArray.length + x; char++) {
                    targetArray[char] = sourceArray[char - x];
                }
                this.map[line] = targetArray
            }
        }catch(e){
            throw new Error("画布宽高不足")
        }
    }

    /**
     * 画出两个 Node 实例的 连接线
     * @param sourceNode 父节点
     * @param targetNode 要连接的子节点
     */
    drawLink(sourceNode, targetNode) {
        var sourcePoint = {
            x: sourceNode.x + sourceNode.w,
            y: sourceNode.y + Math.floor(sourceNode.h / 2)
        }
        var targetPoint = {
            x: targetNode.x,
            y: targetNode.y + Math.floor(targetNode.h / 2)
        }

        this.map[sourcePoint.y][sourcePoint.x] = '－';
        this.map[sourcePoint.y][sourcePoint.x + 1] = '－';
        this.map[sourcePoint.y][sourcePoint.x + 2] = '－';
        var lowY = sourcePoint.y;
        var highY = targetPoint.y;
        if(lowY > highY) {
            lowY = targetPoint.y;
            highY = sourcePoint.y;
        }
        this.map[lowY][sourcePoint.x + 2] = '＋';
        for(var i = lowY + 1; i < highY + 1; i++) {
            this.map[i][sourcePoint.x + 2] = '｜';
        }
        this.map[targetPoint.y][sourcePoint.x + 2] = '＋';
        for(var i = sourcePoint.x + 3; i < targetPoint.x; i++) {
            this.map[targetPoint.y][i] = '－';
        }

    }

    /**
     * 添加一个根Node，如果此Node有子Node，会一直深度遍历调用此方法
     * @param node MindNode 实例
     */
    addRootNode(node) {
        this.drawNode(node, this.xDrawPointNow, this.yDrawPointNow);
        if(node.children.length !== 0) {
            //渲染子节点
            this.nowDrawDepth++;
            var xDrawPointNowLast = this.xDrawPointNow;
            this.xDrawPointNow = this.xMaxNow + 5;
            node.children.forEach((n) => {
                this.addRootNode(n);
                this.drawLink(node, n);
            })
            this.nowDrawDepth--;
            this.xDrawPointNow = xDrawPointNowLast;
            this.xMaxNow = xDrawPointNowLast;
        } else {
            this.yDrawPointNow = this.yMaxNow ;
        }
    }

    /**
     * 根据xmind文件绘画
     * @param filePath 文件路径
     * @param rootTitle 根节点的标题
     */
    drawByMindFile(filePath, rootTitle) {
        var json = mindToJSON(filePath);
        var rootNode = new MindNode(rootTitle);

        var struct = this._createNodeStruct(rootNode, json);
        this.addRootNode(rootNode);
    }

    /**
     * 根据json文件绘画
     * @param json 以key作为title的json文件，最后一层节点值需要不是object
     * @param rootTitle 根节点的标题
     */
    drawByJSON(json, rootTitle) {
        var rootNode = new MindNode(rootTitle);
        var struct = this._createNodeStruct(rootNode, json);
        this.addRootNode(rootNode);
    }

    _createNodeStruct(parentNode, kv) {
        if(typeof kv !== 'object') return;
        for(var i in kv) {
            var node = new MindNode(i);
            parentNode.addChild(node);
            if(typeof kv[i] !== 'object') continue;
            this._createNodeStruct(node, kv[i]);
        }
    }

    /**
     * 输出最终的结果
     * @returns {string}
     */
    output() {
        var result = '';
        this.map.forEach(function (m) {
            result += m.join('') + '\n'
        })
        return result;
    }
}

module.exports = AsciiMind;