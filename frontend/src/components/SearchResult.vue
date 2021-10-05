<template>
  <h1 class="noResult" v-if="subreddits.length === 0 && posts.length === 0">No results!</h1>
  <div class="subreddit" v-for="subreddit in subreddits" :key="subreddit.id">
    <router-link :to="{name:'Subreddit', params:{subreddit: subreddit.name}}"><h6 class="subredditInfo">r/{{subreddit.name }}</h6></router-link>
    <p>{{ subreddit.description }}</p>
  </div>
  <div v-for="post in posts" :key="post.id">
    <div class="post">
      <div class="voteBar">
        <div class="votes">
          <h3 style="visibility: hidden">vote</h3>
        </div>
      </div>
      <div class="content">
        <h6 class="postInfo">
          <router-link :to="{name:'Subreddit', params:{subreddit: post.subredditName}}"><h2 class="subredditInfo">Posted on r/{{post.subredditName}}</h2></router-link>
          <router-link :to="{name:'Post', params:{subreddit: post.subredditName, id: post.id}}">Posted by <p class="nickname">{{ post.authorNickname }}</p> on
          {{ new Date(post.creation_date).toLocaleString() }}</router-link></h6>
        <h2 class="title">{{ post.title }}</h2>
        <div class="postImage" v-if="post.image_path"><img v-if="post.image_path" :src="post.image_path"></div>
        <div class="postVideo" v-if="post.video_url">
          <iframe v-if="post.video_url"  :src="post.video_url.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')"
                  width="560" height="315" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="postText">{{ post.content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import searchService from "../services/searchService";

export default {
  name: "SearchResult",
  data() {
    return {
      query: this.$route.query.query,
      posts: [],
      subreddits: [],
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      searchService.search(this.$route.query.query).then(value => {
        this.subreddits = value.data.subreddits;
        this.posts = value.data.posts;
      }).catch(err => console.log(err))
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    '$route'(to, from) {
     this.search()
    }
  }
}

</script>

<style scoped lang="scss">
.voteBar {
  background-color: lightblue;
  color: black;
}

.subredditTitle span {
  font-weight: 500;
  font-size: 1.5rem;
}

.postInfo a {
  text-decoration: none;
  color: black;
}

.subreddit a{
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
  border-radius: 0.8rem;
  border: solid black;
}



.title {


}

.postText {
  margin-top: 1rem;
  word-break: break-all;
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

.descriptionContent i {
  padding: 0  0.5rem;
}

.noResult {
  text-align: center;
  color: white;
  margin-top: 5rem;
}
.subreddit {
  display: flex;
  border: solid black;
  border-radius: 0.5rem;
  width: 60%;
  padding: 1.5rem 40px;
  flex-direction: column;
  margin-top: 30px;
  margin-left: 70px;
}
</style>