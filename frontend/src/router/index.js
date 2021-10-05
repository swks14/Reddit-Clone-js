import {createWebHistory, createRouter} from "vue-router";
import Login from "@/components/Login.vue";
import Register from "@/components/Register";
import Subreddit from "@/components/Subreddit";
import Post from "@/components/Post";
import CreatePost from "@/components/CreatePost";
import CreateSubreddit from "@/components/CreateSubreddit";
import ChangePassword from "@/components/ChangePassword";
import EditSub from "@/components/EditSub";
import Home from "@/components/Home";
import SearchResult from "@/components/SearchResult";


const routes = [{
    path: "/login",
    name: "login",
    component: Login
},
    {
        path: "/register",
        name: "register",
        component: Register
    },
    {
        path: '/r/:subreddit',
        name: 'Subreddit',
        component: Subreddit,

    },
    {
        path: '/r/:subreddit/posts/:id/comments',
        name: 'Post',
        component: Post,
    },
    {
        path: '/r/:subreddit/createPost',
        name: 'CreatePost',
        component: CreatePost,
    },
    {
        path: '/createSubreddit',
        name: 'CreateSubreddit',
        component: CreateSubreddit,
    },
    {
        path: '/settings/password',
        name: 'ChangePassword',
        component: ChangePassword,
    },
    {
        path: '/r/:subreddit/editDesc',
        name: 'EditSub',
        component: EditSub,
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
    },
    {
        path: '/search',
        name: 'SearchResult',
        component: SearchResult,
    },

];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;