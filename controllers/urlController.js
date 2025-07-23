import urlService from '../services/urlService.js';

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
        const url = await urlService.shortenUrl(originalUrl, req.user?._id);
        res.json({ shortUrl: `${process.env.BASE_URL}/${url.shortCode}` });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const redirect = async (req, res) => {
    const { code } = req.params;
    const url = await urlService.getOriginalUrl(code);
    if (!url) return res.status(404).json({ message: 'URL not found' });
    res.redirect(url.originalUrl);
};