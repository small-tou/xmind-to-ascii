var AsciiMind = require('./../index.js');

var bg = new AsciiMind({
    w:300,
    h:300,
    defaultDot:''
});

// bg.drawByMindFile('./Nodejs稳定性保障.xmind','芋头');
bg.drawByMindFile('./前端开发者入门指南.xmind','芋头');

console.log(bg.output());
