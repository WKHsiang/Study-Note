<template>
  <div>
    <label>{{ label }}</label>
    <div>
      <slot></slot>
      <p v-if="errMessage">{{ errMessage }}</p>
    </div>
  </div>
</template>

<script>
import AsyncValidator from "async-validator";
export default {
  name: "LgFormItem",
  inject: ["form"],
  props: {
    label: {
      type: String,
    },
    prop: {
      type: String,
    },
  },
  data() {
    return {
      errMessage: "",
    };
  },
  mounted() {
    // 注册validate事件
    this.$on("validate", () => {
      this.validate();
    });
  },
  methods: {
    validate() {
      console.log(this.prop, this.form);
      if (!this.prop) return;
      let value = this.form.model[this.prop];
      let rules = this.form.rules[this.prop];

      const descriptor = { [this.prop]: rules };
      const validator = new AsyncValidator(descriptor);

      return validator.validate({ [this.prop]: value }, (err) => {
        if (err) {
          this.errMessage = err[0].message;
        } else {
          this.errMessage = "";
        }
      });
    },
  },
};
</script>

<style>
</style>