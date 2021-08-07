
    let addToCartBtns = document.querySelectorAll('[data-add-cart]'),
    cartDiv = document.querySelectorAll(".product-card__cart")

    try {
    addToCartBtns.forEach(el => {
        el.addEventListener('click', async e => {
            const target = e.currentTarget

            let productCardCart

            if (target.classList.contains('to-cart')) {
                productCardCart = target.parentElement
            } else {
                productCardCart = target.parentElement.parentElement.parentElement.parentElement.nextElementSibling.children[1]
            }

            let response = await fetch('/cart/add', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'authorization': document.cookie.substring(6)
                },
                method: 'POST',
                body: JSON.stringify({
                    product_id: e.currentTarget.id
                })
            })

            response = await response.json()

            if (response.ok) {
                addToCartBtns.forEach(el => {
                    if (el.id === target.id) {
                        let parentElement = el.parentElement
                        parentElement.children[1].remove()
                        parentElement.innerHTML += `
                            <div class="product-card__cart" id="${el.id}">
                                 <button class="product-card__cart__btn product-card__cart__btn--increment">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M12 5V19" stroke="#8D909B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M5 12H19" stroke="#8D909B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                  </button>
                                  <span>1</span>
                                  <button class="product-card__cart__btn product-card__cart__btn--decrement">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M5 12H19" stroke="#8D909B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                  </button>
                           </div>
                        `
                    }
                })
                cartDiv = document.querySelectorAll('.product-cart__cart')
                addToCartBtns = document.querySelectorAll('[data-add-cart]')
            }

            if (!response.ok) {
                openToast('failed', 'Вы не вошли в систему. Пожалуйста, войдите сначала')
                closingToast()
            }
        })
    })
} catch (e) {
    console.log(e)
}

    try {
    cartDiv.forEach(cart => {
        let incrementBtn = cart.querySelector('.product-card__cart__btn--increment');
        let decrementBtn = cart.querySelector('.product-card__cart__btn--decrement');
        let id = cart.id
        incrementBtn.addEventListener("click", async e => {
            console.log(e.currentTarget)
            let response = await fetch("/cart/api/plus", {
                method: "PATCH",
                body: JSON.stringify({ product_id: id }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            response = await response.json();

            if (response.ok) {
                cartDiv.forEach(cart => {
                    if (cart.id === id) {
                        cart.querySelector('span').textContent = response.cart_incremented[0][0][0].count
                    }
                })
            }
        })

        decrementBtn.addEventListener("click", async e => {
            let response = await fetch("/cart/api/minus", {
                method: "PATCH",
                body: JSON.stringify({ product_id: id }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            response = await response.json();

            if (response.ok) {
                cartDiv.forEach(cart => {
                    if (cart.id === id) {
                        if (response.cart === 0) {
                            let parentElement = cart.parentElement
                            parentElement.children[1].remove()
                            parentElement.innerHTML += `
                                    <button class="to-cart" data-add-cart="" id="${id}">
                                       В корзину
                                    </button>
                                `
                        } else {
                            cart.querySelector('span').textContent = response.cart[0][0][0].count
                        }
                    }
                })
                cartDiv = document.querySelectorAll('.product-cart__cart')
                addToCartBtns = document.querySelectorAll('[data-add-cart]')
            }
        })
    })
} catch (e) {
    console.log(e)
}