import { selectOne, clearText, selectAll } from "./_functions";
import { openModal, modalClosing } from "./_modal";

export default function () {
  try {
    const productBrandCreateForm = selectOne("#product-brand-create-form"),
      productBrandNameInput = productBrandCreateForm.querySelector(
        "#product-brand-name"
      ),
      modalContent = selectOne(".my-modal-content");

    productBrandCreateForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let response = await fetch("/admin/api/product-brands", {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        method: "POST",
        body: JSON.stringify({
          brand_name: clearText(productBrandNameInput.value),
        }),
      });
      response = await response.json();

      if (response.ok) {
        window.location.reload();
      }

      if (!response.ok) {
        modalContent.innerHTML = `
               <div class="alert alert-danger text-center p-2" style="font-size: 20px">Product name must be unique</div>
               <div class="d-flex justify-content-end">
                  <button class="btn btn-primary w-25" data-modal-close>OK</button>
                </div>
            `;
        openModal();
        modalClosing();
      }
    });

    const productBrandEditBtns = selectAll("[data-product-brand-edit]"),
      productBrandDeleteBtns = selectAll("[data-product-brand-remove]");

    productBrandDeleteBtns.forEach((el) => {
      el.addEventListener("click", async (e) => {
        let response = await fetch("/admin/api/product-brands/delete", {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          method: "POST",
          body: JSON.stringify({
            product_brand_id: e.currentTarget.id,
          }),
        });

        response = await response.json();

        if (response.ok) {
          window.location.reload();
        }
      });
    });

    productBrandEditBtns.forEach((el) => {
      el.addEventListener("click", async (e) => {
        let response = await fetch(
          "/admin/product-brands/" + e.currentTarget.id
        );
        response = await response.json();
        modalContent.innerHTML = `
               <form id="product-brand-edit-form">
                  <label class="d-block mb-3">
                      <span class="mb-1 d-block">Product brand name</span>
                      <input class="form-control" id="product-brand-name" type="text" placeholder="Product brand name" value="${response.productBrand.brand_name}" required >
                  </label>
                  <button class="btn btn-secondary w-25" type="button" data-modal-close>Cancel</button>
                  <button class="btn btn-primary w-25" id="${response.productBrand.product_brand_id}">Edit</button>
              </form>
            `;
        openModal();
        modalClosing();
        productBrandEditSubmit(response.productBrand.product_brand_id);
      });
    });

    function productBrandEditSubmit(id) {
      const productBrandEditForm = selectOne("#product-brand-edit-form"),
        productBrandNameInput = productBrandEditForm.querySelector(
          "#product-brand-name"
        );

      productBrandEditForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        let response = await fetch("/admin/api/product-brands/update", {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          method: "POST",
          body: JSON.stringify({
            product_brand_name: clearText(productBrandNameInput.value),
            product_brand_id: id,
          }),
        });
        response = await response.json();

        if (response.ok) {
          window.location.reload();
        }
      });
    }
  } catch (e) {}
}
