const moment = require("moment")

const cabinetGet = async (req, res) => {
   res.render('cabinet/cabinet', {
      title: 'Meros | Personal Cabinet',
      path: '/cabinet',
      user: req.user,
      categories: req.categories,
      lang: req.lang
   })
}

const cabinetEditGet = async (req, res) => {
   res.render('cabinet/edit', {
      title: 'Meros | Personal Cabinet Edit',
      path: '/cabinet/edit',
      user: req.user,
      categories: req.categories,
      lang: req.lang
   })
}
const savedCardsGet = async (req, res) => {
   res.render('cabinet/saved-cards', {
      title: 'Meros | Saved Cards',
      path: '/cabinet/saved-cards',
      user: req.user,
      categories: req.categories,
      lang: req.lang
   })
}

const ordersGet = async (req, res) => {

   let orders = await req.db.orders.findAll({
      raw: true,
      where: {
         user_id: req.user.id,
      },
      order: [["createdAt", "DESC"]]
   });

   for (let order of orders) {
      let time = moment(order.createdAt).locale("ru").format("LL")
      let order_items = await req.db.order_details.findAll({
         where: {
            order_id: order.order_id,
         },
         include: {
            model: req.db.products,
         },
         raw: true,
      });
      order.items = order_items;
      order_items.forEach(item => {
         item.time = time
         item.type = order.payment_method
         item.region = order.shipping_region
         item.address = order.shipping_address
         item.comment = order.description
      })
   }

   res.render('cabinet/orders', {
      title: 'Meros | Orders',
      path: '/cabinet/orders',
      user: req.user,
      categories: req.categories,
      orders,
      lang: req.lang
   })
}

const boughtProductsGet = async (req, res) => {
   res.render('cabinet/bought-products', {
      title: 'Meros | Orders',
      path: '/cabinet/bought-products',
      user: req.user,
      categories: req.categories,
      lang: req.lang
   })
}

const regularDeliveriesGet = async (req, res) => {
   res.render('cabinet/regular-deliveries', {
      title: 'Meros | Regular Deliveries',
      path: '/cabinet/regular-deliveries',
      user: req.user,
      categories: req.categories,
      lang: req.lang
   })
}
const notificationSettingsGet = async (req, res) => {
   res.render('cabinet/notification-settings', {
      title: 'Meros | Notification Settings',
      path: '/cabinet/notification-settings',
      user: req.user,
      categories: req.categories,
      lang: req.lang
   })
}

const myDetailsGet = async (req, res) => {
   res.render('cabinet/my-details', {
      title: 'Meros | My Details',
      path: '/cabinet/my-details',
      user: req.user,
      lang: req.lang,
      categories: req.categories,
      lang: req.lang
   })
}

module.exports = { cabinetGet, cabinetEditGet, savedCardsGet,
   ordersGet, boughtProductsGet, regularDeliveriesGet, notificationSettingsGet, myDetailsGet }