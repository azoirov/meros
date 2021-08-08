import { openToast, closingToast } from './_toast'
import singleProductCart from './_single-product-cart';

export default function () {
    console.log(true)
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

            if (!response.ok) {
                openToast('failed', 'Вы не вошли в систему. Пожалуйста, войдите сначала')
                closingToast()
            } else {
                addBtn.remove();
                btnGroup = document.querySelector(".product-count");
                btnGroup.innerHTML = `
                  <h4>Количество:</h4>
                  <div class="product-count__change">
                      <button id="${addBtn.id}" class="single_dec_cart">
                        <img src="/images/icons/minus.svg" alt="" />
                      </button>
                      <span>1</span>
                      <button id="${addBtn.id}" class="single_inc_cart">
                        <img src="/images/icons/plus.svg" alt="" />
                      </button>
                  </div>
                `
                singleProductCart()
            }
        })
    } catch(e) {}
}