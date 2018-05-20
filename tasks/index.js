const ffmpeg = require('fluent-ffmpeg');
const Promise = require('bluebird');
const R = require('ramda');
const path = require('path');




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
            const sDurLens = R.lensPath([
                'streams',
                0,
                'duration_ts'
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
 * @param {number} duration - the video duration (ffprobe reported duration_ts)
 * @param {number} sampleCount - The number of frames to pull from the video. Frame captures are spread evenly over the video duration.
 */
const getVideoFrameSamples = (videoPath, duration, sampleCount) => {
    const sampleFrames = R.divide(duration, sampleCount);
    var command = ffmpeg()
        .input(videoPath)
        .outputOptions(['vframes 1']);

    var grabFrame = (seekTime, index) => {
        index = (parseInt(index)+1)
        const outPath = path.join(
            path.dirname(videoPath),
            `${path.basename(videoPath)}.thumb${index}.png`
        );
        console.log(outPath);

        var c = ffmpeg()
            .input(videoPath)
            .seekInput(seekTime)
            .output(outPath)
            .noAudio()
            .frames(1)

        console.log(c);
        c.run();
    };


    R.forEachObjIndexed(grabFrame, R.times(R.identity, sampleCount))

    return true
};


module.exports = {
    getVideoProperties,
    getVideoDuration,
    getVideoFrameSamples
}
