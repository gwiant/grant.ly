define(function(require) {

    'use strict';

    function MotionController(options) {

        console.log('new MotionController');

        this.hasDeviceMotion = 'ondevicemotion' in window;

        // defaults
        this.options = {
            motionThreshold: 0.1,
            timeThreshold: 300
        };

        this.x = null;
        this.dx = null;
        this.y = null;
        this.dy = null;
        this.z = null;
        this.dz = null;

        this.boundDeviceMotionHandler = this.handleDeviceMotion.bind(this);

        this.setUserOptions(options);

    }

    MotionController.prototype.setUserOptions = function setUserOptions(options) {

        console.log('MotionController.setUserOptions');

        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                this.options[i] = options[i];
            }
        }

    };

    MotionController.prototype.reset = function reset() {

        console.log('MotionController.reset');

        this.x = null;
        this.y = null;
        this.z = null;

    };

    MotionController.prototype.start = function start() {

        console.log('MotionController.start');

        this.reset();

        if (this.hasDeviceMotion) {
            window.addEventListener('devicemotion', this.boundDeviceMotionHandler, false);
        }

    };

    MotionController.prototype.stop = function stop() {

        console.log('MotionController.stop');

        if (this.hasDeviceMotion) {
            window.removeEventListener('devicemotion', this.boundDeviceMotionHandler, false);
        }

        this.reset();

    };

    MotionController.prototype.handleDeviceMotion = function handleDeviceMotion(e) {

        console.log('MotionController.handleDeviceMotion', e);

        var motion = e.accelerationIncludingGravity;

        if ((this.x === null) && (this.y === null) && (this.z === null)) {
            this.x = motion.x;
            this.y = motion.y;
            this.z = motion.z;
            return;
        }

        this.dx = Math.abs(this.x - motion.x);
        this.dy = Math.abs(this.y - motion.y);
        this.dz = Math.abs(this.z - motion.z);

        if ((this.dx > this.options.motionThreshold && this.dy > this.options.motionThreshold) || (this.dx > this.options.motionThreshold && this.dz > this.options.motionThreshold) || (this.dy > this.options.motionThreshold && this.dz > this.options.motionThreshold)) {

            var event = new CustomEvent('motion', {
                "detail": {
                    x: this.x,
                    y: this.y,
                    z: this.z,
                    dx: this.dx,
                    dy: this.dy,
                    dz: this.dz
                },
                bubbles: true,
                cancelable: false
            });

            document.dispatchEvent(event);

        }

        this.x = motion.x;
        this.y = motion.y;
        this.z = motion.z;

    };

    return MotionController;

});
