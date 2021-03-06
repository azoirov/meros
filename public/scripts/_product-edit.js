import { selectAll, selectOne, clearText } from "./_functions";

export default function () {
  try {
    const productEditForm = selectOne("#product-edit-form"),
      productEditFormSubmitBtn = productEditForm.querySelector(".btn-primary"),
      productImagesWrapper = productEditForm.querySelector(".product-images"),
      productImagesFileInput = productEditForm.querySelector(
        "#product-images-file-input"
      ),
      productFeaturesWrapper =
        productEditForm.querySelector(".product-features"),
      productFeatureAddBtn = productEditForm.querySelector(
        "#product-feature-add-btn"
      ),
      productNameUzInput = productEditForm.querySelector("#product-name-uz"),
      productNameRuInput = productEditForm.querySelector("#product-name-ru"),
      productNameEnInput = productEditForm.querySelector("#product-name-en"),
      productCategorySelect =
        productEditForm.querySelector("#product-category"),
      secondaryCategorySelect = productEditForm.querySelector(
        "#secondary-category"
      ),
      tertiaryCategorySelect =
        productEditForm.querySelector("#tertiary-category"),
      productBrandSelect = productEditForm.querySelector("#product-brand"),
      productPriceInput = productEditForm.querySelector("#product-price"),
      productPercentInput = productEditForm.querySelector("#product-percent"),
      productDescriptionUz = productEditForm.querySelector(
        "#product-description-uz"
      ),
      productDescriptionRu = productEditForm.querySelector(
        "#product-description-ru"
      ),
      productDescriptionEn = productEditForm.querySelector(
        "#product-description-en"
      );

    productCategorySelect.addEventListener("click", async (e) => {
      const id = e.target.value;
      let response = await fetch(`/admin/api/secondary-category-list/${id}`);
      response = await response.json();
      secondaryCategorySelect.innerHTML =
        '<option value="" selected> - </option>';
      if (response.sub_categories.length > 0) {
        secondaryCategorySelect.removeAttribute("disabled");
        response.sub_categories.forEach((c) => {
          secondaryCategorySelect.innerHTML += `
                       <option value="${c.sub_category_id}">${c.sub_category_name_uz}</option>
                    `;
        });
        tertiaryCategorySelect.innerHTML = "";
        tertiaryCategorySelect.setAttribute("disabled", "true");
      } else {
        secondaryCategorySelect.setAttribute("disabled", "true");
        tertiaryCategorySelect.innerHTML = "";
        tertiaryCategorySelect.setAttribute("disabled", "true");
      }
    });

    secondaryCategorySelect.addEventListener("click", async (e) => {
      const id = e.target.value;
      let response = await fetch(`/admin/api/tertiary-category-list/${id}`);
      response = await response.json();
      tertiaryCategorySelect.innerHTML =
        '<option value="" selected> - </option>';

      if (response.sub_sub_categories.length > 0) {
        tertiaryCategorySelect.removeAttribute("disabled");
        response.sub_sub_categories.forEach((c) => {
          tertiaryCategorySelect.innerHTML += `
                  <option value="${c.sub_sub_category_id}">${c.sub_sub_category_name_uz}</option>
              `;
        });
      } else {
        tertiaryCategorySelect.innerHTML = "";
        tertiaryCategorySelect.setAttribute("disabled", "true");
      }
    });

    let files;

    productImagesFileInput.addEventListener("change", (evt) => {
      files = evt.target.files;

      for (let i = 0, f; (f = files[i]); i++) {
        if (!f.type.match("image.*")) {
          continue;
        }

        let reader = new FileReader();

        reader.onload = (function (theFile) {
          return function (e) {
            productImagesWrapper.innerHTML += `
                     <div class="product-images__item">
                         <img src="${e.target.result}" alt="">
                         <div class="product-images__remove">
                             <i class="fa fa-trash"></i>
                         </div>
                     </div>
                  `;

            removeImageFromList();
          };
        })(f);

        reader.readAsDataURL(f);
      }
    });

    let timeStamps = [],
      deletingThumbs = [];

    function removeImageFromList() {
      const removeImageElements = selectAll(".product-images__remove");

      removeImageElements.forEach((el, index) => {
        el.addEventListener("click", (e) => {
          const target = e.currentTarget;
          e.currentTarget.parentElement.remove();

          if (target.classList.contains("old-img")) {
            let imgURL = target.previousElementSibling.src;
            return deletingThumbs.push(
              imgURL.substring(imgURL.lastIndexOf("/") + 1)
            );
          }

          timeStamps.push(productImagesFileInput.files[index].lastModified);
        });
      });
    }

    removeImageFromList();

    function addNewFeature() {
      let index = selectAll(".product-features .row").length;
      productFeatureAddBtn.addEventListener("click", (e) => {
        index++;
        const optionRow = document.createElement("div");
        optionRow.classList.add("row", "mb-3");
        optionRow.innerHTML += `
                   <div class="col-md-3">
                     <p class="mb-1">Product feature - ${index}. (UZ)</p>
                     <input class="form-control mb-1" id="product-feature-name-uz-${index}"  type="text" placeholder="Feature name" required minlength="3">
                     <input class="form-control mb-1" id="product-feature-value-uz-${index}"  type="text" placeholder="Feature value" required minlength="3">
                   </div>
                   <div class="col-md-3">
                     <p class="mb-1">Product feature - ${index}. (RU)</p>
                     <input class="form-control mb-1" id="product-feature-name-ru-${index}"  type="text" placeholder="Feature name" required minlength="3">
                     <input class="form-control mb-1" id="product-feature-value-ru-${index}"  type="text" placeholder="Feature value" required minlength="3">
                    </div>
                   <div class="col-md-3">
                     <p class="mb-1">Product feature - ${index}. (EN)</p>
                     <input class="form-control mb-1" id="product-feature-name-en-${index}"  type="text" placeholder="Feature name" required minlength="3">
                     <input class="form-control mb-1" id="product-feature-value-en-${index}"  type="text" placeholder="Feature value" required minlength="3">
                    </div>
                    <div class="col-md-3 pt-4">
                       <button class="btn btn-danger w-100" data-remove-feature-row type="button">Remove</button>
                    </div>
                `;
        productFeaturesWrapper.append(optionRow);
        removeFeatureRow();
      });
    }

    addNewFeature();
    removeFeatureRow();

    function removeFeatureRow() {
      const removeFeatureRowBtns = selectAll("[data-remove-feature-row]");
      removeFeatureRowBtns.forEach((el) => {
        el.addEventListener("click", (e) => {
          e.currentTarget.parentElement.parentElement.remove();
        });
      });
    }

    function productEditFormSubmit() {
      productEditForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();

        let index = 0;
        for (let file of productImagesFileInput.files) {
          index++;
          if (!timeStamps.includes(file.lastModified)) {
            formData.append(`photo_${index}`, file);
          }
        }

        formData.append("uz_name", clearText(productNameUzInput.value));
        formData.append("en_name", clearText(productNameEnInput.value));
        formData.append("ru_name", clearText(productNameRuInput.value));
        formData.append("price", productPriceInput.value);
        formData.append("sale", productPercentInput.value);
        formData.append(
          "uz_description",
          clearText(productDescriptionUz.value)
        );
        formData.append(
          "ru_description",
          clearText(productDescriptionRu.value)
        );
        formData.append(
          "en_description",
          clearText(productDescriptionEn.value)
        );
        formData.append("category_id", productCategorySelect.value);
        formData.append("product_brand_id", productBrandSelect.value);

        const productFeaturesRows = selectAll(".product-features .row");
        let features = [];
        if (productFeaturesRows.length > 0) {
          productFeaturesRows.forEach((row) => {
            features.push({
              uz: {
                key: clearText(row.children[0].children[1].value),
                value: clearText(row.children[0].children[2].value),
              },
              ru: {
                key: clearText(row.children[1].children[1].value),
                value: clearText(row.children[1].children[2].value),
              },
              en: {
                key: clearText(row.children[2].children[1].value),
                value: clearText(row.children[2].children[2].value),
              },
            });
          });
        }
        formData.append("options", JSON.stringify(features));
        formData.append("product_id", productEditFormSubmitBtn.id);
        formData.append("thumbs", JSON.stringify(deletingThumbs));
        if (secondaryCategorySelect.value) {
          formData.append("sub_category_id", secondaryCategorySelect.value);
        }
        if (tertiaryCategorySelect.value) {
          formData.append("sub_sub_category_id", tertiaryCategorySelect.value);
        }

        let response = await fetch("/admin/product/edit", {
          method: "POST",
          body: formData,
        });

        response = await response.json();

        if (response.ok) {
          window.location.href =
            "/admin/products?c_page=1&p_page=30&category_slug=all";
        }
      });
    }

    productEditFormSubmit();
  } catch (e) {}
}
