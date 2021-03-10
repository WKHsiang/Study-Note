<template>
  <div>
    <button @click="handleClick">
      <slot></slot>
    </button>
  </div>
</template>

<script>
export default {
  name: "LgButton",
  data() {
    return {};
  },
  methods: {
    handleClick(e) {
        e.preventDefault()
      this.$emit("click", e);
    },
  },
};
</script>

<style lang='scss' scoped>
</style>