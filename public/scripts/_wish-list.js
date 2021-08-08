import {closingToast, openToast} from './_toast'
import {selectAll} from './_functions'

export default function () {
    try {
        let wishListButtons = selectAll("[data-wishlist-btn]")

        wishListButtons.forEach(el => {
            el.addEventListener('click', async e => {
                const target = e.currentTarget
                const product_id = target.getAttribute('data-wishlist-btn')

                if (target.classList.contains('in-wish-list')) {
                    let response = await fetch('/wishlist', {
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
                        wishListButtons.forEach(el => {
                            if (el.getAttribute('data-wishlist-btn') === product_id) {
                                if (el.classList.contains('product-card__favourite')) {
                                    el.querySelector('img').src = '/images/icons/favourites-passive.svg'
                                    el.classList.remove('in-wish-list')
                                }
                                el.classList.remove('in-wish-list')
                            }
                        })
                        openToast("failed", "Товар удален из избранного")
                        closingToast()
                    }
                } else {
                    let response = await fetch('/wishlist', {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            product_id
                        })
                    })

                    response = await response.json()

                    if (response.ok) {
                        wishListButtons.forEach(el => {
                            if (el.getAttribute('data-wishlist-btn') === product_id) {
                                if (el.classList.contains('product-card__favourite')) {
                                    el.querySelector('img').src = '/images/icons/favourites-active.svg'
                                    el.classList.add('in-wish-list')
                                }
                                el.classList.add('in-wish-list')
                            }
                        })
                        openToast("success", "Товар добавлен в избранное")
                        closingToast()
                    }

                    if (!response.ok) {
                        openToast('failed', 'Вы не вошли в систему. Пожалуйста, войдите сначала')
                        closingToast()
                    }
                }
            })
        })
    } catch (e) {
        console.log(e)
    }
}