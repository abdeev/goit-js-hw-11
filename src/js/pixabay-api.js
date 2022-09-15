'use strict';
import axios from 'axios';

export class PixabayApi {
    #API_KEY = '29947624-9d3c85b5a2e9a5d7d2ff2aa2b';
    #BASE_URL = `https://pixabay.com/api/`;
    
    constructor() {
        this.page = null;
        this.pageVolume = 12;
        this.inputedValue = '';
    }
    
    fetchPicsByInput() {
        const baseParams = {
            key: this.#API_KEY,
            q: this.inputedValue,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: this.page,
            per_page: this.pageVolume
        };
        return axios.get(`${this.#BASE_URL}`, {params: baseParams});
    }
    
}