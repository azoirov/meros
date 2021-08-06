const cabinetGet = async (req, res) => {
   res.render('cabinet/cabinet', {
      title: 'Meros | Personal Cabinet',
      path: '/cabinet',
      user: req.user,
      categories: req.categories
   })
}

const cabinetEditGet = async (req, res) => {
   res.render('cabinet/edit', {
      title: 'Meros | Personal Cabinet Edit',
      path: '/cabinet/edit',
      user: req.user,
      categories: req.categories
   })
}
const savedCardsGet = async (req, res) => {
   res.render('cabinet/saved-cards', {
      title: 'Meros | Saved Cards',
      path: '/cabinet/saved-cards',
      user: req.user,
      categories: req.categories
   })
}

const ordersGet = async (req, res) => {
   res.render('cabinet/orders', {
      title: 'Meros | Orders',
      path: '/cabinet/orders',
      user: req.user,
      categories: req.categories
   })
}

const boughtProductsGet = async (req, res) => {
   res.render('cabinet/bought-products', {
      title: 'Meros | Orders',
      path: '/cabinet/bought-products',
      user: req.user,
      categories: req.categories
   })
}

const regularDeliveriesGet = async (req, res) => {
   res.render('cabinet/regular-deliveries', {
      title: 'Meros | Regular Deliveries',
      path: '/cabinet/regular-deliveries',
      user: req.user,
      categories: req.categories
   })
}
const notificationSettingsGet = async (req, res) => {
   res.render('cabinet/notification-settings', {
      title: 'Meros | Notification Settings',
      path: '/cabinet/notification-settings',
      user: req.user,
      categories: req.categories
   })
}

const myDetailsGet = async (req, res) => {
   res.render('cabinet/my-details', {
      title: 'Meros | My Details',
      path: '/cabinet/my-details',
      user: req.user,
      categories: req.categories
   })
}

module.exports = { cabinetGet, cabinetEditGet, savedCardsGet,
   ordersGet, boughtProductsGet, regularDeliveriesGet, notificationSettingsGet, myDetailsGet }