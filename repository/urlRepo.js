import Url from '../models/Url.js';


class UrlRepository {
    async findByOriginalUrlAndUser(originalUrl, userId) {
        return Url.findOne({ originalUrl, createdBy: userId });
    }
    async findByShortCodeAndUser(shortCode, userId) {
        return Url.findOne({ shortCode, createdBy: userId });
    }
    async createUrlForUser(originalUrl, shortCode, userId) {
        return Url.create({ originalUrl, shortCode, createdBy: userId });
    }
    async getUserUrls(userId) {
        return Url.find({ createdBy: userId });
    }
    async findByShortCode(shortCode) {
        return Url.findOne({ shortCode });
    }
}

export default new UrlRepository();