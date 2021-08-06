import {selectAll, selectOne} from './_functions'

export default function () {
    try {
        const homeBannerForm = selectOne('#home-banner-form'),
            homeBannerLeft = homeBannerForm.querySelector('#home-banner-left'),
            homeBannerRight = homeBannerForm.querySelector('#home-banner-right'),
            homeBannerSmall1 = homeBannerForm.querySelector('#home-banner-small-1'),
            homeBannerSmall2 = homeBannerForm.querySelector('#home-banner-small-2'),
            bannerHorizontal1 = homeBannerForm.querySelector('#home-banner-horizontal-1'),
            bannerHorizontal2 = homeBannerForm.querySelector('#home-banner-horizontal-2'),
            homeBannerLeftURL = homeBannerForm.querySelector('#home-banner-left-url'),
            homeBannerRightURL = homeBannerForm.querySelector('#home-banner-right-url'),
            homeBannerSmall1URL = homeBannerForm.querySelector('#home-banner-small-1-url'),
            homeBannerSmall2URL = homeBannerForm.querySelector('#home-banner-small-2-url'),
            homeBannerHorizontal1URL = homeBannerForm.querySelector('#home-banner-horizontal-1-url'),
            homeBannerHorizontal2URL = homeBannerForm.querySelector('#home-banner-horizontal-2-url'),
            sliderItemsWrapper = homeBannerForm.querySelector('.banners__slider'),
            addSliderItemBtn = homeBannerForm.querySelector('[data-add-slider-item]')

        function renderBannerImg() {
            selectAll('#home-banner-form input[type="file"]').forEach(el => {
                el.addEventListener('change', ev => {
                    if (ev.target.files && ev.target.files[0]) {
                        let reader = new FileReader();

                        reader.onload = function (e) {
                            ev.target.previousElementSibling.src = e.target.result
                        }

                        reader.readAsDataURL(ev.target.files[0])
                    }
                })
            })
        }

        renderBannerImg()

        function removeSliderItems() {
            const removeSlideItemBtns = selectAll('[data-remove-slide-item]')
            removeSlideItemBtns.forEach(el => {
                el.addEventListener('click', e => {
                    el.parentElement.parentElement.parentElement.remove()
                })
            })
        }

        removeSliderItems()

        function addSliderItems() {
            addSliderItemBtn.addEventListener('click', e => {
                let index = sliderItemsWrapper.children.length + 1
                let row = document.createElement('div')
                row.classList.add('row', 'banners__slider__item', 'mb-2')
                row.innerHTML = `
                    <div class="col-md-9">
                        <label class="banners__label">
                            <span>Banner small - ${ index }<br> 1073 x 372 </span>
                            <img src="" alt="">
                            <input class="d-none" id="home-banner-slider-img-${index}" type="file" accept=".jpg, .png">
                        </label>
                    </div>
                    <div class="col-md-3">
                            <label class="d-block w-100">
                                <span>Slider item - ${index} URL</span>
                                <input class="form-control my-2" id="home-banner-slider-url-${index}" type="url" required>
                                <button class="btn btn-danger w-100" type="button" data-remove-slide-item>Remove slide item</button>
                            </label>
                        </div>
                `
                sliderItemsWrapper.append(row)
                removeSliderItems()
                renderBannerImg()
            })
        }

        addSliderItems()

        homeBannerForm.addEventListener('submit', async e => {
            e.preventDefault()

            const formData = new FormData()

            if (homeBannerLeft.files[0] && homeBannerLeftURL.value) {
                formData.append('home_banner_left', homeBannerLeft.files[0])
                formData.append('home_banner_left_url', homeBannerLeftURL.value)
            }
            if (homeBannerRight.files[0] && homeBannerRightURL.value) {
                formData.append('home_banner_right', homeBannerRight.files[0])
                formData.append('home_banner_right_url', homeBannerRightURL.value)
            }
            if (homeBannerSmall1.files[0] && homeBannerSmall1URL.value) {
                formData.append('home_banner_small1', homeBannerSmall1.files[0])
                formData.append('home_banner_small1_url', homeBannerSmall1URL.value)
            }
            if (homeBannerSmall2.files[0] && homeBannerSmall2URL.value) {
                formData.append('home_banner_small2', homeBannerSmall2.files[0])
                formData.append('home_banner_small2_url', homeBannerSmall2URL.value)
            }
            if (bannerHorizontal1.files[0] && homeBannerHorizontal1URL.value) {
                formData.append('banner_horizontal_1', bannerHorizontal1.files[0])
                formData.append('banner_horizontal_1', homeBannerHorizontal1URL.value)
            }
            if (bannerHorizontal2.files[0] && homeBannerHorizontal2URL.value) {
                formData.append('banner_horizontal_2', bannerHorizontal2.files[0])
                formData.append('banner_horizontal_2', homeBannerHorizontal2URL.value)
            }

            if (sliderItemsWrapper.children.length > 0) {
                const sliderItems = selectAll('.banners__slider .row')
                console.log(sliderItems)
                sliderItems.forEach((item, index) => {
                    if (item.firstElementChild.firstElementChild.children[2].files[0] && item.children[1].firstElementChild.children[1].value) {
                        formData.append(`carousel-${index}`, item.firstElementChild.firstElementChild.children[2].files[0])
                        formData.append(`carousel-url-${index}`, item.children[1].firstElementChild.children[1].value)
                    }
                })
            }

            let response = await fetch('/admin/home-banners', {
                method: 'POST',
                body: formData
            })

            response = await response.json()

            if (response.ok) {
                return window.location.href = '/'
            }

            alert('Banner qo`shishda xatolik ro`y berdi! :(')
        })
    } catch (e) {

    }
}