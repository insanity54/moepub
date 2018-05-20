
var assert = require('chai').assert;
var tasks = require('../tasks');
var path = require('path');
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
    })

    describe('getVideoDuration()', () => {
        it('should return a number representing video duration timestamp', (done) => {
            tasks.getVideoDuration(testVideoPath)
                .then((duration) => {
                    assert.isNumber(duration);
                })
                .finally(() => {
                    done();
                })
        })
    })



    describe('getVideoFrameSamples()', () => {
        it('should generate a bunch of .png files', (done) => {
            tasks.getVideoFrameSamples(testVideoPath, 522522, 8)
                .then((result) => {
                    assert.isTrue(result);
                })
                .finally(() => {
                    done();
                })
        });
    })
})
