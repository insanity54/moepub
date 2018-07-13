const WatchIO = require('watch.io');
const path = require('path');
const Promise = require('bluebird');
const ffmpeg = require('fluent-ffmpeg');
const tasks = require('./tasks');

const watcher = new WatchIO();


const processFile = (p) => {

    if (path.extname(p) === '.mp4' ||
        path.extname(p) === '.mkv'
    ) {
        console.log(`Change detected. File ${p}`);
        tasks.getThumbnails(p, 5);
    }
}




// Watch a folder recursively
watcher.watch(path.join(__dirname, 'vids'));

// Listen on file creation
watcher.on('create', function ( file, stat ) {
    console.log(file);
    console.log(stat);
    processFile(file);
});

console.log("Server is started. To begin processing video files, place videos in the vids folder.")
