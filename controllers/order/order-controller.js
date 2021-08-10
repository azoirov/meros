const { BOT_USERNAME } = require("../../config");

module.exports = class OrderController {
  static async SingleOrderController(req, res) {
    try {
      const {
        product_id,
        model_id,
        product_color_id,
        shipping_region,
        shipping_address,
        phone_number,
        full_name,
        is_shipped,
        is_payed,
        payment_method,
        count,
        description,
      } = req.body;

      let product = await req.db.products.findOne({
        where: {
          product_id,
        },
        raw: true,
      });

      if (!product.in_stock) throw new Error("Product is not in stock");

      if (!req.user) {
        throw new Error("Not authorized");
      }

      let order = await req.db.orders.create({
        user_id: req.user.id,
        shipping_region,
        shipping_address,
        phone_number,
        full_name,
        is_payed,
        is_shipped,
        payment_method,
        description,
      });

      order = await order.dataValues;

      let order_item = await req.db.order_details.create({
        product_id,
        count,
        model_id,
        product_color_id,
        order_id: order.order_id,
      });

      order_item = await order_item.dataValues;

      let model;
      if (model_id) {
        model = await req.db.models.findOne({
          where: {
            model_id,
          },
          raw: true,
        });
      }

      let price;

      let product_price = (product.price / 100) * product.sale;

      if (model) {
        price =
          count * model.difference === "plus"
            ? product_price + model.difference_price
            : product_price - model.difference_price;
      } else {
        price = count * product_price;
      }

      const link =
        order.payment_method === "card"
          ? `https://t.me/${BOT_USERNAME}?start=${order.order_id}`
          : "";

      res.status(201).json({
        ok: true,
        message: "Ordered",
        result: {
          order,
          order_item,
          price,
          link,
        },
      });
    } catch (e) {
      res.status(400).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async BulkOrderController(req, res) {
    try {
      const {
        shipping_region,
        shipping_address,
        phone_number,
        full_name,
        is_shipped,
        is_payed,
        payment_method,
        description,
      } = req.body;

      if (!req.user) {
        throw new Error("Not authorized");
      }

      let cart = await req.db.carts.findAll({
        where: {
          user_id: req.user.id,
        },
        raw: true,
      });

      for (let c of cart) {
        let product = await req.db.products.findOne({
          where: {
            product_id: c.product_id,
          },
          raw: true,
        });

        if (!product.in_stock) {
          cart.splice(cart.indexOf(c), 1);
        }
      }

      if (!cart) {
        throw new Error("user cart is empty");
      }

      let order = await req.db.orders.create({
        user_id: req.user.id,
        shipping_region,
        shipping_address,
        phone_number,
        full_name,
        is_payed,
        is_shipped,
        payment_method,
        description,
      });

      order = await order.dataValues;

      let total = 0;

      for (let c of cart) {
        let order_item = await req.db.order_details.create({
          product_id: c.product_id,
          count: c.count,
          product_color_id: c.product_color_id,
          order_id: order.order_id,
          model_id: c.model_id,
        });
        order_item = await order_item.dataValues;

        let product = await req.db.products.findOne({
          where: {
            product_id: c.product_id,
          },
          raw: true,
        });
        let model;
        if (c.model_id) {
          model = await req.db.models.findOne({
            where: {
              model_id: c.model_id,
            },
            raw: true,
          });
        }
        let price;

        let product_price = (product.price / 100) * product.sale;

        if (model) {
          price =
            c.count * model.difference === "plus"
              ? product_price + model.difference_price
              : product_price - model.difference_price;
        } else {
          price = c.count * product_price;
        }
        total += price;
      }

      if (cart.length === 0) {
        throw new Error("Nothing to order");
      }

      const link =
        order.payment_method === "card"
          ? `https://t.me/${BOT_USERNAME}?start=${order.order_id}`
          : "";

      await req.db.carts.destroy({
        where: {
          user_id: req.user.id,
        },
      });

      res.status(201).json({
        ok: true,
        message: "Ordered",
        result: {
          order,
          total,
          link,
        },
      });
    } catch (e) {
      res.status(400).json({
        ok: false,
        message: e + "",
      });
    }
  }
};
