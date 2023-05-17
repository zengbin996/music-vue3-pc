<template>
  <!-- 导航栏 -->
  <header class="header">
    <div class="inner">
      <div class="title" @click="goIndex">Music</div>
      <div class="nav">
        <span @click="recommend">推荐</span>
        <span @click="rankingList">排行榜</span>
        <span @click="SongSingle">歌单</span>

        <span>
          <input type="text" placeholder="开始搜索" class="input" v-model="keyword" @keydown.enter="start" />
        </span>
        <span style="cursor: default">|</span>

        <span @click="login" v-if="!loginInfo.profile">登录</span>
        <span class="avatar-con" v-else>
          <el-popover placement="bottom" :width="50" trigger="hover">
            <template #reference>
              <el-avatar shape="square" size="medium" :src="loginInfo.profile.avatarUrl + '?param=36y36'"></el-avatar>
            </template>
            <div class="aratar-button">
              <p><el-button type="text" size="small" @click="userDetail">个人信息</el-button></p>
              <p><el-button type="text" size="small" @click="exitLogin">退出登录</el-button></p>
            </div>
          </el-popover>
        </span>
      </div>
    </div>
  </header>

  <el-dialog title="登录" v-model="MVisible" width="600px" center @close="close" :close-on-click-modal="false">
    <el-form :model="form" ref="formRef" style="width: 80%; margin: 0 auto" :rules="rules" v-if="loginType == 1">
      <el-form-item label="用户名" label-width="80px" prop="uname">
        <el-input
          v-model.trim="form.uname"
          placeholder="请输入用户名"
          suffix-icon="el-icon-user-solid"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="80px" prop="psw">
        <el-input
          v-model.trim="form.psw"
          placeholder="请输入秘密"
          type="password"
          suffix-icon="el-icon-lock"
          autocomplete="off"
          @keydown.enter="dialogOK"
        ></el-input>
      </el-form-item>
      <div class="sava-password">
        <el-checkbox v-model="savaPassword" label="记住秘密"></el-checkbox>
      </div>
    </el-form>

    <el-form
      :model="phoneForm"
      ref="phoneFormRef"
      style="width: 80%; margin: 0 auto"
      :rules="phoneFormRules"
      v-if="loginType == 2"
    >
      <el-form-item label="电话号码" label-width="80px" prop="phone">
        <el-input
          v-model.trim="phoneForm.phone"
          placeholder="请输入电话号码"
          suffix-icon="el-icon-user-solid"
          autocomplete="on"
          maxlength="11"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" label-width="80px" prop="verify">
        <el-input v-model.trim="phoneForm.verify" maxlength="6" placeholder="请输入验证码" @keydown.enter="dialogOK">
          <template #append>
            <el-button @click="getVirefy" type="primary" size="small" style="width: 130px">{{
              verifyText == '发送验证码' ? verifyText : verifyText + '秒后重新发送'
            }}</el-button></template
          >
        </el-input>
      </el-form-item>
    </el-form>

    <div v-if="loginType == 3" class="qrcode-box" v-loading="loading">
      <p>请使用网易云音乐app扫码登录</p>
      <qrcode-vue class="qrcode" :value="loginQr.qrurl" :size="150" level="L" />
      <div class="shade" v-if="shade">请在手机上授权登录</div>
    </div>

    <template class="dialog-footer" #footer>
      <span>
        <div v-if="loginType != 3">
          <el-button @click="MVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="dialogOK" size="small">确 定</el-button>
        </div>
        <p class="login-type">
          <el-button type="text" size="small" v-if="loginType != 1" @click="loginType = 1">账号秘密登录</el-button>
          <el-button type="text" size="small" v-if="loginType != 2" @click="loginType = 2">验证码登录</el-button>
          <el-button type="text" size="small" v-if="loginType != 3" @click="qrLogin">扫码登录</el-button>
        </p>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import QrcodeVue from 'qrcode.vue';

import { loginApi, logoutApi, captchaApi, qrKeyApi, qrCreateApi, qrCheckApi, userAccountApi } from '../../request/api';
const store = useStore();
const router = useRouter();

const goIndex = () => router.push('/pc/main');

const keyword = ref();
const start = () => {
  router.push({
    name: 'pcSearchResult',
    query: { keywords: keyword.value },
  });
  keyword.value = '';
};

//dialog
/*登录类型
  账号秘密 1
  短信验证码 2
  二维码 3
*/
const loginType = ref(1);
const formRef = ref(null);
const MVisible = ref(false);
const savaPassword = ref(false);
const loginInfo = ref(JSON.parse(localStorage.getItem('loginInfo') ?? '{}'));
const { uname, psw } = JSON.parse(localStorage.getItem('userInfo') ?? '{}');

const form = reactive({ uname, psw });

if (uname) {
  savaPassword.value = true;
}

const rules = reactive({
  uname: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 30, message: '长度不能大于30个字符', trigger: 'blur' },
  ],
  psw: [
    { required: true, message: '请输入秘密', trigger: 'blur' },
    { max: 30, message: '长度不能大于30个字符', trigger: 'blur' },
  ],
});

