import axios from "axios";

export default axios.create({
    withCredentials: true,
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-type": "application/json"
    }
});
