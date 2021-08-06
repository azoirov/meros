module.exports = async (req, res) => {
   res.render('meros-diskont', {
      title: 'Meros | Meros Diskont',
      path: '/meros-diskont',
      user: req.user,
      categories: req.categories
   })
}