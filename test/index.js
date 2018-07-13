
var assert = require('chai').assert;
var tasks = require('../tasks');
var path = require('path');
//var fs = require('fs-extra-promise');
const globby = require('globby');
var testVideoPath = path.join(__dirname, 'testVideo.mp4');

describe('ffmpeg tasks', function() {
    describe('getVideoProperties()', function() {
    	it('should return an object representing video properties', function(done) {
            tasks.getVideoProperties(testVideoPath)
        		.then(function(props) {
        		    assert.isObject(props);
                    assert.isArray(props.streams);
        		})
                .finally(() => {
                    done();
                })
    	});
    });

    describe('getVideoDuration()', () => {
        it('should return a number representing video duration', (done) => {
            tasks.getVideoDuration(testVideoPath)
                .then((duration) => {
                    assert.isNumber(duration);
                })
                .finally(() => {
                    done();
                })
        })
    });



    describe('getVideoFrameSamples()', () => {
        it('should generate a bunch of .png files', (done) => {
            tasks.getVideoFrameSamples(testVideoPath, 5.81, 3)
                .then((result) => {
                    assert.isArray(result);
                })
                .finally(() => {
                    done();
                })
        });
    });

    describe('getThumbnails()', () => {
        it('should generate a bunch of .png files given a filename and number of thumbnails', (done) => {
            const thumbCount = 15;
            tasks.getThumbnails(testVideoPath, thumbCount)

                .then((result) => {
                    assert.isTrue(result);

                    return globby(`${__dirname}/**/*.png`)
                        .then(function(data) {
                            //console.log(data);
                            return data;
                        })
                        .then((result) => {
                            assert.isArray(result);
                            assert.lengthOf(result, thumbCount, 'paths array was not correct');
                        })
                    //['testVideo.mp4.thumb*.png']);

                })
                .catch((err) => {
                    throw err;
                })
                .finally(() => {
                    done();
                })
        });
    });



})
