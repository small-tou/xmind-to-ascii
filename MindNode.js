'use strict';
const PLUS = '＋';
const HENG = '－';
const SHU = '｜';
const BLANK = '\u3000';

function byteLength(str) {
    // returns the byte length of an utf8 string
    var s = str.length;
    for(var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if(code > 0x7f && code <= 0x7ff) s++;
        else if(code > 0x7ff && code <= 0xffff) s++;
        if(code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
    }
    return s;
}
//将一串中英混合的字符串变成一个固定长度的数组
var transStrToMustLengthArray = function (str, len) {
    var arr = str.split('');
    while(arr.length != len) {
        var temp = arr.shift();
        arr[0] = temp + arr[0];
    }
    return arr;
}

class MindNode {
    constructor(str) {
        this.str = str;
        var strLength = byteLength(this.str, 'utf8');
        var mustLength = Math.ceil(strLength / 2); // 中间文字的长度
        this.map = [
            [PLUS, HENG].concat(HENG.repeat(mustLength).split('')).concat([HENG, PLUS]),
            [SHU, BLANK].concat(transStrToMustLengthArray(this.str, mustLength)).concat([BLANK, SHU]),
            [PLUS, HENG].concat(HENG.repeat(mustLength).split('')).concat([HENG, PLUS])
        ];

        this.w = mustLength + 4;
        this.h = 3;
        this.x = 0;
        this.y = 0;
        this.children = [];

    }

    addChild(node) {
        this.children.push(node);
    }

    output() {

        var result = '';
        this.map.forEach(function (m) {
            result += m.join('') + '\n'
        })
        return result;
    }
}

module.exports = MindNode;

