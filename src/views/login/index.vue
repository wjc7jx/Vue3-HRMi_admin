<template>
  <div class="login-container">
    <div class="logo"></div>
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <el-form ref="form" :model="loginForm" :rules="loginRules">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginForm.isAgree">
              用户平台使用协议
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button style="width:350px" type="primary" @click="onLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { userLoginService } from '@/api/user'
import{useRouter} from 'vue-router'
import {useUserStore} from '@/stores'
const userStore = useUserStore()
const router = useRouter()
// 登录表单
const loginForm = ref({
  mobile: import.meta.env.DEV?'13800000002':'',
  password: import.meta.env.DEV?'hm#qd@23!':'',
  isAgree: import.meta.env.DEV
})
// 提交校验
const form = ref()
// 登录规则
const loginRules = {
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],

  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度应该为6-16位之间', trigger: 'blur' }
  ],

  // required只能检测 null undefined ""
  isAgree: [
    { validator: (rule, value, callback) => { value ? callback() : callback(new Error('您必须勾选用户的使用协议')) } }
  ]
}
// onLogin登录
const onLogin = async() => {
  // 提交前校验
  await form.value.validate()
  const res = await userLoginService(loginForm.value)//提交
  userStore.setToken(res)//保存token
  router.push('/')//跳转首页

}
</script>

<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;

  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png) no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;

    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center / contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }

    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }

  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;

    .el-card {
      border: none;
      padding: 0;
    }

    h1 {
      padding-left: 20px;
      font-size: 24px;
    }

    .el-input {
      width: 350px;
      height: 44px;

      .el-input__inner {
        background: #f4f5fb;
      }
    }

    .el-checkbox {
      color: #606266;
    }
  }
}
</style>
