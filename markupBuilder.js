var fs = require('fs');
var markdown = require('markdown').markdown;

function markupBuilder(path){

    var fullPath = path !== undefined ? __dirname + '/site/' + path : process.cwd();

    var fullSized =  fs.readdirSync(fullPath + '/images/fullsize').filter(function(i){
        return i.charAt(0) !== '.'
    });
    var thumbnails = fs.readdirSync(fullPath + '/images/thumbs').filter(function(i){
        return i.charAt(0) !== '.';
    });

    var captions = fs.readdirSync(fullPath + '/images/captions').filter(function(i){
        return i.charAt(0) !== '.';
    });

    var divOpen = '<div>';
    var divClose= '</div>';
    var linkOpen = '<a class="item" data-lightbox="portfolio" data-title="" href="'; // not using b/c title needed to be added for captions
    var imgOpen = '<img src="';
    var tagClose = '">';
    var linkClose = '<\/a>';

    var header = fs.readFileSync(__dirname + '/includes/header.html', 'utf-8');
    var footer = fs.readFileSync(__dirname + '/includes/footer.html', 'utf-8');

    var images = thumbnails.map(function(thumb, index){
        return '<a class="item" data-lightbox="portfolio" data-title="' + markdown.toHTML(fs.readFileSync(captions[index])) +'" href="' + 'images/fullsize/' + fullSized[index] + tagClose + imgOpen + 'images/thumbs/' + thumb + tagClose + linkClose;
    }).join('\n\t');

    var markup = header + '\n' + images + '\n' + footer;

    var filePath = fullPath + '/update.html'
    fs.writeFile(filePath, markup, function(err){
        if(err){
            return console.log(err);
        }
        console.log("The file was saved at " + filePath);
    });
};

var buildPages = function(){
    markupBuilder('art');
};

//module.exports = buildPages();

module.exports = markupBuilder();