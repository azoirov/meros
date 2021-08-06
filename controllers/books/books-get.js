module.exports = async (req, res) => {
   res.render('books', {
      title: 'Meros | Books',
      path: '/books',
      user: req.user
   })
}