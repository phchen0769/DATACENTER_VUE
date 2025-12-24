<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <el-form class="login-form" ref="loginFormRef" :model="loginForm" :rules="loginRules">
      <div class="title-container">
        <h3 class="title">{{ $t('msg.login.title') }}</h3>
        <lang-select class="lang-select" effect="light" />
      </div>
      <!-- 用户名 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <!-- 使用内部图标 -->
          <svg-icon icon="user" />
        </span>
        <el-input
          placeholder="请输入用户名"
          name="username"
          type="text"
          v-model="loginForm.username"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <!-- 使用内部图标 -->
          <svg-icon icon="password"></svg-icon>
        </span>
        <el-input
          placeholder="请输入密碼"
          name="password"
          :type="passwordType"
          v-model="loginForm.password"
        />
        <span class="show-pwd" @click="showPwd">
          <!-- 密码眼睛图片逻辑判断-->
          <svg-icon :icon="passwordType === 'password' ? 'eye' : 'eye-open'"></svg-icon>
        </span>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-button type="primary" :loading="loading" @click="handlerLogin">{{
        $t('msg.login.loginBtn')
      }}</el-button>
      <!-- 注册 -->
      <el-button type="primary">{{ $t('msg.login.regesterBtn') }}</el-button>
      <!-- <div class="tips" v-html="$t('msg.login.desc')"></div> -->
    </el-form>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon/index.vue'
import { ref } from 'vue'
import { validatePassword } from './rules'
import { useUserStore } from '@/stores/user'
import LangSelect from '@/components/LangSelect/index.vue'
import { useI18n } from 'vue-i18n'

// 实例化i18n
const i18n = useI18n()

// 数据源
const loginForm = ref({
  username: 'admin',
  password: 'admin123'
})

// 验证规则
const loginRules = ref({
  username: [
    {
      required: true,
      // 使用i18n
      message: i18n.t('msg.login.usernameRule'),
      trigger: 'blur'
    },
    {
      min: 4,
      message: i18n.t('msg.login.usernameLengthRule'),
      trigger: 'blur'
    }
  ],
  password: [{ required: true, trigger: 'blur', validator: validatePassword() }]
})

// 处理密码框文本显示
const passwordType = ref('password')
// tempate中调用的方法
const showPwd = () => {
  // 使用ref声明数据，在script setup中使用时，需要加上.value
  // template中直接使用即可，不需要加上value
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}

// 登录按钮点击事件
const loading = ref(false)
// 实例化user store实例
const userStore = useUserStore()
// 获取表单实例：当需要手动触发表单校验时，可以通过ref获取表单实例
const loginFormRef = ref(null)
const handlerLogin = () => {
  // 1、表单校验
  // 打印loginformref，可以看到里面有validate方法
  // console.log(loginFormRef.value)
  loginFormRef.value.validate((valid) => {
    if (!valid) return
    // 2、发送请求（触发登录动作）
    loading.value = true
    userStore
      .login(loginForm.value)
      .then(() => {
        loading.value = false
        // 3、进行登录
      })
      .catch((err) => {
        console.log(err)
        loading.value = false
      })
  })
}
</script>

<style lang="scss" scoped>
// 定义颜色变量
$bg: #2b3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    // 深度选择器
    :deep(.el-form-item) {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    :deep(.el-input) {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        height: 47px;
        background: transparent;
        border: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        caret-color: $cursor;
      }

      .el-input__wrapper {
        width: 100%;
        background-color: currentColor;
      }
    }

    :deep(.el-button) {
      width: 30%;
      height: 47px;
      display: inline-block;
      margin: 20px 10%;
      border-radius: 5px;
      background-color: #4a8cf7;
      color: $light_gray;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .tips {
    color: #fff;
    font-size: 16px;
    line-height: 24px;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
  }

  .title-container {
    position: relative;
  }

  .title {
    font-size: 26px;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .lang-select {
    position: absolute;
    top: 4px;
    right: 0;
    background-color: #fff;
    font-size: 22px;
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
