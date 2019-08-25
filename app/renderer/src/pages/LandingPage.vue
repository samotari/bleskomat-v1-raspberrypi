<template>
  <div class="wrapper">
    <main>
      <div class="information">
        <span class="title">
          Welcome to Bleskomat!
        </span>
      </div>

      <div class="actions">
        <button class="start" @click="start()">Touch me!</button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'landing-page',
  methods: {
    start() {
      this.$router.push('/scan-invoice');
    },
  },
};
</script>
