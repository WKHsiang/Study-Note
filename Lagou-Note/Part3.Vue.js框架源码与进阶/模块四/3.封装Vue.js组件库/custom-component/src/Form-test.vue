<template>
  <lg-form :rules="rules" :model="user" ref="form" class="user">
    <lg-form-item label="用户名" prop="username">
      <lg-input
        type="text"
        :value="user.username"
        @input="user.username = $event"
        placeholder="请输入用户名"
      ></lg-input>
    </lg-form-item>
    <lg-form-item label="密码" prop="password">
      <lg-input
        type="password"
        :value="user.password"
        @input="user.password = $event"
        placeholder="请输入密码"
      ></lg-input>
    </lg-form-item>
    <lg-form-item>
      <lg-button type="primary" @click="login">登 录</lg-button>
    </lg-form-item>
  </lg-form>
</template>

<script>
import LgForm from "./form/Form";
import LgFormItem from "./form/FormItem";
import LgInput from "./form/Input";
import LgButton from "./form/Button";
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
          },
          {
            min: 6,
            max: 12,
            message: "请输入6-12位密码",
          },
        ],
      },
    };
  },
  components: {
    LgForm,
    LgFormItem,
    LgInput,
    LgButton,
  },
  methods: {
    login() {
      console.log("登录...");
      this.$refs.form.validate((valid) => {
        if (valid) {
          alert("验证成功");
        } else {
          alert("验证失败");
          return false;
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
</style>