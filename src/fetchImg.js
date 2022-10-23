import axios from "axios";


const base_url = 'https://pixabay.com/api/';
const KEY = '30710518-a576e6666e1a547e2e14daa9e';
const options = {
    headers: {
        Authorization: KEY,
    },
};

export default class FetchImg {
    constructor() {
        this.searchInput = '';
        this.page = 1;
        this.currentHits = 0;
    };

    async fetchImg() {
        const params = new URLSearchParams({
            key: KEY,
            q: this.searchImg,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: 40,
        });
        
        const response = await axios.get(`${base_url}?${params}`);
        const { data } = response;
        
        this.currentHits += data.hits.length;
        this.page += 1;

        return data;
    }

    incrementPage() {
        this.page += 1;
    };

    resetPage() {
        this.page = 1;
    };

    resetCurrentHits() {
        this.currentHits = 0;
    };

    get inputTitle() {
        return this.searchImg;
    };

    set inputTitle(newTitle) {
        this.searchImg = newTitle;
    };

}