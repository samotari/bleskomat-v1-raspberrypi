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
	<PageTemplate>
		<template v-slot:title><h3>Scan your invoice</h3></template>
		<div id="video">
			<video></video>
			<canvas></canvas>
		</div>

		<div class="actions">
			<Button type="info" @on-click="cancel()" label="Cancel" />
		</div>
	</PageTemplate>
</template>

<script>
import async from 'async';
import jsQR from 'jsqr';
import Button from '../components/Button';
import PageTemplate from '../components/PageTemplate';
export default {
	name: 'ScanInvocePage',
	components: { Button, PageTemplate },
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
				async () => {
					if (!this.canceled && this.qrcode) {
						console.log(`Found QR code! --> "${this.qrcode}"`); // eslint-disable-line no-console
						try {
							const decodedPayReq = await this.decodePayReq(this.qrcode);
							this.$router.push({
								name: 'insert-money-page',
								params: { decodedPayReq: decodedPayReq },
							});
						} catch (error) {
							console.log('QR code not supported', error); // eslint-disable-line no-console
							this.qrcode = null;
							this.startReadingQrCode();
						}
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
		async decodePayReq(payReq) {
			const ipcRenderer = window.ipcRenderer;
			return new Promise((resolve, reject) => {
				ipcRenderer.on('lnd.Lightning.decodePayReq', (event, result) => {
					resolve(result);
				});
				ipcRenderer.on('lnd.Lightning.decodePayReq.error', (event, result) => {
					reject(result);
				});
				ipcRenderer.send('lnd', 'Lightning', 'decodePayReq', {
					pay_req: payReq,
				});
			});
		},
		cancel() {
			this.canceled = true;
			this.$router.push('/landing-page');
		},
	},
};
</script>
