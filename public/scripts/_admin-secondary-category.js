import {selectOne, selectAll, clearText} from './_functions'
import {openModal, modalClosing} from './_modal'

export default function () {
    try {
        const secondaryCategoryCreateForm = document.getElementById('secondary-category-create-form'),
            secondaryCategoryImageInput = document.getElementById('secondary-category-img'),
            secondaryCategorySelectCategories = document.getElementById('secondary-category-categories'),
            secondaryCategoryNameUz = document.getElementById('secondary-category-name-uz'),
            secondaryCategoryNameRu = document.getElementById('secondary-category-name-ru'),
            secondaryCategoryNameEn = document.getElementById('secondary-category-name-en')

        secondaryCategoryCreateForm.addEventListener('submit', async e => {
            e.preventDefault()

            const formData = new FormData()
            formData.append('sub_category_image', secondaryCategoryImageInput.files[0])
            formData.append('category_id', secondaryCategorySelectCategories.value)
            formData.append('sub_category_name_uz', clearText(secondaryCategoryNameUz.value))
            formData.append('sub_category_name_en', clearText(secondaryCategoryNameEn.value))
            formData.append('sub_category_name_ru', clearText(secondaryCategoryNameRu.value))

            let response = await fetch('/admin/secondary-categories', {
                method: 'POST',
                body: formData
            })
            response = await response.json()

            console.log(response)

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

        const removeSecondaryCategoryBtns = selectAll('[data-secondary-category-remove]')
        removeSecondaryCategoryBtns.forEach(el => {
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
                removeSecondaryCategory()
            })
        })

        function removeSecondaryCategory() {
            const yesRemoveBtn = selectOne('[data-yes-delete]')

            yesRemoveBtn.addEventListener('click', async ev => {
                let response = await fetch('/admin/secondary-categories/delete', {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        sub_category_id: ev.currentTarget.id
                    })
                })
                response = await response.json()

                if (response.message) {
                    window.location.reload()
                }
            })
        }

        const editSecondaryCategoryBtns = selectAll('[data-secondary-category-edit]')

        editSecondaryCategoryBtns.forEach(el => {
            el.addEventListener('click', async ev => {
                const id = ev.currentTarget.id,
                    modalContent = selectOne('.my-modal-content')

                let response = await fetch('/admin/secondary-categories/' + id)
                const {sub_category, categories} = await response.json()

                let options = ''

                categories.forEach(c => {
                    if (c.category_id === sub_category['category.category_id']) {
                        options += `<option value="${c.category_id}" selected>${c.slug}</option>`
                    }
                    options += `<option value="${c.category_id}">${c.slug}</option>`
                })

                modalContent.innerHTML = `
                   <form id="secondary-category-edit-form">
                      <div class="row mb-3">
                          <div class="col-md-2">
                              <div class="category-img">
                                  <img style="width: 100%" src="/images/sub_categories/${sub_category.sub_category_image}" alt="">
                              </div>
                          </div>
                          <div class="col-md-4 ps-0">
                              <h5 class="mb-0">Update image</h5>
                              <label class="d-block">
                                  <div class="text-primary">
                                      <i class="fa fa-edit"></i>
                                      Edit image
                                  </div>
                                  <input class="d-none" id="secondary-category-img-input" type="file" accept=".png, .jpeg, .jpg">
                              </label>
                          </div>
                      </div>
                      <label class="d-block mb-3">
                          <span class="mb-1 d-block">Categories list</span>
                          <select class="form-control" id="secondary-category-select">
                                ${options}
                          </select>
                      </label>
                      <label class="d-block mb-3">
                          <span class="mb-1 d-block">Secondary category name(Uz)</span>
                          <input class="form-control" id="secondary-category-name-uz" type="text" placeholder="Secondary category name(Uz)" value="${sub_category.sub_category_name_uz}">
                      </label>
                      <label class="d-block mb-3">
                          <span class="mb-1 d-block">Secondary category name(Ru)</span>
                          <input class="form-control" id="secondary-category-name-ru" type="text" placeholder="Secondary category name(Ru)" value="${sub_category.sub_category_name_ru}">
                      </label>
                      <label class="d-block mb-3">
                          <span class="mb-1 d-block">Secondary category name(En)</span>
                          <input class="form-control" id="secondary-category-name-en" type="text" placeholder="Secondary category name(En)" value="${sub_category.sub_category_name_en}">
                      </label>
                      <button type="button" class="btn btn-secondary w-25" data-modal-close>Cancel</button>
                      <button class="btn btn-primary w-25" id="${sub_category.sub_category_id}">Edit</button>
                  </form>
                `
                openModal()
                modalClosing()
                editSecondaryCategoryImage()
                editSecondaryCategorySubmit()
            })
        })

        function editSecondaryCategoryImage() {
            const secondaryCategoryEditFileInputs = selectAll('#secondary-category-edit-form input[type="file"]')
            secondaryCategoryEditFileInputs.forEach(el => {
                el.addEventListener('change', ev => {
                    const secondaryCategoryImg = ev.target.parentElement.parentElement.previousElementSibling.children[0]

                    if (ev.target.files && ev.target.files[0]) {
                        let reader = new FileReader();

                        reader.onload = function (e) {
                            if (!secondaryCategoryImg.children[1]) {
                                secondaryCategoryImg.innerHTML += `
                                  <div class="category-img-update-version" id="category-img-update-version">
                                       <img style="width: 100%" src="${e.target.result}" alt="">
                                       <div class="category-img-update-version-remove" id="secondary-category-img-update-version-remove">
                                           <i class="fa fa-trash"></i>
                                       </div>
                                   </div>
                                `
                            } else {
                                secondaryCategoryImg.children[1].children[0].src = e.target.result
                            }

                            secondaryCategoryImgUpdatedRemove()
                        }

                        reader.readAsDataURL(ev.target.files[0])
                    }
                })
            })
        }

        function secondaryCategoryImgUpdatedRemove() {
            const secondaryCategoryImgUpdatedVersionRemoveElements = selectAll('#secondary-category-img-update-version-remove')
            secondaryCategoryImgUpdatedVersionRemoveElements.forEach(el => {
                el.addEventListener('click', e => {
                    const secondaryCategoryImgFileInput = e.currentTarget.parentElement.parentElement.parentElement.nextElementSibling.children[1].children[1]
                    secondaryCategoryImgFileInput.value = null
                    e.currentTarget.parentElement.remove()
                })
            })
        }

        function editSecondaryCategorySubmit() {
            const editSecondaryCategoryForm = selectOne('#secondary-category-edit-form')

            editSecondaryCategoryForm.addEventListener('submit', async e => {
                e.preventDefault()

                const secondaryCategoryImgInput = editSecondaryCategoryForm.querySelector('#secondary-category-img-input'),
                    secondaryCategorySelect = editSecondaryCategoryForm.querySelector('#secondary-category-select'),
                    secondaryCategoryNameUzInput = editSecondaryCategoryForm.querySelector('#secondary-category-name-uz'),
                    secondaryCategoryNameRuInput = editSecondaryCategoryForm.querySelector('#secondary-category-name-ru'),
                    secondaryCategoryNameEnInput = editSecondaryCategoryForm.querySelector('#secondary-category-name-en'),
                    secondaryCategoryEditSubmitBtn = editSecondaryCategoryForm.querySelector('.btn-primary')

                let formData = new FormData()

                if (secondaryCategoryImgInput.files[0]) {
                    formData.append('sub_category_image', secondaryCategoryImgInput.files[0])
                }

                formData.append('category_id', secondaryCategorySelect.value)
                formData.append('sub_category_name_uz', clearText(secondaryCategoryNameUzInput.value))
                formData.append('sub_category_name_ru', clearText(secondaryCategoryNameRuInput.value))
                formData.append('sub_category_name_en', clearText(secondaryCategoryNameEnInput.value))
                formData.append('sub_category_id', secondaryCategoryEditSubmitBtn.id)

                let response = await fetch('/admin/secondary-categories/update', {
                    method: 'POST',
                    body: formData
                })

                response = await response.json()

                if (response.ok) {
                    window.location.reload()
                }

                if (!response.ok) {
                    if (editSecondaryCategoryForm.children[0].classList.contains('alert-danger')) {
                        editSecondaryCategoryForm.children[0].textContent = response.message
                    } else {
                        let alert = document.createElement('div')
                        alert.classList.add('alert', 'alert-danger', 'text-center')
                        alert.textContent = response.message.substring(6)
                        alert.style.fontSize = '20px'
                        editSecondaryCategoryForm.prepend(alert)
                    }
                }
            })
        }
    } catch (e) {  }
}