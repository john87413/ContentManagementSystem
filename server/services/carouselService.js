class CarouselService {
    constructor(carouselModel) {
      this.carouselModel = carouselModel;
    }
    async createCarousel(data) {
      const carousel = new this.carouselModel(data);
      return await carousel.save();
    }
  
    async getCarouselsWithPagination(options, query) {
      const [carousels, total] = await Promise.all([
        this.carouselModel.find(query).setOptions(options),
        this.carouselModel.countDocuments(query)
      ]);
  
      return { carousels, total };
    }
  
    async getAllCarousels() {
      return await this.carouselModel.find();
    }
  
    async getCarouselById(id) {
      return await this.carouselModel.findById(id);
    }
  
    async updateCarousel(id, data, options = {}) {
      return await this.carouselModel.findByIdAndUpdate(id, data, { new: true, ...options });
    }
  
    async deleteCarousel(id) {
      const carousel = await this.carouselModel.findById(id);
      if (carousel) {
        await carousel.deleteOne();
      }
      return carousel;
    }
  }
  
  const carouselModel = require("../models/carouselModel");
  module.exports = new CarouselService(carouselModel);
  