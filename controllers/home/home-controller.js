const { Op } = require("sequelize");
const { verifyToken } = require("../../modules/jwt");
const path = require("path");
const fs = require("fs/promises");
const { howManyStar, inCart } = require("../../modules/product");

module.exports = class HomeController {
  static async HomeGet(req, res) {
    try {
      const { products, carts, wishlists, sessions, users, sponsors } = req.db;

      let wishlist = [];
      let cart = [];

      let banners = await fs.readFile(
        path.join(__dirname, "..", "..", "banners.json"),
        { encoding: "utf-8" }
      );

      banners = await JSON.parse(banners);
      let brands = await req.db.brands.findAll({ raw: true });

      let recomendations = await req.db.recomendations.findAll({
        raw: true,
        include: {
          model: req.db.products,
          include: req.db.categories,
        },
      });

      let bestseller = await req.db.bestsellers.findAll({
        raw: true,
        include: {
          model: req.db.products,
          include: req.db.categories,
        },
      });

      let rec = [...recomendations, ...bestseller];
      let arr = [];
      rec.forEach((el) => {
        if (!arr.includes(el)) {
          arr.push(el);
        }
      });
      rec = arr;
      rec = await howManyStar(req.db, rec);

      let goodOffers = await req.db.products.findAll({
        where: {
          sale: {
            [Op.gte]: 0,
          },
        },
        include: [
          {
            model: req.db.categories,
          },
          {
            model: req.db.sub_category,
          },
        ],
        raw: true,
      });

      let sale = [];
      while (sale.length < 8 && goodOffers.length > 0) {
        let i = Math.random() * goodOffers.length - 1;
        let item = goodOffers.pop(goodOffers[i]);
        console.log(item);
        sale.push(item);
      }

      let bestsellers = [];
      while (bestsellers.length < 8 && bestseller.length > 0) {
        let i = Math.random() * goodOffers.length - 1;
        let item = bestseller.pop(bestseller[i]);
        bestsellers.push(item);
      }

      sale = await howManyStar(req.db, sale);
      bestsellers = await howManyStar(req.db, bestsellers);

      if (req.user) {
        sale = await inCart(req.db, sale, req.user.id);
        rec = await inCart(req.db, rec, req.user.id);
        bestsellers = await inCart(req.db, bestsellers, req.user.id);
      }

      res.render("index", {
        title: "Meros | Home",
        categories: req.categories,
        banners: banners,
        brands: brands,
        user: req.user,
        recommendation: rec,
        bestsellers,
        sale,
        lang: req.lang,
        data: req.data
      });
    } catch(e) {
      res.render("404")
    }
  }

  static async getCategories (req,res) {
    try {
      res.status(200).json({
        ok:true,
        categories: req.categories,
      })
    } catch (error) {
      res.status(400).json({
        ok:false,
        message:error + ""
      })
    }
  }

  static async getBanners (req,res) {
    try {
      let banners = await fs.readFile(
        path.join(__dirname, "..", "..", "banners.json"),
        { encoding: "utf-8" }
      );

      banners = await JSON.parse(banners);
      res.status(200).json({
        ok:true,
        banners: banners,
      })
    } catch (error) {
      res.status(400).json({
        ok:false,
        message:error + ""
      })
    }
  }

  static async getUsers (req,res) {
    try {
      res.status(200).json({
        ok:true,
        user: req.user,
      })
    } catch (error) {
      res.status(400).json({
        ok:false,
        message:error + ""
      })
    }
  }


  static async getSale (req,res) {
    try {

      let goodOffers = await req.db.products.findAll({
        where: {
          sale: {
            [Op.gte]: 0,
          },
        },
        include: [
          {
            model: req.db.categories,
          },
          {
            model: req.db.sub_category,
          },
        ],
        raw: true,
      });

      let sale = [];
      while (sale.length < 8 && goodOffers.length > 0) {
        let i = Math.random() * goodOffers.length - 1;
        let item = goodOffers.pop(goodOffers[i]);
        sale.push(item);
      }
      sale = await howManyStar(req.db, sale);
      if (req.user) {
        sale = await inCart(req.db, sale, req.user.id);
      }
      res.status(200).json({
        ok:true,
        sale,
      })
    } catch (error) {
      res.status(400).json({
        ok:false,
        message:error + ""
      })
    }
  }

  static async getbestsellers (req,res) {
    try {
      let bestseller = await req.db.bestsellers.findAll({
        raw: true,
        include: {
          model: req.db.products,
          include: req.db.categories,
        },
      });

      let goodOffers = await req.db.products.findAll({
        where: {
          sale: {
            [Op.gte]: 0,
          },
        },
        include: [
          {
            model: req.db.categories,
          },
          {
            model: req.db.sub_category,
          },
        ],
        raw: true,
      });

      let bestsellers = [];
      while (bestsellers.length < 8 && bestseller.length > 0) {
        let i = Math.random() * goodOffers.length - 1;
        let item = bestseller.pop(bestseller[i]);
        bestsellers.push(item);
      }

      res.status(200).json({
        ok:true,
        bestsellers,
      })
    } catch (error) {
      res.status(400).json({
        ok:false,
        message:error + ""
      })
    }
  }

  static async getRec (req,res) {
    try {

      let recomendations = await req.db.recomendations.findAll({
        raw: true,
        include: {
          model: req.db.products,
          include: req.db.categories,
        },
      });

      let bestseller = await req.db.bestsellers.findAll({
        raw: true,
        include: {
          model: req.db.products,
          include: req.db.categories,
        },
      });

      let rec = [...recomendations, ...bestseller];
      let arr = [];
      rec.forEach((el) => {
        if (!arr.includes(el)) {
          arr.push(el);
        }
      });
      rec = arr;
      rec = await howManyStar(req.db, rec);

      res.status(200).json({
        ok:true,
        recommendation: rec,
      })
    } catch (error) {
      res.status(400).json({
        ok:false,
        message:error + ""
      })
    }
  }
  
};
