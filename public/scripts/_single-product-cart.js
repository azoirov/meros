import singleProductAddCart from "./_single-product-cart-add"

export default function () {
    console.log(true)
    try {
        let incBtn = document.querySelector(".single_inc_cart");
        let decBtn = document.querySelector('.single_dec_cart');
        let btnGroup = document.querySelector(".product-count");
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
                if(response.cart === 0) {
                    btnGroup.remove();
                    document.querySelector(".product-actions").firstElementChild.innerHTML += `
                        <button id="${decBtn.id}" class="button-outline-sm single_add_to_cart">В корзину</button>
                    `;
                    singleProductAddCart()
                } else {
                    btnGroup.querySelector("span").textContent = response.cart[0][0][0].count
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

            if(response.ok) {
                btnGroup.querySelector("span").textContent = response.cart_incremented[0][0][0].count;
            }
        })
    } catch(e) {}
}