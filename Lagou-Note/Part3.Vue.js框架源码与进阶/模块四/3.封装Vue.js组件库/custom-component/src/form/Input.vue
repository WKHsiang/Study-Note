<template>
  <div>
    <input :type="type" :value="value" v-bind="$attrs" @input="handleInput" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.value);
      const findParent = (parent) => {
        while (parent) {
          if (parent.$options.name == "LgFormItem") {
            break;
          } else {
            parent = parent.$parent;
          }
        }
        return parent;
      };
      const parent = findParent(this.$parent);
      if (parent) {
        parent.$emit("validate");
      }
    },
  },
};
</script>

<style lang='scss' scoped>
</style>