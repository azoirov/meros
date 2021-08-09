import singleProductAddCart from "./_single-product-cart-add"
import {selectOne} from "./_functions";

export default function () {
    let headerCartIndicator = selectOne('.header-middle__link--cart-count'),
        bottomCartIndicator = selectOne('.bottom-nav__link--cart-count')

    try {
        let incBtn = document.querySelector(".single_inc_cart");
        let decBtn = document.querySelector('.single_dec_cart');
        let btnGroup = document.querySelector(".product-count");
        let addBtn = document.querySelector(".single_add_to_cart");
        decBtn.addEventListener("click", async e => {
            let response = await fetch("/cart/api/minus", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PATCH",
                body: JSON.stringify({
                    product_id: decBtn.id
                })
            });

            response = await response.json();
            if(response.ok) {
                if(response.cart_decremented === 0) {
                    btnGroup.classList.add("d-none");
                    addBtn.classList.remove('d-none')
                } else {
                    btnGroup.querySelector("span").textContent = response.cart_decremented.count
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
        incBtn.addEventListener("click", async e => {
            let response = await fetch("/cart/api/plus", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PATCH",
                body: JSON.stringify({
                    product_id: incBtn.id
                })
            });

            response = await response.json();
            console.log(response)
            if(response.ok) {
                btnGroup.querySelector("span").textContent = response.cart_incremented.count;
                headerCartIndicator.textContent = response.user.productCountInCart + 1
                bottomCartIndicator.textContent = response.user.productCountInCart + 1
            }
        })
    } catch(e) {}
}