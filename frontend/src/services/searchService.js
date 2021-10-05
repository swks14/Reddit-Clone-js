import http from "../http-common";

class SearchService {
    search(query) {
        return http.get(`/search`,  {params: {query: query}})

    }

}

export default new SearchService();