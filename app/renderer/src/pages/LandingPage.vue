<style scoped>
.landing-page-container {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>

<template>
	<PageTemplate>
		<div class="landing-page-container">
			<Button label="Get Started" @on-click="start()" />
		</div>
	</PageTemplate>
</template>

<script>
import PageTemplate from '../components/PageTemplate';
import Button from '../components/Button';

export default {
	name: 'LandingPage',
	components: { PageTemplate, Button },
	methods: {
		start() {
			this.$router.push('/scan-invoice');
		},
	},
};
</script>
