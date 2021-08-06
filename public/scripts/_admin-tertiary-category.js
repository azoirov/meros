import {selectOne, selectAll, clearText} from './_functions'
import {openModal, modalClosing} from './_modal'

export default function () {
    try {
        const tertiaryCategoryCreateForm = document.getElementById('tertiary-create-form'),
            tertiaryCategoryImageInput = document.getElementById('tertiary-category-img'),
            tertiaryCategorySelectCategories = document.getElementById('tertiary-select-category'),
            tertiaryCategorySelectSecondaryCategories = document.getElementById('tertiary-select-secondary-category'),
            tertiaryCategoryNameUz = document.getElementById('tertiary-category-name-uz'),
            tertiaryCategoryNameRu = document.getElementById('tertiary-category-name-ru'),
            tertiaryCategoryNameEn = document.getElementById('tertiary-category-name-en')

        tertiaryCategorySelectCategories.addEventListener('click', async e => {
            const id = e.target.value
            let response = await fetch(`/admin/api/secondary-category-list/${id}`)
            response = await response.json()
            tertiaryCategorySelectSecondaryCategories.innerHTML = ''
            if (response.sub_categories.length > 0) {
                tertiaryCategorySelectSecondaryCategories.removeAttribute('disabled')
                response.sub_categories.forEach(c => {
                    tertiaryCategorySelectSecondaryCategories.innerHTML += `
                        <option value="${c.sub_category_id}">${c.sub_category_name_uz}</option>
                    `
                })
            } else {
                tertiaryCategorySelectSecondaryCategories.setAttribute('disabled', 'true')
            }
        })

        tertiaryCategoryCreateForm.addEventListener('submit', async e => {
            e.preventDefault()

            const formData = new FormData()
            formData.append('sub_sub_category_image', tertiaryCategoryImageInput.files[0])
            formData.append('sub_category_id', tertiaryCategorySelectSecondaryCategories.value)
            formData.append('sub_sub_category_name_uz', clearText(tertiaryCategoryNameUz.value))
            formData.append('sub_sub_category_name_en', clearText(tertiaryCategoryNameEn.value))
            formData.append('sub_sub_category_name_ru', clearText(tertiaryCategoryNameRu.value))
            formData.append('category_id', tertiaryCategorySelectCategories.value)

            let response = await fetch('/admin/tertiary-categories', {
                method: 'POST',
                body: formData
            })
            response = await response.json()

            if (response.ok) {
                window.location.reload()
            }

            if (!response.ok) {
                const modalContent = selectOne('.my-modal-content')

                modalContent.innerHTML = `
                   <div class="alert alert-danger text-center p-2" style="font-size: 20px">${response.message.substring(6)}</div>
                   <div class="d-flex justify-content-end">
                      <button class="btn btn-primary w-25" data-modal-close>OK</button>
                    </div>
                `
                openModal()
                modalClosing()
            }
        })

        const removeTertiaryCategoryBtns = selectAll('[data-tertiary-category-remove]')
        removeTertiaryCategoryBtns.forEach(el => {
            el.addEventListener('click', ev => {
                const modalContent = selectOne('.my-modal-content')

                modalContent.innerHTML = `
                   <h4 class="display-6" style="font-size: 1.5rem">Are you sure delete?</h4>
                   <div class="d-flex pt-3">
                      <button class="btn btn-secondary me-2" data-modal-close>Cancel</button>
                      <button class="btn btn-danger" id="${ev.currentTarget.id}" data-yes-delete>Yes, delete</button>
                    </div>
                 `
                openModal()
                modalClosing()
                removeTertiaryCategory()
            })
        })

        function removeTertiaryCategory() {
            const yesRemoveBtn = selectOne('[data-yes-delete]')

            yesRemoveBtn.addEventListener('click', async ev => {
                let response = await fetch('/admin/tertiary-categories/delete', {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        sub_sub_category_id: ev.currentTarget.id
                    })
                })
                response = await response.json()

                if (response.ok) {
                    window.location.reload()
                }
            })
        }

        const editTertiaryCategoryBtns = selectAll('[data-tertiary-category-edit]')

        editTertiaryCategoryBtns.forEach(el => {
            el.addEventListener('click', async ev => {
                const id = ev.currentTarget.id,
                    modalContent = selectOne('.my-modal-content')

                let response = await fetch('/admin/tertiary-categories/' + id)
                response = await response.json()
                console.log(response)
                const {categories, sub_category, sub_sub_category} = response

                let categoryOptions = ''

                categories.forEach(c => {
                    if (c.category_id === sub_sub_category['category_id']) {
                        categoryOptions += `<option value="${c.category_id}" selected>${c.uz_name}</option>`
                    }
                    categoryOptions += `<option value="${c.category_id}">${c.uz_name}</option>`
                })

                modalContent.innerHTML = `
                   <form id="tertiary-category-edit-form">
                      <div class="row mb-3">
                          <div class="col-md-2">
                              <div class="category-img">
                                  <img style="width: 100%" src="/images/sub_sub_categories/${sub_sub_category.sub_sub_category_image}" alt="">
                              </div>
                          </div>
                          <div class="col-md-4 ps-0">
                              <h5 class="mb-0">Update image</h5>
                              <label class="d-block">
                                  <div class="text-primary">
                                      <i class="fa fa-edit"></i>
                                      Edit image
                                  </div>
                                  <input class="d-none" id="tertiary-category-img-input" type="file" accept=".png, .jpeg, .jpg">
                              </label>
                          </div>
                      </div>
                      <label class="d-block mb-3">
                          <span class="mb-1 d-block">Categories list</span>
                          <select class="form-control" id="tertiary-category-select">
                                ${categoryOptions}
                          </select>
                      </label>
                      <label class="d-block mb-3">
                          <span class="mb-1 d-block">Secondary categories list</span>
                          <select class="form-control" id="tertiary-secondary-category-select">
                                <option value="${sub_category.sub_category_id}">${sub_category.sub_category_name_uz}</option>
                          </select>
                      </label>
                      <label class="d-block mb-3">
                           <span class="mb-1 d-block">Tertiary category name(Uz)</span>
                           <input class="form-control" id="tertiary-category-name-uz" type="text" placeholder="Tertiary category name(Uz)" value="${sub_sub_category.sub_sub_category_name_uz}">
                       </label>
                      <label class="d-block mb-3">
                           <span class="mb-1 d-block">Tertiary category name(Ru)</span>
                           <input class="form-control" id="tertiary-category-name-ru" type="text" placeholder="Tertiary category name(Ru)" value="${sub_sub_category.sub_sub_category_name_ru}">
                       </label>
                      <label class="d-block mb-3">
                           <span class="mb-1 d-block">Tertiary category name(En)</span>
                           <input class="form-control" id="tertiary-category-name-en" type="text" placeholder="Tertiary category name(En)" value="${sub_sub_category.sub_sub_category_name_en}">
                       </label>
                      <button type="button" class="btn btn-secondary w-25" data-modal-close>Cancel</button>
                      <button class="btn btn-primary w-25" id="${sub_sub_category.sub_sub_category_id}">Edit</button>
                  </form>
                `
                openModal()
                modalClosing()
                changeCategorySelect()
                editTertiaryCategoryImage()
                editTertiaryCategorySubmit()
            })
        })

        function changeCategorySelect() {
            const categorySelect = selectOne('#tertiary-category-select'),
                secondaryCategorySelect = selectOne('#tertiary-secondary-category-select')

            categorySelect.addEventListener('click', async e => {
                const id = e.target.value
                let response = await fetch(`/admin/api/secondary-category-list/${id}`)
                response = await response.json()
                secondaryCategorySelect.innerHTML = ''
                if (response.sub_categories.length > 0) {
                    secondaryCategorySelect.removeAttribute('disabled')
                    response.sub_categories.forEach(c => {
                        secondaryCategorySelect.innerHTML += `
                            <option value="${c.sub_category_id}">${c.sub_category_name_uz}</option>
                        `
                    })
                } else {
                    secondaryCategorySelect.setAttribute('disabled', 'true')
                }
            })
        }

        function editTertiaryCategoryImage() {
            const tertiaryCategoryEditFileInputs = selectAll('#tertiary-category-edit-form input[type="file"]')
            tertiaryCategoryEditFileInputs.forEach(el => {
                el.addEventListener('change', ev => {
                    const tertiaryCategoryImg = ev.target.parentElement.parentElement.previousElementSibling.children[0]

                    if (ev.target.files && ev.target.files[0]) {
                        let reader = new FileReader();

                        reader.onload = function (e) {
                            if (!tertiaryCategoryImg.children[1]) {
                                tertiaryCategoryImg.innerHTML += `
                               <div class="category-img-update-version" id="category-img-update-version">
                                   <img style="width: 100%" src="${e.target.result}" alt="">
                                   <div class="category-img-update-version-remove" id="tertiary-category-img-update-version-remove">
                                       <i class="fa fa-trash"></i>
                                   </div>
                               </div>
                            `
                            } else {
                                tertiaryCategoryImg.children[1].children[0].src = e.target.result
                            }

                            tertiaryCategoryImgUpdatedRemove()
                        }

                        reader.readAsDataURL(ev.target.files[0])
                    }
                })
            })
        }

        function tertiaryCategoryImgUpdatedRemove() {
            const tertiaryCategoryImgUpdatedVersionRemoveElements = selectAll('#tertiary-category-img-update-version-remove')
            tertiaryCategoryImgUpdatedVersionRemoveElements.forEach(el => {
                el.addEventListener('click', e => {
                    const tertiaryCategoryImgFileInput = e.currentTarget.parentElement.parentElement.parentElement.nextElementSibling.children[1].children[1]
                    tertiaryCategoryImgFileInput.value = null
                    e.currentTarget.parentElement.remove()
                })
            })
        }

        function editTertiaryCategorySubmit() {
            const editTertiaryCategoryForm = selectOne('#tertiary-category-edit-form')

            editTertiaryCategoryForm.addEventListener('submit', async e => {
                e.preventDefault()

                const tertiaryCategoryImgInput = editTertiaryCategoryForm.querySelector('#tertiary-category-img-input'),
                    tertiaryCategorySelect = editTertiaryCategoryForm.querySelector('#tertiary-category-select'),
                    tertiarySecondaryCategorySelect = editTertiaryCategoryForm.querySelector('#tertiary-secondary-category-select'),
                    tertiaryCategoryNameUzInput = editTertiaryCategoryForm.querySelector('#tertiary-category-name-uz'),
                    tertiaryCategoryNameRuInput = editTertiaryCategoryForm.querySelector('#tertiary-category-name-ru'),
                    tertiaryCategoryNameEnInput = editTertiaryCategoryForm.querySelector('#tertiary-category-name-en'),
                    tertiaryCategoryEditSubmitBtn = editTertiaryCategoryForm.querySelector('.btn-primary')

                let formData = new FormData()

                if (tertiaryCategoryImgInput.files[0]) {
                    formData.append('sub_sub_category_image', tertiaryCategoryImgInput.files[0])
                }

                formData.append('sub_category_id', tertiarySecondaryCategorySelect.value)
                formData.append('sub_sub_category_name_uz', clearText(tertiaryCategoryNameUzInput.value))
                formData.append('sub_sub_category_name_ru', clearText(tertiaryCategoryNameRuInput.value))
                formData.append('sub_sub_category_name_en', clearText(tertiaryCategoryNameEnInput.value))
                formData.append('sub_sub_category_id', tertiaryCategoryEditSubmitBtn.id)
                formData.append('category_id', tertiaryCategorySelect.value)

                let response = await fetch('/admin/tertiary-categories/update', {
                    method: 'POST',
                    body: formData
                })

                response = await response.json()

                console.log(response)

                if (response.ok) {
                    window.location.reload()
                }

                if (!response.ok) {
                    if (editTertiaryCategoryForm.children[0].classList.contains('alert-danger')) {
                        editTertiaryCategoryForm.children[0].textContent = response.message
                    } else {
                        let alert = document.createElement('div')
                        alert.classList.add('alert', 'alert-danger', 'text-center')
                        alert.textContent = response.message.substring(6)
                        alert.style.fontSize = '20px'
                        editTertiaryCategoryForm.prepend(alert)
                    }
                }
            })
        }
    } catch (e) { }
}