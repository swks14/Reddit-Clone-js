<template>
  <header>
    <nav>
      <ul class="nav-link">
        <li><a href="/home">Home</a></li>
        <li><a href="/register">Register</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/settings/password">Change password</a></li>
        <li><a href="/createSubreddit">Create Subreddit</a></li>
      </ul>
    </nav>
  </header>

  <router-view/>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
  },
  created() {

  }

}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  //margin-top: 60px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background-color: #24252A;
}

a, li {
  font-family: "Monsterrat", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #edf0f1;
  text-decoration: none;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10%;
}

.nav-link {
  list-style: none;
}

.nav-link li {
  display: inline-block;
  padding: 0 20px;
}

.nav-link a {
  transition: all 0.3s ease 0s;
}

.nav-link a:hover {
  color: #0088a9;
}
</style>
