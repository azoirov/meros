import { selectOne } from "./_functions";

export default function () {
  try {
    const orderForm = selectOne("#order-form"),
      orderRegion = orderForm.querySelector("#region"),
      orderAddress = orderForm.querySelector("#address"),
      orderOwnerName = orderForm.querySelector("#name"),
      orderOwnerPhone = orderForm.querySelector("#phone"),
      orderOwnerComment = orderForm.querySelector("#review"),
      orderSubmitBtn = selectOne("#order-form-submit"),
      orderCard = document.querySelector(".order-card"),
      orderCash = document.querySelector(".order-cash");

    orderCard.addEventListener("click", async (e) => {
      const formData = new FormData();

      let response = await fetch("/order/bulk/", {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        method: "POST",
        body: JSON.stringify({
          shipping_region: orderRegion.textContent,
          shipping_address: orderAddress.value,
          phone_number: orderOwnerPhone.value.replace(/\D/g, ""),
          full_name: orderOwnerName.value,
          is_shipped: false,
          is_payed: false,
          payment_method: "card",
          description: orderOwnerComment.value,
        }),
      });

      response = await response.json();

      if (response.result.link) {
        window.location.href = response.result.link;
      }
    });
    orderCash.addEventListener("click", async (e) => {
      const formData = new FormData();

      let response = await fetch("/order/bulk/", {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        method: "POST",
        body: JSON.stringify({
          shipping_region: orderRegion.textContent,
          shipping_address: orderAddress.value,
          phone_number: orderOwnerPhone.value.replace(/\D/g, ""),
          full_name: orderOwnerName.value,
          is_shipped: false,
          is_payed: false,
          payment_method: "cash",
          description: orderOwnerComment.value,
        }),
      });

      response = await response.json();

      if (response.ok) {
        window.location.href = "/cabinet/orders";
      }
    });
  } catch (e) {}
}
