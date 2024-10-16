class CarouselController {
    constructor(carouselService) {
      this.carouselService = carouselService;
    }
  
    createCarousel = async (req, res, next) => {
      try {
        const carousel = await this.carouselService.createCarousel(req.body);
        res.status(201).json(carousel);
      } catch (error) {
        next(error);
      }
    }
  
    getCarousels = async (req, res, next) => {
      try {
        const { page, limit, nameQuery = "" } = req.query;
        if (page && limit) {
          const options = {
            skip: (parseInt(page) - 1) * parseInt(limit),
            limit: parseInt(limit),
          };
          const query = nameQuery ? { name: new RegExp(nameQuery, 'i') } : {};
          const paginatedCarousels = await this.carouselService.getCarouselsWithPagination(options, query);
          res.json(paginatedCarousels);
        } else {
          const carousels = await this.carouselService.getAllCarousels();
          res.json(carousels);
        }
      } catch (error) {
        next(error);
      }
    }
  
    getCarouselById = async (req, res, next) => {
      try {
        const carousel = await this.carouselService.getCarouselById(req.params.id);
        if (!carousel) {
          return res.status(404).json({ message: "Carousel not found" });
        }
        res.json(carousel);
      } catch (error) {
        next(error);
      }
    }
  
    updateCarousel = async (req, res, next) => {
      try {
        const carousel = await this.carouselService.updateCarousel(
          req.params.id,
          req.body,
          { new: true, runValidators: true }
        );
        if (!carousel) {
          return res.status(404).json({ message: "Carousel not found" });
        }
        res.json(carousel);
      } catch (error) {
        next(error);
      }
    }
  
    deleteCarousel = async (req, res, next) => {
      try {
        const result = await this.carouselService.deleteCarousel(req.params.id);
        if (!result) {
          return res.status(404).json({ message: "Carousel not found" });
        }
        res.json({ message: "Carousel deleted" });
      } catch (error) {
        next(error);
      }
    }
  }
  
  const carouselService = require("../services/carouselService");
  module.exports = new CarouselController(carouselService);
  