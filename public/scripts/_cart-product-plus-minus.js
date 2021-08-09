import {addClass, removeClass, selectAll, selectOne} from "./_functions";

export default function () {
    try {
        const cartProductRemoveBtns = selectAll('[data-cart-product-remove]'),
            cartProductCountIncrement = selectAll('[data-cart-product-plus]'),
            cartProductCountDecrement = selectAll('[data-cart-product-minus]'),
            cartProductWishlistButtons = selectAll('[data-cart-product-wishlist]'),
            headerCartIndicator = selectOne('.header-middle__link--cart-count'),
            bottomCartIndicator = selectOne('.bottom-nav__link--cart-count')

        cartProductRemoveBtns.forEach(el => {
            el.addEventListener('click', async e => {
                const product_id = e.currentTarget.getAttribute('data-cart-product-remove')
                let response = await fetch('/cart', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'DELETE',
                    body: JSON.stringify({
                        product_id
                    })
                })
                response = await response.json()

                if (response.ok) {
                    window.location.reload()
                }
            })
        })

        cartProductCountIncrement.forEach(el => {
            el.addEventListener('click', async e => {
                const productId = e.currentTarget.getAttribute('data-cart-product-plus')

                let response = await fetch("/cart/api/plus", {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "PATCH",
                    body: JSON.stringify({ product_id: productId })
                })

                response = await response.json()

                if (response.ok) {
                    el.previousElementSibling.textContent = response.cart_incremented.count
                    headerCartIndicator.textContent = response.user.productCountInCart + 1
                    bottomCartIndicator.textContent = response.user.productCountInCart + 1
                }
            })
        })

        cartProductCountDecrement.forEach(el => {
            el.addEventListener('click', async e => {
                const productId = e.currentTarget.getAttribute('data-cart-product-minus')

                let response = await fetch("/cart/api/minus", {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "PATCH",
                    body: JSON.stringify({ product_id: productId })
                })

                response = await response.json()
                console.log(response)

                if (response.ok) {
                    if(response.cart_decremented === 0) {
                        window.location.reload()
                    } else {
                        el.nextElementSibling.textContent = response.cart_decremented.count
                    }
                    if(response.user.productCountInCart >= 0) {
                        headerCartIndicator.textContent = response.user.productCountInCart - 1
                        bottomCartIndicator.textContent = response.user.productCountInCart - 1
                    } else {
                        headerCartIndicator.textContent = 0
                        bottomCartIndicator.textContent = 0
                    }
                }

            })
        })

        cartProductWishlistButtons.forEach(el => {
            el.addEventListener('click', async e => {
                const target = e.currentTarget
                const productId = target.getAttribute('data-cart-product-wishlist')
                if (target.classList.contains('cart-product-in-wishlist')) {
                    let response = await fetch('/wishlist', {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'DELETE',
                        body: JSON.stringify({
                            product_id: productId
                        })
                    })
                    response = await response.json()

                    if (response.ok) {
                        el.classList.add('d-none')
                        el.previousElementSibling.classList.remove('d-none')
                    }
                } else {
                    let response = await fetch('/wishlist', {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            product_id: productId
                        })
                    })
                    response = await response.json()

                    if (response.ok) {
                        el.classList.add('d-none')
                        el.nextElementSibling.classList.remove('d-none')
                    }
                }
            })
        })
    } catch (e) {

    }
}