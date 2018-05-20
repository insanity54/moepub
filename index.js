const WatchIO = require('watch.io');
const path = require('path');
const Promise = require('bluebird');
const ffmpeg = require('fluent-ffmpeg');
const tasks = require('./tasks');

const watcher = new WatchIO();


const processFile = (path) => {
    console.log(`Change detected. File ${path}`);
    getThumbnails(path);
}


const getThumbnails = (path) => {
    tasks.getVideoDuration(p)
        .then((duration) => {
            tasks.getVideoFrameSamples(path, duration, 8)
        })
}




// Watch a folder recursively
watcher.watch(path.join(__dirname, 'vids'));

// Listen on file creation
watcher.on('create', function ( file, stat ) {
    console.log(file);
    console.log(stat);
    processFile(file);
});
