const carouselModel = require('../models/carouselModel');

module.exports = {
    createCarousel: async (data) => {
        const carousel = new carouselModel(data);
        return await carousel.save();
    },

    getCarousels: async () => {
        return await carouselModel.find();
    },

    getCarouselById: async (id) => {
        return await carouselModel.findById(id);
    },

    updateCarousel: async (id, data) => {
        return await carouselModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    },

    deleteCarousel: async (id) => {
        return await carouselModel.findByIdAndDelete(id);
    }
};