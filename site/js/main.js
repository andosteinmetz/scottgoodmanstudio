/* AJAX */

function savePortfolio(){
    var http = new XMLHttpRequest();
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200 || window.location.indexOf('http') == -1){
                addMessage(http.responseText);
            }
            else{
                alert('There was a problem...');
            }
        }
    };

    var data = {}

    data.portfolio = document.getElementById('portfolio').innerHTML;
    data.dir = window.location.href.split('/');
    data.dir = data.dir[data.dir.length-2];
    data.images = getImages();

    http.open('POST', '/save', true);
    http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    http.send(JSON.stringify(data));
};

function buildLive(){
    var http = new XMLHttpRequest();
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200 || window.location.indexOf('http') == -1){
                addMessage(http.responseText);
            }
            else{
                alert('There was a problem...')
            }
        };
    };
    var data = {};
    data.dir = getDir();
    http.open('POST', '/build', true);
    http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    http.send(JSON.stringify(data));
};



function requestNewImages(){
    var http = new XMLHttpRequest();
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200 || window.location.indexOf('http') == -1){
                /** TODO - PROCESS SERVER RESPONSE HERE TO ADD NEW IMAGES AND CAPTIONS
                 * 1 - parse response
                 * 2 - separate out images and caption data
                 * 3 - after new images are added to DOM, add captions
                * */
                var response  = JSON.parse(http.response);
                addImages(response.thumbs);
                addCaptions(response.captions);
            }
        }
    }
    var data = {images: getImages(), dir: getDir()};
    http.open('POST', '/add', true);
    http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    http.send(JSON.stringify(data));
};

function getImages(){
    var images = document.querySelectorAll('#portfolio img');
    return [].map.call(images, function(img){
        return img.src.split('/')[6];
    });
}

/* END AJAX */

function getDir(){
    var loc = window.location.href.split('/');
    return loc[loc.length -2];
};

/* DOM MANIPULATION */

function addImages(images){
    var portfolio = document.getElementById('portfolio');
    if(images.length == 0) return addMessage('I didn\'t find any new images :(', true);
    var els = images.map(function(src){
        var link = document.createElement('a');
        var fullSizeSrc = src.indexOf('-thumb') ? src.replace('-thumb', '') : src;
        link.href =  'images/fullsize/' + fullSizeSrc;
        link.setAttribute('data-lightbox', 'portfolio');
        var image = document.createElement('img');
        image.src = 'images/thumbs/' + src;
        link.appendChild(image);
        return link;
    });
    els.forEach(function(el){
        portfolio.insertBefore(el, portfolio.firstChild);
    });
};

function addCaptions(captionData){
    console.log(captionData);
    // TODO - PROPERTIES WITH WHITESPACE IN PROP-NAME ARE BEING REMOVED. WHERE?
    for(var image in captionData){
        var path = 'images/thumbs/'+ image;
        var selector = 'img[src="'+ path +'"]';
        $(selector).parent().attr('data-title', captionData[image]);
    }
}



function addMessage(message, isErr){
    var $overlay = document.getElementById('overlay');
    var $messages = document.getElementById('messages');

    var el = document.createElement('li');
    el.innerHTML = message;
    if(isErr) el.className = 'error';

    var children = $messages.childNodes;

    if(children.length > 5){
        $messages.removeChild(children[children.length-1]);
    }

    $overlay.className = '';
    $messages.insertBefore(el, $messages.firstChild);
    transitionIn(el, 'opacity', 0, 1);

};

/* EVENT LISTENERS */

function updateListener(){
    var update = document.getElementById('write');
    update.addEventListener('click', function(e){
       e.preventDefault();
       savePortfolio();
       return false;
    });
};

function buildListener(){
    var build = document.getElementById('build');
    build.addEventListener('click', function(e){
        e.preventDefault();
        buildLive();
        return false;
    });
};

function addImagesListener(){
    var add = document.getElementById('add');
    add.addEventListener('click', function(e){
        e.preventDefault();
        requestNewImages();
        return false;
    })
};

function hideOverlay(){
    var $overlay = document.getElementById('overlay');
    var $hideOverlay = document.getElementById('overlay');
    $hideOverlay.addEventListener('click', function(){
        $overlay.className = 'hidden';
    });
};

function transitionIn(el, prop, from, to){
    el.style[prop] = from;
    window.getComputedStyle(el)[prop];
    el.style[prop] = to;
};

$(document).ready(function(){
    updateListener();
    buildListener();
    addImagesListener();
    hideOverlay();
});