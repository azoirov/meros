module.exports = async (req, res, next) => {
   let sub_categories = await req.db.sub_category.findAll({raw: true}),
       sub_sub_categories = await req.db.sub_sub_category.findAll({raw: true});

   sub_categories = sub_categories.map(el => {
      el.sub_sub_categories = sub_sub_categories.filter(c => c.sub_category_id === el.sub_category_id)
      return el
   })

   let brands = await req.db.brands.findAll({raw: true}),
       categories = await req.db.categories.findAll()

   categories = categories.map(el => el.dataValues)

   categories = categories.map(el => {
      let b = brands.filter(brand => brand.category_id === el.category_id);
      let s = sub_categories.filter(cat => cat.category_id === el.category_id)
      el.brands = b;
      el.sub_categories = s;
      return el
   })

   req.categories = categories

   next()
}