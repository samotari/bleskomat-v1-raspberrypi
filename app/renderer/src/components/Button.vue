<template>
	<button @click="onClick()">
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
	},
	methods: {
		onClick() {
			this.$emit('on-click');
		},
	},
};
</script>
