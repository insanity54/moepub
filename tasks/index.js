const ffmpeg = require('fluent-ffmpeg');
const Promise = require('bluebird');
const R = require('ramda');
const path = require('path');




const getThumbnails = (videoPath, thumbCount) => {
    return getVideoDuration(videoPath)
        .then((duration) => {
            console.log(`video duration is ${duration}`)

            return getVideoFrameSamples(videoPath, duration, thumbCount)
                .then((result) => {
                    return true;
                });
            });
};


const getVideoProperties = (videoPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg
            .ffprobe(videoPath, (err, metadata) => {
                if (err) reject(err);
                resolve(metadata);
            });
    });
};



const getVideoDuration = (videoPath) => {
    return getVideoProperties(videoPath)
        .then((props) => {
            console.log('props -vvv-')
            console.log(props);
            const sDurLens = R.lensPath([
                'streams',
                0,
                'duration'
            ]);
            return R.view(sDurLens, props)
        })
};

/**
 * getVideoFrameSamples
 *
 * Generate a sample of frames from the video.
 *
 * @param {string} videoPath - The absolute path on disk to the video file
 * @param {number} duration - the video duration in seconds
 * @param {number} sampleCount - The number of frames to pull from the video. Frame captures are spread evenly over the video duration.
 */
const getVideoFrameSamples = (videoPath, duration, sampleCount) => {


    var getFrameNumber = i => R.multiply(R.divide(duration, sampleCount), i);
    var framesOfInterest = R.map(getFrameNumber, R.times(R.identity, sampleCount));
    //console.log(`duration: ${duration}`);
    //console.log(framesOfInterest);


    var grabFrame = (seekTime, index) => new Promise((resolve, reject) => {

        //index = (parseInt(index)+1)
        //frameNumber = parseInt(frameNumber);

        const outPath = path.join(
            path.dirname(videoPath),
            `${path.basename(videoPath)}.thumb${index}.png`
        );

        //console.log(`seekTime: ${seekTime}, index: ${index}, outPath: ${outPath}`);


        var c = ffmpeg()
            .input(videoPath)
            .seekInput(seekTime)
            .output(outPath)
            .noAudio()
            .frames(1)
            .on('end', (stdout, stderr) => {
                //if (stderr) reject(stderr);
                resolve(outPath);
            })
            .on('error', (err) => {
                reject(err);
            });


        c.run();
    });

    return new Promise.map(framesOfInterest, grabFrame);



};


module.exports = {
    getVideoProperties,
    getVideoDuration,
    getVideoFrameSamples,
    getThumbnails
}
