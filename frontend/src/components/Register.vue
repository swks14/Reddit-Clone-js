<template>
  <form @submit="checkForm">
    <h1>Register</h1>
    <el-alert class="el-alert" v-if="formValues.signUpErrorMessage"
              :title="formValues.signUpErrorMessage"
              type="error"
              :closable="false">
    </el-alert>

    <label>Email</label>
    <el-alert class="el-alert" v-if="formValues.emailError"
              title="Email required!"
              type="error"
              :closable="false">
    </el-alert>
    <input type="email" @input="formValues.emailError=false;signUpErrorMessage=false" class="form-control" placeholder="Email"
           v-model="formValues.email">

    <label>Nickname</label>
    <el-alert class="el-alert" v-if="formValues.nicknameError"
              title="Nickname required!"
              type="error"
              :closable="false">
    </el-alert>
    <input type="text" @input="formValues.nicknameError=false;signUpErrorMessage=false" class="form-control" placeholder="Nickname"
           v-model="formValues.nickname">

    <label>Password</label>
    <el-alert class="el-alert" v-if="formValues.passwordError"
              title="Password required!"
              type="error"
              :closable="false">
    </el-alert>
    <input type="password" @input="formValues.passwordError=false;signUpErrorMessage=false" class="form-control"
           placeholder="Password" v-model="formValues.password">

    <label>Repeat Password</label>
    <el-alert class="el-alert" v-if="formValues.repeatedPasswordError"
              title="Repeated password required!"
              type="error"
              :closable="false">
    </el-alert>
    <el-alert class="el-alert" v-if="!formValues.repeatedPasswordError && formValues.mismatchedPasswordError"
              title="Passwords don't match!"
              type="error"
              :closable="false">
    </el-alert>
    <input type="password" @input="formValues.repeatedPasswordError=false;signUpErrorMessage=false;mismatchedPasswordError=false"
           class="form-control" placeholder="Repeat Password" v-model="formValues.repeatedPassword">

    <el-button class="el-button" type="primary" native-type="submit">Submit
    </el-button>

  </form>
</template>
<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      formValues: {
        email: "",
        nickname: "",
        password: "",
        repeatedPassword: "",
        mismatchedPasswordError: false,
        emailError: false,
        passwordError: false,
        repeatedPasswordError: false,
        nicknameError: false,
        signUpErrorMessage: "",
      }
    }
  },
  methods: {
    register() {
      axios.post('http://localhost:5000/api/reddit_users/', {
        nickname: this.formValues.nickname, activation_guid: null,
        activation_expire_date: null,
        password: this.formValues.password,
        email: this.formValues.email
      }).then((response) => {
            console.log(response);
            window.location.href="/home"
        // eslint-disable-next-line no-unused-vars
          }).catch(error=>{this.signUpErrorMessage="This email already exists!"});
    },
    checkForm(e) {
      e.preventDefault();

      if (!this.formValues.email) {
        this.formValues.emailError = true;
      }
      if (!this.formValues.password) {
        this.formValues.passwordError= true;
      }

      if (!this.formValues.nickname) {
        this.formValues.passwordError = true;
      }

      if (!this.formValues.repeatedPassword) {
        this.formValues.repeatedPasswordError = true;
      }

      if (this.formValues.repeatedPassword !== this.formValues.password) {
        this.formValues.mismatchedPasswordError = true;
      }
      if (this.formValues.email && this.formValues.password && this.formValues.nickname && (this.formValues.repeatedPassword === this.formValues.password)) {
        this.register();
        return true;
      }

    }
  }
}
</script>
<style lang="scss" scoped>
form {
  font-family: "Monsterrat", sans-serif;
  max-width: 420px;
  margin: 30px auto;
  background: lightblue;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}
.btn-space {
  margin-top: 5px;
}

.el-button {
  margin-top: 20px;
  width: 100%;
  background-color: black;
  border-color: black;
  color: white;
}
.el-alert {
  margin: 10px auto;
  text-align: center;
  background-color: #ffe6e6;
  border-radius: 10px;
  border: 2px solid red;
}

</style>
