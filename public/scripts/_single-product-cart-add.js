import { openToast, closingToast } from './_toast'
import singleProductCart from './_single-product-cart';
import {selectOne} from "./_functions";

export default function () {
    let headerCartIndicator = selectOne('.header-middle__link--cart-count'),
        bottomCartIndicator = selectOne('.bottom-nav__link--cart-count')
    try {
        let addBtn = document.querySelector(".single_add_to_cart");
        let btnGroup = document.querySelector(".product-count");
        addBtn.addEventListener("click", async e => {
            let response  = await fetch("/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    product_id: e.currentTarget.id
                })
            });
            response = await response.json();
            console.log(response)
            if (!response.ok) {
                openToast('failed', 'Вы не вошли в систему. Пожалуйста, войдите сначала')
                closingToast()
            } else {
                addBtn.classList.add('d-none')
                btnGroup.querySelector("span").textContent = 1;
                btnGroup.classList.remove("d-none")
                headerCartIndicator.textContent = response.result.user.productCountInCart + 1
                bottomCartIndicator.textContent = response.result.user.productCountInCart + 1
            }
        })
    } catch(e) {}
}