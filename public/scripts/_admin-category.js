import {selectOne, selectAll, clearText} from './_functions'
import {openModal, closeModal, modalClosing} from './_modal'

export default function adminCategory() {
   try {
      const categoryCreateForm = document.getElementById('category-create-form'),
         categoryImageInput = document.getElementById('category-img'),
         categoryIconInput = document.getElementById('category-icon'),
         categoryNameUz = document.getElementById('category-name-uz'),
         categoryNameRu = document.getElementById('category-name-ru'),
         categoryNameEn = document.getElementById('category-name-en')

      categoryCreateForm.addEventListener('submit', async e => {
         e.preventDefault()

         const formData = new FormData()
         formData.append('thumb', categoryImageInput.files[0])
         formData.append('icon_thumb', categoryIconInput.files[0])
         formData.append('uz_name', clearText(categoryNameUz.value))
         formData.append('ru_name', clearText(categoryNameRu.value))
         formData.append('en_name', clearText(categoryNameEn.value))

         let response = await fetch('/admin/api/category', {
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
               <div class="alert alert-danger text-center p-2" style="font-size: 20px">${ response.message.substring(6) }</div>
               <div class="d-flex justify-content-end">
                  <button class="btn btn-primary w-25" data-modal-close>OK</button>
                </div>
            `
            openModal()
            modalClosing()
         }
      })

      const removeCategoryBtns = selectAll('[data-category-remove]')
      removeCategoryBtns.forEach(el => {
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
            removeCategory()
         })
      })

      function removeCategory() {
         const yesRemoveBtn = selectOne('[data-yes-delete]')

         yesRemoveBtn.addEventListener('click', async ev => {
            let response = await fetch('/admin/api/delete/category', {
               headers: {
                  'Content-Type': 'application/json; charset=utf-8'
               },
               method: 'POST',
               body: JSON.stringify({
                  id: ev.currentTarget.id
               })
            })
            response = await response.json()

            if (response.message) {
               window.location.reload()
            }
         })
      }

      const editCategoryBtns = selectAll('[data-category-edit]')

      editCategoryBtns.forEach(el => {
         el.addEventListener('click', async ev => {
            const id = ev.currentTarget.id,
               modalContent = selectOne('.my-modal-content')

            let response = await fetch('/admin/api/categories-id/' + id)
            let {category} = await response.json()

            modalContent.innerHTML = `
               <form id="category-edit-form">
                  <div class="row mb-3">
                      <div class="col-md-2">
                          <div class="category-img">
                              <img style="width: 100%" src="/images/categories/${category.thumb}" alt="">
                          </div>
                      </div>
                      <div class="col-md-4 ps-0">
                          <h5 class="mb-0">Update image</h5>
                          <label class="d-block">
                              <div class="text-primary">
                                  <i class="fa fa-edit"></i>
                                  Edit image
                              </div>
                              <input class="d-none" id="category-img-input" type="file" accept="image/png, image/jpeg">
                          </label>
                      </div>
                      <div class="col-md-2">
                          <div class="category-img">
                              <img src="/images/categories-icons/${category.icon_thumb}" alt="">
                          </div>
                      </div>
                      <div class="col-md-4 ps-0">
                          <h5 class="mb-0">Update icon</h5>
                          <label class="d-block">
                              <div class="text-primary">
                                  <i class="fa fa-edit"></i>
                                  Edit icon
                              </div>
                              <input class="d-none" id="category-icon-input" type="file" accept="image/svg+xml">
                          </label>
                      </div>
                  </div>
                  <label class="d-block mb-3">
                      <span class="mb-1 d-block">Category name(Uz)</span>
                      <input class="form-control" id="category-name-uz" type="text" placeholder="Category name(Uz)" value="${category.uz_name}">
                  </label>
                  <label class="d-block mb-3">
                      <span class="mb-1 d-block">Category name(Ru)</span>
                      <input class="form-control" id="category-name-ru" type="text" placeholder="Category name(Ru)" value="${category.ru_name}">
                  </label>
                  <label class="d-block mb-3">
                      <span class="mb-1 d-block">Category name(En)</span>
                      <input class="form-control" id="category-name-en" type="text" placeholder="Category name(En)" value="${category.en_name}">
                  </label>
                  <button type="button" class="btn btn-secondary w-25" data-modal-close>Cancel</button>
                  <button class="btn btn-primary w-25" id="${category.category_id}">Edit</button>
              </form>
            `
            openModal()
            modalClosing()
            editCategoryImage()
            editCategorySubmit()
         })
      })

      function editCategoryImage() {
         const categoryEditFileInputs = selectAll('#category-edit-form input[type="file"]')
         categoryEditFileInputs.forEach(el => {
            el.addEventListener('change', ev => {
               const categoryImg = ev.target.parentElement.parentElement.previousElementSibling.children[0]

               if (ev.target.files && ev.target.files[0]) {
                  let reader = new FileReader();

                  reader.onload = function (e) {
                     if (!categoryImg.children[1]) {
                        categoryImg.innerHTML += `
                          <div class="category-img-update-version" id="category-img-update-version">
                               <img style="width: 100%" src="${e.target.result}" alt="">
                               <div class="category-img-update-version-remove" id="category-img-update-version-remove">
                                   <i class="fa fa-trash"></i>
                               </div>
                           </div>
                        `
                     } else {
                        categoryImg.children[1].children[0].src = e.target.result
                     }

                     categoryImgUpdatedRemove()
                  }

                  reader.readAsDataURL(ev.target.files[0])
               }
            })
         })
      }
      
      function categoryImgUpdatedRemove() {
         const categoryImgUpdatedVersionRemoveElements = selectAll('#category-img-update-version-remove')
         console.log(categoryImgUpdatedVersionRemoveElements)
         categoryImgUpdatedVersionRemoveElements.forEach(el => {
            el.addEventListener('click', e => {
               const categoryImgFileInput = e.currentTarget.parentElement.parentElement.parentElement.nextElementSibling.children[1].children[1]
               categoryImgFileInput.value = null
               e.currentTarget.parentElement.remove()
            })
         })
      }

      function editCategorySubmit() {
         const editCategoryForm = selectOne('#category-edit-form'),
            categoryImgInput = editCategoryForm.querySelector('#category-img-input'),
            categoryIconInput = editCategoryForm.querySelector('#category-icon-input'),
            categoryNameUzInput = editCategoryForm.querySelector('#category-name-uz'),
            categoryNameRuInput = editCategoryForm.querySelector('#category-name-ru'),
            categoryNameEnInput = editCategoryForm.querySelector('#category-name-en'),
            categoryEditSubmitBtn = editCategoryForm.querySelector('.btn-primary')

         editCategoryForm.addEventListener('submit', async e => {
            e.preventDefault()

            const formData = new FormData()

            if (categoryImgInput.files[0]) {
               formData.append('thumb', categoryImgInput.files[0])
            }

            if (categoryIconInput.files[0]) {
               formData.append('icon_thumb', categoryIconInput.files[0])
            }
            formData.append('uz_name', clearText(categoryNameUzInput.value))
            formData.append('ru_name', clearText(categoryNameRuInput.value))
            formData.append('en_name', clearText(categoryNameEnInput.value))
            formData.append('category_id', categoryEditSubmitBtn.id)

            let response = await fetch('/admin/api/update/category', {
               method: 'PATCH',
               body: formData
            })
            response = await response.json()

            if (response.ok) {
               window.location.reload()
            }

            if (!response.ok) {
               if (editCategoryForm.children[0].classList.contains('alert-danger')) {
                  editCategoryForm.children[0].textContent = response.message
               } else {
                  let alert = document.createElement('div')
                  alert.classList.add('alert', 'alert-danger', 'text-center')
                  alert.textContent = response.message.substring(6)
                  alert.style.fontSize = '20px'
                  editCategoryForm.prepend(alert)
               }
            }
         })
      }
   } catch (e) {
   }
}