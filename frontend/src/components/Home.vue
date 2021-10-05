<template>
  <h1 class="noResult" v-if="subreddits.length === 0">No post for you. Please join subreddits!</h1>
  <form class="search" @submit="search">
    <div class="searchbar">
      <input v-model="query" placeholder="Search" id="searchbar"
             class="search-data">
    </div>
    <button type="submit" class="fas fa-search"></button>
  </form>
  <div class="subredditContainer">
    <div class="posts">
      <div v-for="subreddit in subreddits" :key="subreddit.id">
        <div class="post" v-if="subreddit.topPost">
          <div class="voteBar">
            <div class="votes">
              <p>Votes</p>
              <h3>{{ subreddit.topPost.voteCount }}</h3>
            </div>
          </div>
          <div class="content">
            <h6 class="postInfo">
              <router-link :to="{name:'Subreddit', params:{subreddit: subreddit.name}}"><h2 class="subredditInfo">Posted
                on r/{{ subreddit.name }}</h2></router-link>
              <router-link :to="{name:'Post', params:{subreddit: subreddit.name, id: subreddit.topPost.id}}">Posted by
                <p class="nickname">{{ subreddit.topPost.authorNickname }}</p> on
                {{ new Date(subreddit.topPost.creation_date).toLocaleString() }}
              </router-link>
            </h6>
            <h2 class="title">{{ subreddit.topPost.title }}</h2>
            <div class="postImage" v-if="subreddit.topPost.image_path"><img v-if="subreddit.topPost.image_path"
                                                                            :src="subreddit.topPost.image_path"></div>
            <div class="postVideo" v-if="subreddit.topPost.video_url">
              <iframe v-if="subreddit.topPost.video_url"
                      :src="'https://www.youtube.com/embed/' + subreddit.topPost.video_url.replace('https://www.youtube.com/watch?v=', '')"
                      width="560" height="315" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="postText">{{ subreddit.topPost.content }}</div>
            <div class="postOption">
              <router-link :to="{name: 'Post', params: {subreddit: subreddit.name, id: subreddit.topPost.id}}"><i
                  class="far fa-comments"></i> {{ subreddit.topPost.commentCount }} comments
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import subredditService from "@/services/subredditService";

export default {
  name: "Home",
  data() {
    return {
      isAuthenticated: null,
      userNickname: null,
      subreddits: [],
      query: "",
    }
  },
  created() {
    this.isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    this.userNickname = localStorage.getItem("userNickname");
    subredditService.getHomePage().then(value => {
      console.log(value.data);
      this.subreddits = value.data.subreddits;
    });
  },
  methods: {
    search(e) {
      e.preventDefault();
      window.location.href = "/search/?query=" + this.query;
    }
  }
}

</script>

<style scoped lang="scss">
.voteBar {
  background-color: lightblue;
  color: black;
}


.about {
  color: white;
  font-size: 1rem;
  font-weight: 500;
  position: relative;
  background-color: #68a1cc;
  display: flex;
  justify-content: center;
  padding: 1rem;
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;

}

.titleContainer {
  background-image: url("https://www.transparenttextures.com/patterns/robots.png");
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.pathSpan {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.subredditTitle span {
  font-weight: 500;
  font-size: 1.5rem;
}

.search {
  float: right;
}

.fa-search {
  margin-top: 5px;
}

.subredditContainer {
  display: flex;
  margin-top: 2rem;
}

.descriptionContainer {
  flex: 1 1 40rem;
  margin-top: 2rem;
}

.description {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0.5rem;
  margin-top: 1rem;
  margin-right: 6rem;
}

.joinButton {
  border: 1px solid;
  border-radius: 2rem;
  margin: 1rem;
}

.content {
  margin: 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.postImage {
  display: flex;
}


.postImage > img {
  max-width: 100%;
  max-height: 100%;
  margin-left: auto;
  margin-right: auto;
}

.post {
  display: flex;
  margin: 3rem 6rem 1rem 6rem;
  background-color: white;
  border: solid black;
  border-radius: 0.8rem;
}


.title {


}

.postText {
  margin-top: 1rem;
  word-break: break-all;
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


.changeDescription {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
  font-size: 1rem;
}

.changeDescription:hover {
  color: #aaaaaa;
}

.descriptionText {
  margin: 1rem;
  font-size: 1rem;
  word-break: break-all;
}

.delete {
  color: #a91827;
  cursor: pointer;
}

.delete:hover {
  color: #630913;
}

.votes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.votes p {
  margin: 0.2rem;
  padding: 0.2rem;
  cursor: pointer;
}

.votes p:hover {
  color: #4680bb;
}

.postVideo {
  margin-top: 1rem;

}

.postVideo iframe {

  width: 100%;

}

.posts {
  width: 80%;
}

.voted {
  color: #68a1cc;
}

.newPostButton {
  width: 100%;
  background-color: #3a3a44;
  border-color: #555;
  color: white;
  margin: 0 auto;
}

.newPostButton:hover {
  background-color: #2a2a33;
}

.descriptionContent {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  margin: 1rem;

}

.descriptionContent i {
  padding: 0 0.5rem;
}

.postInfo a {
  text-decoration: none;
  color: black;
}

.subreddit a {
  text-decoration: none;
  color: black;
}

.nickname {
  font-size: 0.9rem;
  display: inline;
}

.subredditInfo {
  font-size: 1rem;
}

.noResult {
  text-align: center;
  color: black;
  margin-top: 5rem;
}
</style>
