<template>
  <button @click="start()">{{ label }}</button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    label: String
  },
  methods: {
    onClick() {
      this.$emit('on-click');
    }
  }
}
</script>

<style scoped>
</style>
