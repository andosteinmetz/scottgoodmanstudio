Static Site Builder
===================

This repo contains a flat-file static site generator, and a friend's site that was built with said generator. It's built entirely in Javascript using Node and Express for the server. It's a work in progress, and still needs some features to be built, and could probably benefit from a round of tuning and restructuring. That said, it's working well.

HOWTO (for users)
1 • open Terminal app, and type the letters “cd” followed by a space 
2 • drag and drop the scottgoodmanstudio.com folder into the Terminal, and then hit ENTER 
3 • type "node app", and hit ENTER 
4 • navigate to http://localhost:3001/admin/ in a web browser 
Add Images: 

5 • drop full-size images into site/art/images/fullsize and thumbnails into site/art/images/thumbs 
6 • click ADD once you’ve added images into their folders  Add Captions: 
7 • create a new plain text file (in Text Edit: Format > Make Plain Text), and save it with the same name as the image, but with the extension .md in the images/captions folder. 
8 • click "ADD"  
9 • click SAVE 
10 • click BUILD 
11 • upload new images and revised index.html files via FTP. Alternately, you can re-upload the entire folders, but this will take longer to re-upload all of your images.

