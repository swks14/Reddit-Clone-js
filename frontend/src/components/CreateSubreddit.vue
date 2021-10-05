<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
  <form @submit="createSubreddit">
    <h1>Create Subreddit</h1>
  <label>Name</label>
  <input type="text" class="form-control" placeholder="Title" v-model="name">

  <label>Description</label>
  <textarea type="text" rows="5" cols="60" class="form-control" placeholder="Content"
            v-model="description">
    </textarea>
    <el-button class="el-button" type="primary" native-type="submit">Create
    </el-button>
  </form>
</template>


<script>
import subredditService from "@/services/subredditService";
export default {
  name: "CreateSubreddit",
  data(){
    return{
      name:"",
      description:""
    }
  },
  methods:{
    createSubreddit(e){
      e.preventDefault();
      subredditService.createSubreddit(this.name,this.description).then(window.location.href=`/r/${this.name}`)

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