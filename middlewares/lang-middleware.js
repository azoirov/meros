const fs = require('fs/promises')

module.exports = async (req, res, next) => {
    let lang = req.cookies.lang
    
    req.lang = lang

    let data = await fs.readFile(path.join(__dirname, "..", "data.json"), { encoding: "utf-8" });
    data = await JSON.parse(data)

    req.data = data[`${lang}`]

    next()
}