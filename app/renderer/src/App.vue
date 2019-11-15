<template>
	<div id="app" :data-page="page">
		<RouterView />
	</div>
</template>

<script>
export default {
	name: 'App',
	data() {
		return {
			page: this.$router.history.current.name || '',
		};
	},
	mounted() {
		this.$router.afterEach(to => {
			this.page = to.name || '';
		});
	},
};
</script>

<style>
html {
	width: 100%;
	height: 100%;
}

body {
	height: 100%;
	margin: 0;
}

#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100%;
	display: flex;
}

.wrapper {
	flex: 1;
	background-color: #f0f0f5;
	padding: 10px;
}

h2 {
	margin: 0;
}
</style>
