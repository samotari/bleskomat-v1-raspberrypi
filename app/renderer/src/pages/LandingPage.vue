<template>
	<PageTemplate>
		<Button label="Get Started" @on-click="start()" />
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
		}
	}
};
</script>
