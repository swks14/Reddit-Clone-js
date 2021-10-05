import http from "../http-common";

class SubredditService {
    getSubredditByName(name) {
        return http.get(`/subreddits/${name}`)
    }

    postComment(name, id, content) {
        return http.post(`/subreddits/${name}/posts/${id}/comments`, {content: content}) //todo to do postservice'a
    }

    vote(name, id, voteValue) {
        return http.post(`/subreddits/${name}/posts/${id}/vote`, {voteValue: voteValue})
    }

    createSubreddit(name, description) {
        return http.post(`/subreddits`, {name: name, description: description})

    }
    joinSubreddit(name) {
        return http.post(`/subreddits/${name}/join`)
    }
    editSubredditDesc(name,description) {
        return http.put(`/subreddits/${name}`,{description:description})
    }
    deletePost(name,postId) {
        return http.delete(`/subreddits/${name}/posts/${postId}`)
    }
    getHomePage() {
        return http.get('/home/best')
    }

}


export default new SubredditService();