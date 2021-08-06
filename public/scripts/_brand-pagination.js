import { selectOne, selectAll } from './_functions'
import adminBrand from './_admin-brand'

export default function () {
   try {
      let brandPaginationItems = selectAll('[data-brand-page]'),
         brandsTableBody = selectOne('#brands-table-body')

      brandPaginationItems.forEach(el => {
         el.addEventListener('click', async ev => {
            brandPaginationItems.forEach(el => el.classList.remove('active'))
            ev.currentTarget.classList.add('active')
            let response = await fetch(`/admin/api/brands?c_page=${ev.target.getAttribute('data-brand-page')}&p_page=10`, {
               method: 'GET'
            })
            response = await response.json()

            brandsTableBody.innerHTML = ''
            response.result.brands.forEach(brand => {
               brandsTableBody.innerHTML += `
                  <tr>
                     <td>
                         ${ brand.brand_name.toUpperCase() }
                     </td>
                     <td class="text-center" style="width: 200px">
                         <img class="w-50" src="/images/catalog-brands/${brand.brand_thumb}" alt="">
                     </td>
                     <td>
                        ${ brand['category.slug'] }
                     </td>
                     <td>
                         <a href="${brand.brand_site}">${brand.brand_site}</a>
                     </td>
                     <td style="width: 110px">
                         <button class="btn btn-primary" data-brand-edit id="${brand.brand_id}">
                             <i class="fa fa-edit"></i>
                         </button>
                         <button class="btn btn-danger" data-brand-remove id="${brand.brand_id}">
                             <i class="fa fa-trash"></i>
                         </button>
                     </td>
                 </tr>
               `
            })
            adminBrand()
         })
      })
      return response
   } catch (e) {}
}