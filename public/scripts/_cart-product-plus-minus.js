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
                    el.nextElementSibling.textContent = response.cart_decremented.count
                    headerCartIndicator.textContent = response.user.productCountInCart + 1
                    bottomCartIndicator.textContent = response.user.productCountInCart + 1
                }

                if (!response.ok) {
                    window.location.reload()
                }
            })
        })
    } catch (e) {

    }
}