const cv = require('opencv4nodejs');
const jsQR = require('jsqr');

const wCap = new cv.VideoCapture(0);

let interval = setInterval(function() {
	wCap.readAsync(function(error, frame) {
		if (error) {
			console.log(error);
			process.exit(1);
		}
		if (frame.empty) {
			console.log('No more frames!');
			process.exit();
		}
		const matRGBA = frame.channels === 1
			? frame.cvtColor(cv.COLOR_GRAY2RGBA)
			: frame.cvtColor(cv.COLOR_BGR2RGBA)
		const width = frame.sizes[1];
		const height = frame.sizes[0];
		const imgData = new Uint8ClampedArray(matRGBA.getData());
		const code = jsQR(imgData, width, height);
		if (code) {
			console.log('Found QR code', code);
			clearInterval(interval);
		}
	});
}, 50);
