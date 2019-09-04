<style scoped>
video {
	width: 100%;
	max-width: 360px;
	height: auto;
}
canvas {
	position: absolute;
	left: -99999em;
	top: 0;
	visibility: hidden;
}
</style>

<template>
	<div class="wrapper">
		<main>
			<div class="information">
				<span class="title">
					Scan your invoice!
				</span>
			</div>

			<div id="video">
				<video></video>
				<canvas></canvas>
			</div>

			<div class="actions">
				<button class="cancel" @click="cancel()">
					Cancel
				</button>
			</div>
		</main>
	</div>
</template>

<script>
import async from 'async';
import jsQR from 'jsqr';
export default {
	name: 'ScanInvocePage',
	mounted() {
		navigator.getUserMedia(
			{ video: true, audio: false },
			localMediaStream => {
				const video = document.querySelector('video');
				video.srcObject = localMediaStream;
				video.autoplay = true;
				this.startReadingQrCode();
			},
			error => {
				console.log(error); // eslint-disable-line no-console
			},
		);
	},
	methods: {
		startReadingQrCode() {
			async.until(
				next => {
					next(null, this.canceled || !!this.qrcode);
				},
				next => {
					this.tryToReadQrCode((error, data) => {
						if (error) return next(error);
						if (data) this.qrcode = data;
						next();
					});
				},
				() => {
					if (!this.canceled && this.qrcode) {
						const qrcode = this.qrcode;
						console.log(`Found QR code! --> "${qrcode}"`); // eslint-disable-line no-console
						this.$router.push('/insert-money');
					}
				},
			);
		},
		tryToReadQrCode(done) {
			requestAnimationFrame(function() {
				try {
					const video = document.querySelector('video');
					const canvasElement = document.querySelector('canvas');
					const canvas = canvasElement.getContext('2d');
					if (video.readyState === video.HAVE_ENOUGH_DATA) {
						canvasElement.height = video.videoHeight;
						canvasElement.width = video.videoWidth;
						canvas.drawImage(
							video,
							0,
							0,
							canvasElement.width,
							canvasElement.height,
						);
						const imageData = canvas.getImageData(
							0,
							0,
							canvasElement.width,
							canvasElement.height,
						);
						const code = jsQR(
							imageData.data,
							imageData.width,
							imageData.height,
						);
						if (code) {
							return done(null, code.data);
						}
					}
				} catch (error) {
					return done(error);
				}
				done();
			});
		},
		cancel() {
			this.canceled = true;
			this.$router.push('/landing-page');
		},
	},
};
</script>
