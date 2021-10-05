import http from "../http-common";

class PostService {
    getCommentsFromPostById(name, id) {
        return http.get(`/subreddits/${name}/posts/${id}/comments`)
    }

    postComment(name, id, content) {
        console.log(content);
        return http.post(`/subreddits/${name}/posts/${id}/comments`, {content: content})
    }

    uploadPhoto(content) {
        console.log(content);
        return fetch("http://localhost:5000/api/uploadImage", {
            method: "POST",
            body: content,
        })
            .then(() => {
                console.log("File Sent Successful");
            })
            .catch((err) => {
                console.log(err.message)
            });
    }

    createPost(name, title, content, image_path, video_url,) {
        return http.post(`/posts/${name}`, {
            title: title,
            content: content,
            image_path: image_path,
            video_url: video_url
        });
    }
    deleteComment(name,postId,commentId){
        return http.delete(`/subreddits/${name}/posts/${postId}/comments/${commentId}`)

    }
}

export default new PostService();