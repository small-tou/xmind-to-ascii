var AsciiMind = require('./../index.js');
var fs = require("fs");
var bg = new AsciiMind({
    w:300,
    h:300,
    defaultDot:''
});
var filename = './xmind to ascii.xmind';
bg.drawByMindFile(filename,'芋头');

console.log(bg.output());

fs.writeFileSync(filename+".md","```\n"+bg.output()+"\n```")
