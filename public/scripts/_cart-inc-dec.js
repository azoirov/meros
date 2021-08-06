import addToCart from './_add-to-cart'

export default function () {
    try {
        let cartDiv = document.querySelectorAll(".product-card__cart");
        cartDiv.forEach(cart => {
            let incrementBtn = cart.querySelector('.product-card__cart__btn--increment');
            let decrementBtn = cart.querySelector('.product-card__cart__btn--decrement');
            let id = cart.id
            incrementBtn.addEventListener("click", async e => {
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
                    cartDiv = document.querySelectorAll(".product-card__cart");
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
                                addToCart()
                            } else {
                                cart.querySelector('span').textContent = response.cart[0][0][0].count
                            }
                        }
                    })
                }
            })
        })
    } catch (e) {
    }

}