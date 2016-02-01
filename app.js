var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var markdown = require('markdown').markdown;

var app = express();

var server = app.listen(3001, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Your website is running at http://%s:%s,', host, port, '\nNavigate to http://localhost:3001/admin in any web browser to make changes');
});

app.use( express.static('site') );
app.use( bodyParser.json() );

app.post('/save', function(req, res){
    var portfolio = req.body.portfolio;
    var dir = req.body.dir;
    var images = req.body.images;
    makeReorderedFile(dir, portfolio, images);
    res.send('Your changes have been saved on staging!');
});

app.post('/build', function(req, res){
    var dir = req.body.dir;
    buildPage(dir);
    var localPath = __dirname + '/site/' + dir + '/index.html';
    var serverPath = 'http://localhost:' + server.address().port + '/' + dir + '/' + 'index.html';
    res.send('The production-ready file has been updated at <a target="_blank" href="' + serverPath + '">' + localPath + '</a>');
});

app.post('/add', function(req, res){
    /**
     *  TODO - ADD CAPTIONS HERE OR IN A SEPARATE FUNCTION
    **/
    var data = {};

    var currentThumbs = req.body.images.map(normalizeFilenameWhitespace);
    var workingDirectory = __dirname + '/site/' + req.body.dir;

    var allThumbs = fs.readdirSync(__dirname + '/site/' + req.body.dir + '/images/thumbs').filter(function(i){
        return i.charAt(0) !== '.'
    });

    var newThumbs = allThumbs.filter(function(i){
        return currentThumbs.indexOf(i) < 0;
    });

    /* TODO BEGIN THUMBS */

    var captions = fs.readdirSync(workingDirectory + '/images/captions');
    captions = captions.map(normalizeFilenameWhitespace);

    // build data here
    var captionData = {}

    for(var i = 0; i < captions.length; i++){
        if(allThumbs.map(stripExtension).indexOf(captions.map(stripExtension)[i]) > -1){
            var caption = fs.readFileSync(workingDirectory + '/images/captions/' + captions[i], 'utf8')
            captionData[stripExtension(captions[i]) + '.jpg'] = markdown.toHTML(caption);
        }
    }

    console.log(captionData);
    data.thumbs = newThumbs;
    data.captions = captionData;

    /**
    * break response out into two parts
    * 1 - add new images as images
    * 2 - add captions as captions
    * */

    /* TODO END THUMBS */

    res.send(JSON.stringify(data));
});

app.use(function(req, res, next){
    res.status(404).send('404 - Sorry, nothing there');
});

function makeReorderedFile(directory, portfolio, images){
    var workingDirectory = __dirname + '/site/' + directory;
    var filePath = workingDirectory + '/reorder.html';
    var portfolioPath = workingDirectory + '/items-reordered.html';

    var header = fs.readFileSync(__dirname + '/includes/header.html', 'utf-8');
    var footer = fs.readFileSync(__dirname + '/includes/footer.html', 'utf-8');

    var portfolio = cleanPortfolio(portfolio);

    var markup = header + portfolio + footer;

    fs.writeFile(filePath, markup, function(err){
        if(err){
            return console.log(err);
        }
        console.log("The file was saved at " + filePath);
    });

    fs.writeFile(portfolioPath, portfolio, function(err){
        if(err){
            return console.log(err);
        }
        console.log("The item order is updated for build at " + portfolioPath);
    });

};

function buildPage(directory){
    var fullPath = __dirname + '/site/' + directory;
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


function cleanPortfolio(links){
    // TODO - this function could be reworked/added to, to prevent security holes
    // TODO - create a way to remove images
    var runOns = /<\/a><a/g;
    var properLineBreaks = '</a>\n\t<a';
    var emptyStyles = /\sstyle=""/g;
    var handle = /\sui-sortable-handle/g;
    var scripts = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var manyNewlines = /\n\s*\n/g;
    return links.replace(runOns, properLineBreaks).replace(emptyStyles, '').replace(handle, '').replace(manyNewlines, '\n').replace(scripts, '');
};

function stripExtension(filename){
    return filename.split('.')[0];
}

function normalizeFilenameWhitespace(filename){
    return filename.split('%20').join(' ');
}


/** TODO, IF THIS WERE TO RUN ON A PUBLIC SERVER...
 *
 *   USE DROPZONE TO UPLOAD IMAGES
 *   IMPROVE SECURITY
 *     CREATE LOGIN
 *     MORE VALIDATION
 *     CREATE A DATA MODEL SO AS NOT TO ALLOW USERS TO MODIFY DOM DIRECTLY?
 *   REORGANIZE FILE STRUCTURE - KEEP ALL ADMIN/WORKING/STAGING FILES IN AN ADMIN DIRECTORY. KEEP ALL LIVE FILES IN A SITE DIRECTORY.
 *
 **/