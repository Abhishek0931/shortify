import urlRepo from '../repository/urlRepo.js';

function generateShortCode(length = 6) {
    return Math.random().toString(36).substring(2, 2 + length);
}

class UrlService {
    async shortenUrl(originalUrl, userId) {
        let url = await urlRepo.findByOriginalUrl(originalUrl);
        if (url) return url;

        let shortCode;
        // Ensure unique shortCode
        do {
            shortCode = generateShortCode();
        } while (await urlRepo.findByShortCode(shortCode));

        url = await urlRepo.createUrl({ originalUrl, shortCode, createdBy: userId });
        return url;
    }

    async getOriginalUrl(shortCode) {
        return urlRepo.findByShortCode(shortCode);
    }
}

export default new UrlService();