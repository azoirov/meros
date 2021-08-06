module.exports = async (req, res) => {
   res.render('reset-password', {
      title: 'Meros | Reset Password',
      path: '/reset-password'
   })
}