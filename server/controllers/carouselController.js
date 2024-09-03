const carouselService = require('../services/carouselService');

const carouselController = {
    async createCarousel(req, res) {
        try {
            const Carousel = await carouselService.createCarousel(req.body);
            res.status(201).json(Carousel);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getCarousels(req, res) {
        try {
            const carousels = await carouselService.getCarousels();
            res.json(carousels);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getCarouselById(req, res) {
        try {
            const Carousel = await carouselService.getCarouselById(req.params.id);
            if (!Carousel) {
                return res.status(404).json({ message: 'Carousel not found' });
            }
            res.json(Carousel);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateCarousel(req, res) {
        try {
            const Carousel = await carouselService.updateCarousel(req.params.id, req.body);
            if (!Carousel) {
                return res.status(404).json({ message: 'Carousel not found' });
            }
            res.json(Carousel);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteCarousel(req, res) {
        try {
            const result = await carouselService.deleteCarousel(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Carousel not found' });
            }
            res.json({ message: 'Carousel deleted' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = carouselController;
