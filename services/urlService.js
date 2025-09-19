
import urlRepo from '../repository/urlRepo.js';

function generateShortCode(length = 6) {
    return Math.random().toString(36).substring(2, 2 + length);
}

class UrlService {
    async shortenUrl(originalUrl, userId) {
        let url = await urlRepo.findByOriginalUrlAndUser(originalUrl, userId);
        if (url) return url;

        let shortCode;
        // Ensure unique shortCode for this user
        do {
            shortCode = generateShortCode();
        } while (await urlRepo.findByShortCodeAndUser(shortCode, userId));

        url = await urlRepo.createUrlForUser(originalUrl, shortCode, userId);
        return url;
    }

    async getOriginalUrl(shortCode, userId) {
        return urlRepo.findByShortCodeAndUser(shortCode, userId);
    }

    async getUserUrls(userId) {
        return urlRepo.getUserUrls(userId);
    }
}

export default new UrlService();