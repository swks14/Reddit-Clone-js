<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
  <form @submit="checkForm">
    <h1>Change password</h1>

    <label>New password</label>
    <el-alert v-if="newPasswordError"
              title="New password required!"
              type="error"
              :closable="false">
    </el-alert>
    <el-alert v-if="!newRepeatedPasswordError && mismatchedPasswordError"
              title="Passwords don't match!"
              type="error"
              :closable="false">
    </el-alert>
    <!--    TODO moze te hasła jakos robic zeby kilka liter i cyfra itd-->
    <input type="password" @input="newPasswordError=false;mismatchedPasswordError=false"
           class="form-control" placeholder="New password" v-model="newPassword">
    <label>Repeat new password</label>
    <el-alert v-if="newRepeatedPasswordError"
              title="Repeated new password required!"
              class="el-alert"
              type="error"
              :closable="false">
    </el-alert>
    <input type="password" @input="newRepeatedPasswordError=false" class="form-control" placeholder="Repeat new password"
           v-model="newPasswordRepeated">

    <el-button class="btn-primary" type="primary"
               native-type="submit">Change
    </el-button>

  </form>
</template>

<script>
import userService from "../services/userService";

export default {
  name: "ChangePassword",
  data() {
    return {
      newPassword: '',
      newPasswordRepeated: '',
      newPasswordError: false,
      mismatchedPasswordError:false
    }
  },
  methods: {
    changePassword() {
      // eslint-disable-next-line no-unused-vars
      userService.changePassword(this.newPassword).then(value => {
        window.location.href = "/login"
      }).catch(error => {
        console.log(error.response)
      })
    },
    checkForm(e) {
      e.preventDefault();

      if (this.newPassword.length<2) {
        this.newPasswordError = true;
      }

      if (this.newPassword !== this.newPasswordRepeated) {
        this.mismatchedPasswordError = true;
      }
      if (this.newPassword && this.newPasswordRepeated && (this.newPassword === this.newPasswordRepeated)) {
        this.changePassword();
        return true;
      }

    }

  }
}

</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');

form {
  font-family: "Monsterrat", sans-serif;
  max-width: 420px;
  margin: 30px auto;
  background: lightblue;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}
input{
  margin-bottom: 5px;
}

.el-button {
  margin-top: 20px;
  width: 100%;
  background-color: black;
  border-color: black;
}

.el-alert {
  margin: 10px auto;
  text-align: center;
  background-color: #ffe6e6;
  border-radius: 10px;
  border: 2px solid red;
}

</style>