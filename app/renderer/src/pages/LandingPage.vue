<template>
	<div class="wrapper">
		<main>
			<div class="information">
				<span class="title">
					Welcome to Bleskomat!
				</span>
			</div>

			<div class="actions">
				<Button label="Touch me!" @on-click="start()" />
			</div>
		</main>
	</div>
</template>

<script>
import Button from '../components/Button';

export default {
	name: 'LandingPage',
	components: { Button },
	methods: {
		start() {
			this.$router.push('/scan-invoice');
		},
	},
};
</script>
