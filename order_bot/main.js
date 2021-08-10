const TelegramBot = require("node-telegram-bot-api");
const { TOKEN, PAYMENT_TOKEN } = require("../config");

async function init(psql) {
  const bot = new TelegramBot(TOKEN, {
    polling: true,
  });

  let orders_id;

  bot.on("message", async (message) => {
    const text = message.text;
    const chatId = message.from.id;
    const messageId = message.message;

    try {
      if (text) {
        if (text.startsWith("/start")) {
          let order_id = text.split("/start ")[1];
          orders_id = order_id;
          if (order_id) {
            let order = await psql.orders.findOne({
              where: {
                order_id,
              },
              raw: true,
            });

            if (!order || order.is_payed == true) {
              throw new Error("error");
            }

            let order_items = await psql.order_details.findAll({
              where: {
                order_id: order.order_id,
              },
              include: {
                model: psql.products,
              },
              raw: true,
            });

            let prices = [];
            let total = 0;
            for (let c of order_items) {
              let product = await psql.products.findOne({
                where: {
                  product_id: c.product_id,
                },
                raw: true,
              });
              let model;
              if (c.model_id) {
                model = await psql.models.findOne({
                  where: {
                    model_id: c.model_id,
                  },
                  raw: true,
                });
              }
              let price;

              let product_price = (product.price * (100 - product.sale)) / 100;

              if (model) {
                price =
                  c.count * model.difference === "plus"
                    ? product_price + model.difference_price
                    : product_price - model.difference_price;
              } else {
                price = c.count * product_price;
              }
              prices.push({
                label: c["product.uz_name"],
                amount: price * 100,
              });
              total += price;
            }

            await bot.sendInvoice(
              chatId,
              `Meros internet do'konidan hisob`,
              "Mahsulotlar",
              "1234567",
              PAYMENT_TOKEN,
              "TEST",
              "UZS",
              prices,
              {
                photo_url: "https://picsum.photos/300",
              }
            );
          }
        }
      }
    } catch (e) {
      await bot.sendMessage(
        chatId,
        "<b>Bunday buyurtma topilmadi\n\nТакой заказ не найден\n\nOrder not found</b>",
        {
          parse_mode: "HTML",
        }
      );
    }
  });

  bot.on("pre_checkout_query", (checkout) => {
    bot.answerPreCheckoutQuery(checkout.id, true);
  });

  bot.on("successful_payment", async (checkout) => {
    let order = await psql.orders.update(
      {
        is_payed: true,
      },
      {
        where: {
          order_id: orders_id,
        },
        returning: true,
        raw: true,
      }
    );

    await bot.sendMessage(
      checkout.from.id,
      "To'lov qabul qilindi, Operatorlarimiz tez orada siz bilan boglanishadi"
    );
  });
}

module.exports = init;
