module.exports = async (req, res) => {
   let sub_categories = await req.db.sub_category.findAll({raw: true});
   let sub_sub_categories = await req.db.sub_sub_category.findAll({raw: true});

   res.render('login', {
      title: 'Meros | Login',
      path: '/login',
      user: req.user,
      categories: req.categories,
      lang: req.lang
   })
}