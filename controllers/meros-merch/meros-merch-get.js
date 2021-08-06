module.exports = async (req, res) => {
   res.render('meros-merch', {
      title: 'Meros | Meros Merch',
      path: '/meros-merch',
      user: req.user,
      categories: req.categories
   })
}