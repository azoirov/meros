const inCart = async (db, products, user_id) => {
    let cart = await db.carts.findAll({
        where: {
            user_id
        },
        raw: true
    });

    let wishLists = await db.wishlists.findAll({
        where: {
            user_id
        },
        raw: true
    })

    products = products.map(product => {
        let c = cart.filter(el => el.product_id === product.product_id);
        let w = wishLists.filter(el => el.product_id === product.product_id);
        product.inWishList = w.length>0 ? true : false
        let count = c.length>0 ? c[0].count : 0;
        product.inCart = count > 0 ? count : false;
        return product
    });

    return products
};

const howManyStar = async (db, products) => {
    let comments = await db.comments.findAll({
        raw: true
    });

    products = products.map(product => {
        let c = comments.filter(comment => comment.product_id === product.product_id);
        let stars = 0;
        for(let i of c) {
            stars += c.star;
        };
        stars = c.length ? stars / c.length : 0;
        product.stars = Math.round(stars);
        return product
    });

    return products
};

module.exports = {
    inCart,
    howManyStar
}
