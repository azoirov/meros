import { selectOne, selectAll } from './_functions'
import adminCategory from './_admin-category'

export default function () {
   try {
      let categoryPaginationItems = selectAll('[data-category-page]'),
         categoriesTableBody = selectOne('#categories-table-body')

      categoryPaginationItems.forEach(el => {
         el.addEventListener('click', async ev => {
            categoryPaginationItems.forEach(el => el.classList.remove('active'))
            ev.currentTarget.classList.add('active')
            let response = await fetch(`/admin/api/categories?c_page=${ev.target.getAttribute('data-category-page')}&p_page=10`, {
               method: 'GET'
            })
            response = await response.json()
            categoriesTableBody.innerHTML = ''
            response.result.categories.forEach(category => {
               categoriesTableBody.innerHTML += `
                  <tr>
                     <td>
                         <ul>
                             <li class="category-name__li">
                                 <strong>uz</strong>
                                 <span class="category-name__decoration"></span>
                                 <span>${category.uz_name}</span>
                             </li>
                             <li class="category-name__li">
                                 <strong>ru</strong>
                                 <span class="category-name__decoration"></span>
                                 <span>${category.ru_name}</span>
                             </li>
                             <li class="category-name__li">
                                 <strong>en</strong>
                                 <span class="category-name__decoration"></span>
                                 <span>${category.en_name}</span>
                             </li>
                         </ul>
                     </td>
                     <td class="text-center" style="width: 150px">
                         <img class="w-50" src="/images/categories/${category.thumb}" alt="">
                     </td>
                     <td class="text-center" style="width: 150px">
                         <img class="w-25" src="/images/categories-icons/${category.icon_thumb}" alt="">
                     </td>
                     <td>
                         /categories/${category.slug}
                     </td>
                     <td style="width: 110px">
                         <button class="btn btn-primary" data-category-edit id="${category.category_id}">
                             <i class="fa fa-edit"></i>
                         </button>
                         <button class="btn btn-danger" data-category-remove id="${category.category_id}" data-category-remove>
                             <i class="fa fa-trash"></i>
                         </button>
                     </td>
                 </tr>
               `
            })
            adminCategory()
         })
      })
      return response
   } catch (e) {}
}