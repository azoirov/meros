import { selectOne, selectAll } from "./_functions";
import { openModal, modalClosing } from "./_modal";

export default function () {
  try {
    const addBannerForm = selectOne("#add-banner-form"),
      bannerCategorySelect = addBannerForm.querySelector(
        "#banner-category-select"
      ),
      bannerLeftInput = addBannerForm.querySelector("#banner-left-input"),
      bannerRightInput = addBannerForm.querySelector("#banner-right-input"),
      bannerBig2XInput = addBannerForm.querySelector("#banner-big-2x-input"),
      bannerBigXInput = addBannerForm.querySelector("#banner-big-x-input"),
      bannerSmall1 = addBannerForm.querySelector("#banner-small-1-input"),
      bannerSmall2 = addBannerForm.querySelector("#banner-small-2-input"),
      bannerSmall3 = addBannerForm.querySelector("#banner-small-3-input"),
      bannerLeftURLInput = addBannerForm.querySelector("#banner-left-url"),
      bannerRightURLInput = addBannerForm.querySelector("#banner-right-url"),
      bannerBigURLInput = addBannerForm.querySelector("#banner-big-url"),
      bannerSmall1URL = addBannerForm.querySelector("#banner-small-1-url"),
      bannerSmall2URL = addBannerForm.querySelector("#banner-small-2-url"),
      bannerSmall3URL = addBannerForm.querySelector("#banner-small-3-url");

    const bannerImgInputs = selectAll('.banners__label input[type="file"]');

    bannerImgInputs.forEach((el) => {
      el.addEventListener("change", (ev) => {
        if (ev.target.files && ev.target.files[0]) {
          let reader = new FileReader();

          reader.onload = function (e) {
            ev.target.previousElementSibling.src = e.target.result;
          };

          reader.readAsDataURL(ev.target.files[0]);
        }
      });
    });

    addBannerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();

      if (bannerBigXInput.files[0]) {
        formData.append("big_banner_1x", bannerBigXInput.files[0]);
      }
      if (bannerBig2XInput.files[0]) {
        formData.append("big_banner_2x", bannerBig2XInput.files[0]);
      }
      if (bannerSmall1.files[0]) {
        formData.append("small_banner_1", bannerSmall1.files[0]);
      }
      if (bannerSmall2.files[0]) {
        formData.append("small_banner_2", bannerSmall2.files[0]);
      }
      if (bannerSmall3.files[0]) {
        formData.append("small_banner_3", bannerSmall3.files[0]);
      }
      if (bannerLeftInput.files[0]) {
        formData.append("side_banner_left", bannerLeftInput.files[0]);
      }
      if (bannerRightInput.files[0]) {
        formData.append("side_banner_right", bannerRightInput.files[0]);
      }

      formData.append("category_id", bannerCategorySelect.value);
      formData.append("big_banner_url", bannerBigURLInput.value);
      formData.append("big_banner_2x_url", bannerBigURLInput.value);
      formData.append("small_banner_1_url", bannerSmall1URL.value);
      formData.append("small_banner_2_url", bannerSmall2URL.value);
      formData.append("small_banner_3_url", bannerSmall3URL.value);
      formData.append("side_banner_left_url", bannerLeftURLInput.value);
      formData.append("side_banner_right_url", bannerRightURLInput.value);

      let response = await fetch("/admin/category-banner", {
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
                    <div class="alert alert-danger mb-3">
                        Rasmlarni to'liq yuklang. Ularga mos URL lar ham kiritilishi shart
                    </div>
                    <button class="btn btn-primary" data-modal-close>OK</button>
                `;
        openModal();
        modalClosing();
      }
    });

    window.addEventListener("load", async (e) => {
      await renderCategoryBanner(bannerCategorySelect.value);
    });

    bannerCategorySelect.addEventListener("change", async (e) => {
      await renderCategoryBanner(e.target.value);
    });

    async function renderCategoryBanner(categoryId) {
      let response = await fetch("/admin/category-banners/" + categoryId);
      response = await response.json();

      if (response.banners) {
        let {
          big_banner_image_1x,
          big_banner_image_2x,
          big_banner_url,
          side_banner_left_image,
          side_banner_left_url,
          side_banner_right_image,
          side_banner_right_url,
          small_banner_1_image,
          small_banner_1_url,
          small_banner_2_image,
          small_banner_2_url,
          small_banner_3_image,
          small_banner_3_url,
        } = response.banners;
        bannerLeftInput.previousElementSibling.src = `/images/category_banners/${categoryId}/${side_banner_left_image}`;
        bannerRightInput.previousElementSibling.src = `/images/category_banners/${categoryId}/${side_banner_right_image}`;
        bannerBig2XInput.previousElementSibling.src = `/images/category_banners/${categoryId}/${big_banner_image_2x}`;
        bannerBigXInput.previousElementSibling.src = `/images/category_banners/${categoryId}/${big_banner_image_1x}`;
        bannerSmall1.previousElementSibling.src = `/images/category_banners/${categoryId}/${small_banner_1_image}`;
        bannerSmall2.previousElementSibling.src = `/images/category_banners/${categoryId}/${small_banner_2_image}`;
        bannerSmall3.previousElementSibling.src = `/images/category_banners/${categoryId}/${small_banner_3_image}`;

        bannerLeftURLInput.value = side_banner_left_url;
        bannerRightURLInput.value = side_banner_right_url;
        bannerBigURLInput.value = big_banner_url;
        bannerSmall1URL.value = small_banner_1_url;
        bannerSmall2URL.value = small_banner_2_url;
        bannerSmall3URL.value = small_banner_3_url;
      } else {
        selectAll(".banners__label img").forEach((img) => (img.src = ""));
        selectAll('.banners-url input[type="url"]').forEach(
          (input) => (input.value = "")
        );
      }
    }
  } catch (e) {}
}
