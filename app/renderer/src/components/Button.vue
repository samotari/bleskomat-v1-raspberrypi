<template>
	<button :style="buttonStyle" @click="onClick()">
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
	data: () => ({
		buttonStyle: {
			border: '2px',
			borderColor: '#35495E',
			borderStyle: 'solid',
			borderRadius: '10px',
			backgroundColor: '#41B883',
			color: 'white',
			fontWeight: 'bold',
			fontSize: '18px',
			padding: '18px',
		},
	}),
	methods: {
		onClick() {
			this.$emit('on-click');
		},
	},
};
</script>
