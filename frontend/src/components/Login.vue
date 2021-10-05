<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
  <form @submit="login">
    <h1>Login</h1>
    <div class="mb-3">
      <label for="email">Email address</label>
      <input type="email" class="form-control" id="email" aria-describedby="emailHelp"
             placeholder="Enter email" v-model=formValues.email>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Password" v-model=formValues.password >
    </div>
      <el-button class="btn-primary" type="primary"
                 native-type="submit">Login
      </el-button>
  </form>
</template>
<script>
import axios from "axios";

export default {
  name: 'Login',
  data() {
    return {
      formValues: {
        email: "",
        password: ""
      }
    }
  },
  methods: {
    login(e) {
      e.preventDefault();
      axios.post('http://localhost:5000/login/', {
        email: this.formValues.email,
        password: this.formValues.password,
      }, {withCredentials: true})
          .then((response) => {
            console.log(response);
            window.location ="/home";
          }).catch(error => console.log(error));
      //TODO tutaj wyslanie api with credentials axios true
    }
  }

}
</script>
<style lang = "scss" scoped>

.el-button {
  margin-top: 20px;
  width: 100%;
  background-color: black;
  border-color: black;
}
input{
  margin-bottom: 5px;
}

form {
  font-family: "Monsterrat", sans-serif;
  max-width: 420px;
  margin: 30px auto;
  background: lightblue;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}

</style>
    