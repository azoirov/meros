import { selectOne, selectAll, clearText } from "./_functions";
import { openModal, closeModal, modalClosing } from "./_modal";

export default function adminBrand() {
  try {
    const brandCreateForm = document.getElementById("brand-create-form"),
      brandImageInput = document.getElementById("brand-img"),
      brandNameInput = document.getElementById("brand-name"),
      brandSiteInput = document.getElementById("brand-site"),
      brandCategorySelect = document.getElementById("brand-category");

    brandCreateForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("brand_name", clearText(brandNameInput.value));
      formData.append("brand_site", clearText(brandSiteInput.value));
      formData.append("brand_thumb", brandImageInput.files[0]);
      formData.append("category_id", brandCategorySelect.value);

      let response = await fetch("/admin/api/brand", {
        method: "POST",
        body: formData,
      });
      response = await response.json();

      if (response.ok) {
        window.location.reload();
      }

      if (!response.ok) {
        const modalContent = selectOne(".my-modal-content");

        modalContent.innerHTML = `
               <div class="alert alert-danger text-center p-2" style="font-size: 20px">${response.message.substring(
                 6
               )}</div>
               <div class="d-flex justify-content-end">
                  <button class="btn btn-primary w-25" data-modal-close>OK</button>
                </div>
             `;
        openModal();
        modalClosing();
      }
    });

    const removeBrandBtns = selectAll("[data-brand-remove]");
    removeBrandBtns.forEach((el) => {
      el.addEventListener("click", (ev) => {
        const modalContent = selectOne(".my-modal-content");

        modalContent.innerHTML = `
               <h4 class="display-6" style="font-size: 1.5rem">Are you sure delete?</h4>
               <div class="d-flex pt-3">
                  <button class="btn btn-secondary me-2" data-modal-close>Cancel</button>
                  <button class="btn btn-danger" id="${ev.currentTarget.id}" data-yes-delete>Yes, delete</button>
                </div>
             `;
        openModal();
        modalClosing();
        removeBrand();
      });
    });

    function removeBrand() {
      const yesRemoveBtn = selectOne("[data-yes-delete]");

      yesRemoveBtn.addEventListener("click", async (ev) => {
        let response = await fetch("/admin/api/delete/brand", {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          method: "POST",
          body: JSON.stringify({
            id: ev.currentTarget.id,
          }),
        });
        response = await response.json();

        if (response.message) {
          window.location.reload();
        }
      });
    }

    const editBrandBtns = selectAll("[data-brand-edit]");

    editBrandBtns.forEach((el) => {
      el.addEventListener("click", async (ev) => {
        const id = ev.currentTarget.id,
          modalContent = selectOne(".my-modal-content");

        let response = await fetch("/admin/api/brands/" + id);
        response = await response.json();

        let selectOptions = "";
        response.result.categories.forEach((category) => {
          selectOptions += `
                  <option ${
                    response.result.brand.category_id === category.category_id
                      ? "selected"
                      : ""
                  } value="${category.category_id}">${category.uz_name}</option>
               `;
        });

        modalContent.innerHTML = `
               <form id="brand-edit-form">
                  <div class="row mb-3">
                      <div class="col-md-2">
                          <div class="category-img">
                              <img style="width: 100%" src="/images/catalog-brands/${response.result.brand.brand_thumb}" alt="">
                          </div>
                      </div>
                      <div class="col-md-5 ps-0">
                          <h5 class="mb-0">Update image</h5>
                          <label class="d-block">
                              <div class="text-primary">
                                  <i class="fa fa-edit"></i>
                                  Edit image
                              </div>
                              <input class="d-none" id="brand-img-input" type="file" accept="image/png, image/jpeg">
                          </label>
                      </div>
                  </div>
                  <label class="d-block mb-3">
                      <span class="mb-1 d-block">Brand name</span>
                      <input class="form-control" id="brand-name" type="text" placeholder="Brand name" value="${response.result.brand.brand_name}" required >
                  </label>
                  <label class="d-block mb-3">
                      <span class="mb-1 d-block">Brand site</span>
                      <input class="form-control" id="brand-site" type="text" placeholder="Brand site" value="${response.result.brand.brand_site}" required >
                  </label>
                  <label class="d-block mb-3">
                       <span>Brand category</span>
                       <select class="form-control" id="brand-category" required>
                           ${selectOptions}
                       </select>
                  </label>
                  <button class="btn btn-secondary w-25" type="button" data-modal-close>Cancel</button>
                  <button class="btn btn-primary w-25" id="${response.result.brand.brand_id}">Edit</button>
              </form>
            `;
        openModal();
        modalClosing();
        editBrandImage();
        editBrandSubmit();
      });
    });

    function editBrandImage() {
      const brandEditFileInputs = selectAll(
        '#brand-edit-form input[type="file"]'
      );
      brandEditFileInputs.forEach((el) => {
        el.addEventListener("change", (ev) => {
          const brandImg =
            ev.target.parentElement.parentElement.previousElementSibling
              .children[0];

          if (ev.target.files && ev.target.files[0]) {
            let reader = new FileReader();

            reader.onload = function (e) {
              if (!brandImg.children[1]) {
                brandImg.innerHTML += `
                          <div class="category-img-update-version" id="brand-img-update-version">
                               <img style="width: 100%" src="${e.target.result}" alt="">
                               <div class="category-img-update-version-remove" id="brand-img-update-version-remove">
                                   <i class="fa fa-trash"></i>
                               </div>
                           </div>
                        `;
              } else {
                brandImg.children[1].children[0].src = e.target.result;
              }
              brandImgUpdatedRemove();
            };

            reader.readAsDataURL(ev.target.files[0]);
          }
        });
      });
    }

    function brandImgUpdatedRemove() {
      const brandImgUpdatedVersionRemoveElements = selectAll(
        "#brand-img-update-version-remove"
      );
      brandImgUpdatedVersionRemoveElements.forEach((el) => {
        el.addEventListener("click", (e) => {
          const brandImgFileInput =
            e.currentTarget.parentElement.parentElement.parentElement
              .nextElementSibling.children[1].children[1];
          brandImgFileInput.value = null;
          e.currentTarget.parentElement.remove();
        });
      });
    }

    function editBrandSubmit() {
      const editBrandForm = selectOne("#brand-edit-form"),
        brandImgInput = editBrandForm.querySelector("#brand-img-input"),
        brandName = editBrandForm.querySelector("#brand-name"),
        brandSite = editBrandForm.querySelector("#brand-site"),
        brandCategorySelect = editBrandForm.querySelector("#brand-category"),
        brandFormSubmitBtn = editBrandForm.querySelector(".btn-primary");

      editBrandForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (brandImgInput.files[0]) {
          formData.append("brand_thumb", brandImgInput.files[0]);
        }

        formData.append("brand_name", clearText(brandName.value));
        formData.append("brand_site", clearText(brandSite.value));
        formData.append("brand_id", brandFormSubmitBtn.id);
        formData.append("category_id", brandCategorySelect.value);

        let response = await fetch("/admin/api/update/brand", {
          method: "POST",
          body: formData,
        });

        response = await response.json();

        if (response.ok) {
          window.location.reload();
        }

        if (!response.ok) {
          if (editBrandForm.children[0].classList.contains("alert-danger")) {
            editBrandForm.children[0].textContent = response.message;
          } else {
            let alert = document.createElement("div");
            alert.classList.add("alert", "alert-danger", "text-center");
            alert.textContent = response.message.substring(6);
            alert.style.fontSize = "20px";
            editBrandForm.prepend(alert);
          }
        }
      });
    }
  } catch (e) {}
}
