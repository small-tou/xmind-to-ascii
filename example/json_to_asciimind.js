
var struct = {
    '一级标题':{
        '二级标题':{
            '三级标题-1':'',
            '三级标题-2':'',
            '三级标题-3':''
        },
        '二级标题-2':{
            '三级标题2-1':'',
            '三级标题2-2':'',
            '三级标题2-3':''
        }
    }
}

var AsciiMind = require('./../index.js');

var bg = new AsciiMind({
    w:300,
    h:300,
    defaultDot:''
});

bg.drawByJSON(struct,'芋头');

console.log(bg.output());
