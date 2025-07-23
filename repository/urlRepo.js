import Url from '../models/Url.js';

class UrlRepository {
    async findByOriginalUrl(originalUrl) {
        return Url.findOne({ originalUrl });
    }
    async findByShortCode(shortCode) {
        return Url.findOne({ shortCode });
    }
    async createUrl(data) {
        return Url.create(data);
    }
}

export default new UrlRepository();