<template>

  <div>
    <h1 class="subName">r/{{ subreddit.name }}</h1>
    <h2 class="subDesc"> {{ subreddit.description }}</h2>
    <div class="buttons2">
    <div v-if="userLogged" class="buttons">
    <el-button @click="joinSubreddit">{{ userHasJoined ? "Joined" : "Join Subreddit" }}</el-button>
    <el-button  @click="createPost">Create Post</el-button>
    <el-button v-if="userIsMod" @click="editDescription">Edit description</el-button>
    </div>
    </div>
  </div>
  <div v-for="post in posts" :key="post.id">
    <div class="post">
      <div class="voteBar">
        <p @click="vote(1, post.id, post.userVote)"><i class="fas fa-arrow-up"></i></p>
        <p @click="vote(-1, post.id,  post.userVote)"><i class="fas fa-arrow-down"></i></p>
        <h3>{{ post.voteCount }}</h3>
        <p>Your Vote {{ post.userVote }}</p>
      </div>
      <p v-if="userIsMod" @click="deletePost(post.id)"><i class="fa fa-trash"></i></p>
      <div class="content">
        <h6 class="postInfo">Posted by {{ post.authorNickname }} on
          {{ new Date(post.creation_date).toLocaleString() }}</h6>
        <div class="postImage"><img v-if="post.image_path" :src="post.image_path"></div>
        <h3 class="title">{{ post.title }}</h3>
        <div class="postText">{{ post.content }}</div>
        <div class="postOption">
          <router-link :to="{name: 'Post', params: {subreddit: subredditName, id: post.id}}"><i
              class="far fa-comments"></i> {{ post.commentCount }} comments
          </router-link>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import subredditService from "../services/subredditService";
import {io} from "socket.io-client";
// eslint-disable-next-line no-unused-vars

// eslint-disable-next-line no-unused-vars
const socket = io("http://localhost:3000/")

export default {
  name: "Subreddit",
  data() {
    return {
      subreddit: [],
      posts: [],
      commentContent: "",
      subredditName: this.$route.params.subreddit,
      userHasJoined: null,
      userIsMod:false,
      userLogged:false
    }
  },
  created() {
    console.log(this.posts);
    // let subredditName = this.$route.params.subreddit;
    socket.emit("join", this.subredditName)
    // eslint-disable-next-line no-unused-vars
    socket.on("connect", s => {
      console.log("Xddd")
    });
    socket.on("add_comment", args => {
          var result = this.posts.find(post => {
            return post.id === args[0].post_id
          })
          console.log(result)
          result.comments.unshift(args[0]) //TODO wysyłaj albo sortuj tutaj posty
        }
    );
    socket.on("remove_post", args => {
          console.log(args)
          console.log(this.posts);
          let index = this.posts.findIndex(x => x.id === parseInt(args.id))
          console.log(index)
          console.log(this.posts);
          this.posts.splice(index, 1)

        }
    );

    subredditService.getSubredditByName(this.subredditName).then(value => {
      this.subreddit = value.data.subreddit;
      this.posts = value.data.posts;
      this.userHasJoined = value.data.userHasJoined;
      this.userIsMod = value.data.userIsModerator;
      this.userLogged =value.data.userLogged;
      console.log(value.data);
      // eslint-disable-next-line no-unused-vars
    }).catch(reason => {
      this.errorMessage = "No subreddit with this name found!"
    })
    this.posts.sort(function(a,b){return a.creation_date - b.creation_date});
  },
  methods: {
    vote(voteValue, postId, userVote) {
      if (userVote === voteValue) voteValue = 0;
      subredditService.vote(this.subredditName, postId, voteValue).then(value => console.log(value))
    },
    //BCRYPT
    sendComment(e, id) {
      e.preventDefault();
      // eslint-disable-next-line no-unused-vars
      subredditService.postComment(this.subredditName, id, this.commentContent).then(value => {
        socket.emit("new_comment", value.data)
      }).catch(error => {
        console.log(error)
      })
    },
    createPost() {
      window.location.href = window.location + '/createPost';
    },
    editDescription() {
      window.location.href = window.location + '/editDesc';
    },
    async joinSubreddit() {
     await subredditService.joinSubreddit(this.subredditName);
      window.location.reload(true);
    },
    deletePost(postId){
    subredditService.deletePost(this.subredditName,postId)
    }


  }
}
</script>

<style lang = "scss" scoped>
.voteBar {
  background-color: lightblue;
  color: black;
}
.content {
  margin: 1rem;
}
.postOption {
  margin: 1rem -1rem -1rem -1rem;
  padding: 0.7rem;
  background-color: #DDD;
  border-bottom-right-radius: 0.4rem;
}

.postOption a {
  text-decoration: none;
  color: black;
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

.post {
  display: flex;
  width: 40%;
  margin: 1rem auto;
  border-radius: 0.8rem;
  border: solid black;


}
.subName{
  font-family: "Monsterrat", sans-serif;
  text-align: center;
}
.subDesc{
  font-family: "Monsterrat", sans-serif;
  text-align: center;
  font-size: 15px;
}

.buttons{
  background-color: #aaaaaa;
  position: absolute;
  right: 10px;
  top: 80px;
}
.el-button {
  width: 100%;
  background-color: black;
  border-color: black;
  color: white;
}

</style>