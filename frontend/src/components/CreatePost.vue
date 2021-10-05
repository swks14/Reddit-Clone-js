<template>
  <form @submit="addPost">
    <h1>Create Post</h1>

    <label>Title</label>
    <input type="text" class="form-control" placeholder="Title" v-model="title">

    <label>Content</label>
    <textarea type="text" rows="5" cols="60" class="form-control" placeholder="Content"
              v-model="content">
    </textarea>
    <label>Video URL</label>
    <input type="text" class="form-control" placeholder="Video URL" v-model="video_url">

    <label>Insert image</label>
    <br>

    <input type="file" class="form-control" name="myImage" accept="image/*" @change="uploadImage($event)"/>
    <el-button class="el-button" type="primary" native-type="submit">Create
    </el-button>

  </form>


</template>

<script>
// eslint-disable-next-line no-unused-vars
import postService from "@/services/postService";


async function getImageToFormData(image) {
  console.log(image);
  const data = new FormData();
  data.append("image", image);
  return data;
}

export default {
  name: "CreatePost",
  data() {
    return {
      title: "",
      content: "",
      image_path: `http://localhost:5000/frontend/images/`,
      video_url: "",
      filename: "",
      subredditName: this.$route.params.subreddit
    }
  },
  methods: {
    async uploadImage(e) {
      e.preventDefault();
      const image = e.target.files[0];
      this.filename = e.target.files[0].name;
      this.image_path = `http://localhost:5000/frontend/images/`;
      this.image_path = this.image_path + this.filename;
      let imageToUpload = await getImageToFormData(image);
      console.log(this.image_path);
      await postService.uploadPhoto(imageToUpload);
    },
    addPost(e) {
      e.preventDefault();
      let videoEmbed ="https://www.youtube.com/embed/" + this.video_url.slice(32);
      console.log(videoEmbed);
      postService.createPost(this.subredditName, this.title, this.content, this.image_path, videoEmbed)
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