<template>
	<!-- eslint-disable-next-line vue/component-name-in-template-casing -->
	<transition name="fade">
		<div v-show="isShow" class="loading-background">
			<div class="loading-animation">
				<div
					v-for="i in loadingItems"
					:key="i"
					:style="{ animationDelay: i * 250 + 'ms' }"
				></div>
			</div>
		</div>
	</transition>
</template>
<script>
export default {
	name: 'Loading',
	data() {
		return {
			isShow: false,
			delay: 300,
			timer: null,
			loadingItems: 4,
		};
	},
	methods: {
		show() {
			this.timer = setTimeout(() => {
				this.isShow = true;
			}, this.delay);
		},
		hide() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			this.isShow = false;
		},
	},
};
</script>

<style scoped>
.loading-background {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.8);
	transition: all 1s ease-out;
	display: flex;
	justify-content: center;
	align-items: center;
}
.loading-animation {
	width: 120px;
	height: 120px;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
}
.loading-animation > div {
	width: 12px;
	height: 12px;
	background: #999;
	border-radius: 3px;
	right: 10px;
	animation: circleKey 1s linear infinite;
	margin: 5px;
}
@keyframes circleKey {
	0% {
		background: #888;
		transform: scale(1);
	}
	50% {
		background: #f3f3f3;
		transform: scale(1.3);
	}
	100% {
		background: #888;
		transform: scale(1);
	}
}
.fade-enter-active,
.fade-enter-active .loading-animation,
.fade-leave-active,
.fade-leave-active .loading-animation {
	transition: all 0.2s ease-out;
}
.fade-enter {
	opacity: 0;
}
.fade-enter .loading-animation {
	transform: scale(0.9);
}
.fade-leave-to {
	opacity: 0;
}
.fade-leave-to .loading-animation {
	transform: scale(0.9);
}
</style>
