import { selectOne, selectAll, addClass, removeClass } from "./_functions";
import { openToast, closingToast } from "./_toast";

export default function () {
  try {
    let headerCartIndicator = selectOne(".header-middle__link--cart-count"),
      bottomCartIndicator = selectOne(".bottom-nav__link--cart-count");

    function addToCart() {
      let addToCartBtns = selectAll("[data-add-cart]");
      addToCartBtns.forEach((el) => {
        el.addEventListener("click", async (e) => {
          const productId = e.currentTarget.getAttribute("data-add-cart");

          let response = await fetch("/cart/add", {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            method: "POST",
            body: JSON.stringify({
              product_id: productId,
            }),
          });
          response = await response.json();
          if (response.ok) {
            addToCartBtns.forEach((btn) => {
              if (btn.getAttribute("data-add-cart") === productId) {
                addClass(btn, "d-none");
                btn.nextElementSibling.classList.remove("d-none");
                btn.nextElementSibling.children[1].textContent = 1;
                headerCartIndicator.textContent =
                  response.result.user.productCountInCart + 1;
                bottomCartIndicator.textContent =
                  response.result.user.productCountInCart + 1;
              }
            });
          }

          if (!response.ok) {
            openToast(
              "failed",
              "Вы не вошли в систему. Пожалуйста, войдите сначала"
            );
            closingToast();
          }
        });
      });
    }

    addToCart();

    function increment() {
      let productIncrementBtns = selectAll("[data-increment-product]");
      productIncrementBtns.forEach((el) => {
        el.addEventListener("click", async (e) => {
          const productId = e.currentTarget.getAttribute(
            "data-increment-product"
          );

          let response = await fetch("/cart/api/plus", {
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify({ product_id: productId }),
          });

          response = await response.json();

          if (response.ok) {
            productIncrementBtns.forEach((el) => {
              if (el.getAttribute("data-increment-product") === productId) {
                el.nextElementSibling.textContent =
                  response.cart_incremented.count;
              }
            });
            headerCartIndicator.textContent =
              response.user.productCountInCart + 1;
            bottomCartIndicator.textContent =
              response.user.productCountInCart + 1;
          }
        });
      });
    }

    increment();

    function decrement() {
      let productDecrementBtns = selectAll("[data-decrement-product]");
      productDecrementBtns.forEach((el) => {
        el.addEventListener("click", async (e) => {
          const productId = e.currentTarget.getAttribute(
            "data-decrement-product"
          );

          let response = await fetch("/cart/api/minus", {
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify({ product_id: productId }),
          });

          response = await response.json();

          if (response.ok) {
            if (response.cart_decremented === 0) {
              productDecrementBtns.forEach((el) => {
                if (el.getAttribute("data-decrement-product") === productId) {
                  addClass(el.parentElement, "d-none");
                  removeClass(
                    el.parentElement.previousElementSibling,
                    "d-none"
                  );
                }
              });
            } else {
              productDecrementBtns.forEach((el) => {
                if (el.getAttribute("data-decrement-product") === productId) {
                  el.previousElementSibling.textContent =
                    response.cart_decremented.count;
                }
              });
            }

            headerCartIndicator.textContent =
              response.user.productCountInCart - 1;
            bottomCartIndicator.textContent =
              response.user.productCountInCart - 1;
          }

          if (!response.ok) {
            // productDecrementBtns.forEach(el => {
            //     if (el.getAttribute('data-decrement-product') === productId) {
            //         addClass(el.parentElement, 'd-none')
            //         removeClass(el.parentElement.previousElementSibling, 'd-none')
            //     }
            // })
            // headerCartIndicator.textContent = response.user.productCountInCart - 1
            // bottomCartIndicator.textContent = response.user.productCountInCart - 1
          }
        });
      });
    }

    decrement();
  } catch (e) {}
}
