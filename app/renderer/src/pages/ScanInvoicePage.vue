<style scoped>
video {
	width: 100%;
	max-width: 360px;
	height: auto;
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
export default {
	name: 'ScanInvocePage',
	mounted() {
		navigator.getUserMedia(
			{ video: true, audio: false },
			localMediaStream => {
				var video = document.querySelector('video');
				video.srcObject = localMediaStream;
				video.autoplay = true;
			},
			error => {
				console.log(error); // eslint-disable-line no-console
			},
		);
	},
	methods: {
		cancel() {
			this.$router.push('/landing-page');
		},
	},
};
</script>
