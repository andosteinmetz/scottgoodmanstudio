var fs = require('fs');

function buildPage(dir){
    var fullPath = __dirname + '/site/' + dir;
    var outputPath = fullPath + '/index.html';

    var header = fs.readFileSync(__dirname + '/includes/header_live.html', 'utf-8');
    var footer = fs.readFileSync(__dirname + '/includes/footer_live.html', 'utf-8');
    var items = fs.readFileSync(fullPath + '/items-reordered.html');
    var markup = header + items + footer;

    fs.writeFile(outputPath, markup, function(err){
        if(err){
            return console.log(err);
        }
        console.log("The production-ready file was updated at " + outputPath);
    });
};

function build(){
    //buildPage('soft-goods');
    buildPage('art');
};

build();