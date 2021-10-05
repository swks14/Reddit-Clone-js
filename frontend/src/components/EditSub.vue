<template>
  <form @submit="EditDescription">
    <h1>Edit Subreddit Description</h1>

    <label>Description</label>
    <textarea type="text" rows="5" cols="60" class="form-control" placeholder="Content"
              v-model="description">
    </textarea>
    <el-button class="el-button" type="primary" native-type="submit">Edit
    </el-button>

  </form>


</template>

<script>
// eslint-disable-next-line no-unused-vars
import subredditService from "@/services/subredditService";



export default {
  name: "EditPost",
  data() {
    return {
      description: "",
      subredditName: this.$route.params.subreddit
    }
  },
  methods: {
    EditDescription(e) {
      e.preventDefault();
      subredditService.editSubredditDesc(this.subredditName, this.description)
          .then(value => {console.log(value);
            window.location.href =`/r/${this.subredditName}`}
          ).then().catch(reason => console.log(reason));
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

.el-button {
  margin-top: 20px;
  width: 100%;
  background-color: black;
  border-color: black;
  color: white;
}

</style>