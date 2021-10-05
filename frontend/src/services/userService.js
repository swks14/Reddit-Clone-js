import http from "../http-common";


class AuthService {
    login(email, password) {
        return http.post("/login", {
            email: email,
            password: password
        }).then(value => {
                localStorage.setItem("userNickname", value.data.nickname);
                window.location = "/";
            }
        )
    }
    changePassword(newPassword) {
        return http.put("/user/password", {newPassword:(newPassword)})
    }
    isLogged(){
        return http.get("/user/logged")
    }
}

export default new AuthService();