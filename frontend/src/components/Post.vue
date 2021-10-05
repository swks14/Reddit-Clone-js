<template>
  <div class="post">
    <div class="voteBar">
      <p>Post</p>
    </div>
    <div class="content">
      <h6 class="postInfo">Posted by {{ post.authorNickname }} on
        {{ new Date(post.creation_date).toLocaleString() }}</h6>
      <h3 class="title">{{ post.title }}</h3>
      <div class="postText">{{ post.content }}</div>
      <div class="postImage"><img v-if="post.image_path" :src="post.image_path" alt="NO IMAGE"></div>

      <iframe v-if="post.video_url.length>10" width="420" height="315"
              :src="post.video_url" >
      </iframe>
    </div>

  </div>
  <div>
    <div>
      <form class="commentArea" @submit="addComment($event, post.id)">
        <textarea name="comment" v-model="commentContent"></textarea>
        <button>Dodaj komentarz</button>
      </form>
    </div>



    <!--          todo schowaj dla niezalogowanego-->

  <div class="comment" v-for="comment in comments" :key="comment.id">
    <p>{{ comment.content }}</p>
    <p v-if="userIsMod" @click="deleteComment(comment.id)"><i class="fa fa-trash"></i></p>
  </div>
  </div>
  <!--  koment na stronie posta TODO-->
</template>

<script>

import postService from "../services/postService";
import {io} from "socket.io-client"
const socket = io("http://localhost:3000/")
export default {
  name: "Post",
  data() {
    return {
      subredditName: this.$route.params.subreddit,
      id: this.$route.params.id,
      commentContent: '',
      post: {},
      comments: [],
      userIsMod:false,
    }
  },
  created() {
    socket.emit("join", `${this.subredditName}-post-${this.id}`)
    socket.on("remove_comment", args => {
          let index = this.comments.findIndex(x => x.id === parseInt(args.id))
          this.comments.splice(index, 1)

        }
    )

    socket.on("add_comment", args => {
          this.comments.unshift(args);
        }
    )
    postService.getCommentsFromPostById(this.subredditName, this.id).then(value => {

      this.post = value.data.post;
      this.comments = value.data.comments;
      this.userIsMod = value.data.userIsModerator;

      // eslint-disable-next-line no-unused-vars
    }).catch(reason => {
      this.errorMessage = "No post with this id found!"
    })

  },
  methods: {
    addComment(e){
      e.preventDefault();
      postService.postComment(this.subredditName,this.post.id,this.commentContent)

    },
    deleteComment(commentId){
      postService.deleteComment(this.subredditName,this.post.id,commentId)
    }
  }
}
</script>

<style scoped>
.voteBar {
  background-color: #2c3e50;
}
.postInfo{

}
.content {
  margin: 1rem;
}
.postImage {
  display: flex;
}
.postImage > img {
  width: 40%;
  height: 40%;
  margin-left: auto;
  margin-right: auto;
}
.commentArea {
  display: flex;
  flex-direction: column;
  margin: 1rem auto;
  justify-content: center;
  width: 40%;
}
.commentArea > button {
  margin: 1rem auto;
  width: 20%;
}

.commentArea > textarea {
  height: 10rem;
  resize: none;
}

.post {
  display: flex;
  width: 40%;
  margin: 1rem auto;
  background-color: #aaaaaa;
  border: 1px solid black;
}

.comment {
  display: flex;
  width: 40%;
  margin: 1rem auto;
  background-color: #aaaaaa;
  border: 1px solid black;
}
.title {


}
.postText {

}
.postOption {

}
</style>