//验证码登录
const phoneFormRef = ref(null);
const phoneForm = reactive({ phone: '', verify: '' });
const phoneFormRules = reactive({
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { max: 11, min: 11, message: '请输入正确的电话号码', trigger: 'blur' },
  ],
  verify: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { max: 30, message: '长度不能大于30个字符', trigger: 'blur' },
  ],
});
const verifyText = ref('发送验证码');
const getVirefy = () => {
  phoneFormRef.value.validateField('phone', valid => {
    if (valid) {
      ElMessage(valid);
    } else {
      if (verifyText.value !== '发送验证码') {
        return ElMessage('请在' + verifyText.value + '秒后重试');
      }
      captchaApi({ phone: phoneForm.phone })
        .then(res => {
          ElMessage.success('发送成功');
        })
        .catch(err => {
          ElMessage.success('发送失败,请稍后重试');
        });

      verifyText.value = 60;
      const timer = setInterval(() => {
        verifyText.value = verifyText.value - 1;
        if (verifyText.value == 0) {
          verifyText.value = '发送验证码';
          clearInterval(timer);
        }
      }, 1000);
    }
  });
};

//二维码登录
const loading = ref(false);
const shade = ref(false);
const loginQr = reactive({
  key: '',
  qrurl: '',
});

let timerRusult = null;

const qrLogin = async () => {
  loading.value = true;
  loginType.value = 3;
  const key = await qrKeyApi({ timestamp: new Date().getTime() });
  loginQr.key = key.data.unikey;
  const qr = await qrCreateApi({ key: loginQr.key, timestamp: new Date().getTime() });
  loginQr.qrurl = qr.data.qrurl;
  loading.value = false;

  timerRusult = setInterval(() => {
    qrCheckApi({ key: loginQr.key, timestamp: new Date().getTime() }).then(res => {
      if (res.code == 802) {
        shade.value = true;
      }

      if (res.code == 803) {
        userAccountApi().then(res => {
          loginInfo.value = res;
          localStorage.setItem('loginInfo', JSON.stringify(res));
          clearInterval(timerRusult);
          ElMessage.success('登录成功');
          MVisible.value = false;
        });
      }

      if (res.code == 800) {
        ElMessage('二维码过期,请刷新重试');
        clearInterval(timerRusult);
      }
    });
  }, 500);
};

const login = () => (MVisible.value = true);
const exitLogin = () => {
  logoutApi().then();
  localStorage.removeItem('loginInfo');
  loginInfo.value = {};
  ElMessage('已退出');
};

const dialogOK = () => {
  if (loginType.value == 1) {
    formRef.value.validate(valid => {
      if (valid) {
        const { uname, psw } = form;
        loginApi({ phone: uname, password: psw })
          .then(res => {
            if (res.code === 200) {
              loginInfo.value = res;
              localStorage.setItem('loginInfo', JSON.stringify(res));
              //保存用户名秘密
              if (savaPassword.value) {
                const userInfo = { uname, psw };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
              }
              ElMessage.success('登录成功');
              MVisible.value = false;
              return;
            }

            if (res.code === 204) {
              return ElMessage.error('密码错误');
            }
            return ElMessage.error('用户名或者密码错误');
          })
          .catch(fail => {
            console.log(fail);
            ElMessage.error('登录失败，请稍后重试');
          });
      }
    });
  }

  if (loginType.value == 2) {
    phoneFormRef.value.validate(valid => {
      if (valid) {
        const { verify, phone } = phoneForm;

        loginApi({ phone, captcha: verify })
          .then(res => {
            console.log('res', res);

            if (res.code === 200) {
              loginInfo.value = res;
              localStorage.setItem('loginInfo', JSON.stringify(res));
              ElMessage.success('登录成功');
              MVisible.value = false;
              return;
            }

            if (res.code === 204) {
              return ElMessage.error('验证码错误');
            }
            return ElMessage.error('登录失败，请稍后重试');
          })
          .catch(fail => {
            console.log(fail);
            ElMessage.error('登录失败，请稍后重试');
          });
      }
    });
  }
};

const close = function () {
  form.psw = '';
  form.uname = '';
};

const userDetail = () => router.push('/pc/userinfo');

//推荐 排行榜 歌单
const recommend = () => router.push('/pc/recommend');
const rankingList = () => router.push('/pc/ranking');
const SongSingle = () => router.push('/pc/SongSingle');
</script>

<style lang="less" scoped>
.header {
  background: #fff;
  width: 100%;
  box-shadow: 0 0px 10px rgba(0, 0, 0, 0.15);
  height: 80px;

  .inner {
    width: 1200px;
    margin: 0 auto;

    input {
      background: none;
      outline: none;
      border: 1px solid #ccc;
    }

    display: flex;
    justify-content: space-between;

    line-height: 80px;
    font-size: 16px;

    .title {
      font-weight: 700;
      font-size: 22px;
      cursor: pointer;
    }

    .nav {
      display: flex;
      span {
        cursor: pointer;
        margin: 0 10px;
      }

      .avatar-con {
        display: block;
        font-size: 0;
        span {
          margin: 0;
        }

        display: flex;
        align-items: center;
      }
    }

    .input {
      border: 1px solid #ccc;
      line-height: 2;
      border-radius: 10px;
      text-indent: 1em;
    }
  }
}

.sava-password {
  text-align: center;
}

.login-type {
  position: relative;
}

.login-type::before {
  content: '其他登录方式 >';
  color: #454545;
  font-size: 12px;
  position: absolute;
  left: 100px;
  top: 10px;
}

.qrcode-box {
  text-align: center;
  position: relative;
  .shade {
    position: absolute;
    z-index: 10;
    top: 30px;
    left: 50%;
    margin-left: -75px;
    width: 150px;
    height: 150px;
    text-align: center;
    line-height: 150px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
  }
}

.aratar-button {
  text-align: center;

  p {
    margin: 0;
  }

  & > p:first-child {
    border-bottom: 1px solid #eee;
  }
}
</style>
