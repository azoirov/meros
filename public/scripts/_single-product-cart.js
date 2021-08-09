import singleProductAddCart from "./_single-product-cart-add"

export default function () {
    console.log(true)
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
                btnGroup.querySelector("span").textContent = response.cart_incremented.count;
            }
        })
    } catch(e) {}
}