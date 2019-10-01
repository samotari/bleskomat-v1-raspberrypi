<style scoped>
.defaultButton {
	border: 2px;
	border-color: #35495e;
	border-style: solid;
	border-radius: 10px;
	font-weight: bold;
	font-size: 18px;
	padding: 18px;
}
.defaultButton + .defaultButton {
	margin-left: 5px;
}
.button-primary {
	background-color: #41b883;
	color: white;
}
.button-info {
	background-color: white;
	color: #41b883;
}
</style>

<template>
	<button :class="['defaultButton', 'button-' + type]" @click="onClick()">
		{{ label }}
	</button>
</template>

<script>
export default {
	name: 'Button',
	props: {
		label: {
			type: String,
			default: 'Button',
		},
		type: {
			type: String,
			default: 'primary',
			validator: value => ['primary', 'info'].indexOf(value) >= 0,
		},
	},
	methods: {
		onClick() {
			this.$emit('on-click');
		},
	},
};
</script>
