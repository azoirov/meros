import { selectAll } from './_functions'
import { openToast, closingToast } from './_toast'
import cartIncDec from './_cart-inc-dec'

export default function () {
    try {
        const addToCartBtns = selectAll('[data-add-cart]')

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

                console.log(response)

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
                            cartIncDec()
                        }
                    })
                }

                if (!response.ok) {
                    openToast('failed', 'Вы не вошли в систему. Пожалуйста, войдите сначала')
                    closingToast()
                }
            })
        })
    } catch (e) {}
}