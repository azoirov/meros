import { selectOne, selectAll } from "./_functions"

export default function () {
    try {
        let headerCartIndicator = selectOne('.header-middle__link--cart-count'),
            bottomCartIndicator = selectOne('.bottom-nav__link--cart-count')

        function addToCart() {
            let addToCartBtns = selectAll('[data-add-cart]')
            addToCartBtns.forEach(el => {
                el.addEventListener('click', async e => {
                    const productId = e.currentTarget.getAttribute('data-add-cart')

                    let response = await fetch('/cart/add', {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'authorization': document.cookie.substring(6)
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            product_id: productId
                        })
                    })
                    response = await response.json()

                    if (response.ok) {
                        addToCartBtns.forEach(btn => {
                            if (btn.getAttribute('data-add-cart') === productId) {
                                const parentElement = btn.parentElement
                                parentElement.children[1].remove()
                                parentElement.innerHTML += `
                                <div class="product-card__cart" id="${el.id}">
                                    <button class="product-card__cart__btn product-card__cart__btn--increment" data-increment-product="${response.result.cart_added.product_id}">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M12 5V19" stroke="#8D909B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M5 12H19" stroke="#8D909B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                    </button>
                                    <span>1</span>
                                    <button class="product-card__cart__btn product-card__cart__btn--decrement" data-decrement-product="${response.result.cart_added.product_id}">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                           <path d="M5 12H19" stroke="#8D909B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                    </button>
                                </div>
                            `
                            }
                        })
                    }

                    increment()
                    decrement()
                })
            })
        }

        addToCart()

        function increment() {
            let productIncrementBtns = selectAll('[data-increment-product]')
            productIncrementBtns.forEach(el => {
                el.addEventListener('click', async e => {
                    const productId = e.currentTarget.getAttribute('data-increment-product')

                    let response = await fetch("/cart/api/plus", {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        method: "PATCH",
                        body: JSON.stringify({ product_id: productId })
                    })

                    response = await response.json()

                    console.log(response)

                    if (response.ok) {
                        productIncrementBtns.forEach(el => {
                            if (el.getAttribute('data-increment-product') === productId) {
                                el.nextElementSibling.textContent = response.cart_incremented.count
                            }
                        })
                        headerCartIndicator.textContent = response.user.productCountInCart + 1
                        bottomCartIndicator.textContent = response.user.productCountInCart + 1
                    }
                })
            })
        }

        increment()

        function decrement(a) {
            let productDecrementBtns = selectAll('[data-decrement-product]')
            productDecrementBtns.forEach(el => {
                el.addEventListener('click', async e => {
                    const productId = e.currentTarget.getAttribute('data-decrement-product')

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
                        productDecrementBtns.forEach(el => {
                            if (el.getAttribute('data-decrement-product') === productId) {
                                el.previousElementSibling.textContent = response.cart_decremented.count
                            }
                        })
                        headerCartIndicator.textContent = response.user.productCountInCart - 1
                        bottomCartIndicator.textContent = response.user.productCountInCart - 1
                    }

                    if (!response.ok) {
                        productDecrementBtns.forEach(el => {
                            if (el.getAttribute('data-decrement-product') === productId) {
                                let parentElement = el.parentElement.parentElement
                                parentElement.children[1].remove()
                                parentElement.innerHTML += `
                                <button class="to-cart" data-add-cart=${productId}>
                                    В корзину
                                </button>
                            `
                            }
                        })
                        headerCartIndicator.textContent = response.user.productCountInCart - 1
                        bottomCartIndicator.textContent = response.user.productCountInCart - 1
                        addToCart()
                    }
                })
            })
        }

        decrement()
    } catch (e) { }
}