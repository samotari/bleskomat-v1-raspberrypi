<style scoped>
.scan-invoice-page-container {
	display: flex;
	align-items: center;
	justify-content: space-evenly;
}
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
		<template v-slot:title>
			<h3>Scan your invoice</h3>
		</template>
		<div class="scan-invoice-page-container">
			<div id="video">
				<video></video>
				<canvas></canvas>
			</div>

			<div class="actions">
				<Button type="info" label="Cancel" @on-click="cancel()" />
			</div>
		</div>
	</PageTemplate>
</template>

<script>
import _ from 'underscore';
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
				video.srcObject = this.localMediaStream = localMediaStream;
				video.autoplay = true;
				this.startReadingQrCode();
			},
			error => {
				console.log(error); // eslint-disable-line no-console
			},
		);
	},
	destroyed() {
		if (this.localMediaStream) {
			if (typeof this.localMediaStream.getVideoTracks === 'function') {
				const tracks = this.localMediaStream.getVideoTracks();
				_.invoke(tracks, 'stop');
			}
		}
		this.localMediaStream = null;
		const ipcRenderer = window.ipcRenderer;
		ipcRenderer.removeAllListeners('decode-payreq');
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
						try {
							const decodedPayReq = await this.decodePayReq(this.qrcode);
							this.$router.push({
								name: 'insert-money-page',
								params: { decodedPayReq: decodedPayReq },
							});
						} catch (error) {
							this.qrcode = null;
							alert(error);
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
				ipcRenderer.on('decode-payreq', (event, result) => {
					if (result.error) {
						return reject(result.error);
					}
					resolve(result);
				});
				ipcRenderer.send('decode-payreq', {
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
