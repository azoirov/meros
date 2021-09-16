module.exports = async (req, res, next) => {
    let lang = req.cookies.lang
    
    req.lang = lang

    next()
}