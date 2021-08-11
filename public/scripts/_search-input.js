import { selectOne, addClass, removeClass, selectAll } from './_functions'

export default function searchInput() {
    try {
        const searchInput = selectOne('.search-form__input'),
            searchingResultList = selectOne('.searching-result__ul'),
            categoriesModalOpenBtn = selectOne('.category-btn'),
            categoriesModalOpenBtnText = selectOne('.category-btn span'),
            categoriesModal = selectOne('.categories-modal')

        let searchingProductCategory = 'all'

        function searchingResultRender(arr) {
            console.log(arr)
            if (arr.length === 0) {
                searchingResultList.innerHTML = ''
                searchInput.style.cssText = `
                   border-bottom-left-radius: 5px;
                `
                return addClass(searchingResultList, 'd-none')
            }
            removeClass(searchingResultList, 'd-none')
            searchInput.style.cssText = `
                border-bottom-left-radius: 0;
            `
            searchingResultList.innerHTML = ''
            arr.forEach(item => {
                let li = document.createElement('li')
                li.classList.add('searching-result__li')
                li.innerHTML = item
                searchingResultList.append(li)
            })
        }

        searchInput.addEventListener('input', async e => {
            const searchingProductName = e.target.value.trim().toLowerCase()

            let response = await fetch(`/category/product/search?q=${searchingProductName}&category_id=${searchingProductCategory}`, {
                method: 'GET'
            })

            response = await response.json()

            let data = response.result.products

            let searchingLanguage

            data.forEach(item => {
                if (item.uz_name.indexOf(searchingProductName) !== - 1) {
                    searchingLanguage = 'uz_name'
                }

                if (item.ru_name.indexOf(searchingProductName) !== - 1) {
                    searchingLanguage = 'ru_name'
                }

                if (item.en_name.indexOf(searchingProductName) !== - 1) {
                    searchingLanguage = 'en_name'
                }
            })

            let filteredProductList = data.map(item => {
                const index = item[searchingLanguage].toLowerCase().indexOf(searchingProductName)
                return `<a class="searching-result__link" href="/product/${item.slug}">${item[searchingLanguage].substring(0, index)}<strong>${item[searchingLanguage].substr(index, searchingProductName.length)}</strong>${item[searchingLanguage].substring(index + searchingProductName.length)}`
            })

            searchingResultRender(filteredProductList)

            if (searchingProductName.length === 0) {
                addClass(searchingResultList, 'd-none')
                searchInput.style.cssText = `
                   border-bottom-left-radius: 5px;
                `
            }
        })

        const categoriesModalItems = selectAll('[data-category-modal-item]')
        categoriesModalItems.forEach(el => {
            el.addEventListener('click', e => {
                searchingProductCategory = e.currentTarget.getAttribute('data-category-modal-item')
                categoriesModalOpenBtnText.textContent = e.currentTarget.children[1].textContent
                searchInput.value = ''
                searchingResultList.innerHTML = ''
                addClass(searchingResultList, 'd-none')
                categoriesModal.classList.add('d-none')
                document.body.style.overflow = ''
            })
        })
    } catch (e) {
    }
}