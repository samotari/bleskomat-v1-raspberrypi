<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'bleskomat',
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body { font-family: 'Source Sans Pro', sans-serif; }

.wrapper {
  background:
    radial-gradient(
      ellipse at top left,
      rgba(255, 255, 255, 1) 40%,
      rgba(229, 229, 229, .9) 100%
    );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.information .title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.actions button {
  font-size: .8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 1em;
  height: 5em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.actions button.cancel {
  background-color: #FF333D;
  border: 1px solid #FF333D;
}
</style>
