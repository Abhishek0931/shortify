

import urlService from '../services/urlService.js';
import urlRepo from '../repository/urlRepo.js';

export const shorten = async (req, res) => {
    let { originalUrl } = req.body;
    if (!originalUrl) return res.status(400).json({ message: 'URL is required' });

    // trim whitespace
    originalUrl = originalUrl.trim();

    // Ensure protocol is present
    if (!/^https?:\/\//i.test(originalUrl)) {
        originalUrl = 'https://' + originalUrl;
    }

    try {
        const url = await urlService.shortenUrl(originalUrl, req.user._id);
        res.json({ shortUrl: `${process.env.BASE_URL}/${url.shortCode}` });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserUrls = async (req, res) => {
    try {
        const urls = await urlService.getUserUrls(req.user._id);
        res.json(urls);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Public redirect: lookup by shortCode only
export const redirect = async (req, res) => {
    const { code } = req.params;
    try {
        const url = await urlRepo.findByShortCode(code);
        if (!url) return res.status(404).json({ message: 'URL not found' });
        res.redirect(url.originalUrl);
    } catch (err) {
        console.error('Redirect error:',err);
        res.status(500).json({ message: 'Server error' });
    }
};