<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <h2>客户端</h2>
    <div>
      <input v-model="message" />
    </div>
    <div>
      <button @click="onClick">点击测试</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      message: "WangKuoHsiang",
    };
  },
  methods: {
    onClick() {
      console.log("Hello World!");
    },
  },
};
</script>

<style lang='scss' scoped>
</style>