import {selectOne, selectAll} from './_functions'

export default function () {
    try {
        const productMakeBestsellerBtns = selectAll('[data-product-bestseller]'),
            productMakeRecommendationBtns = selectAll('[data-product-recommendation]')

        productMakeRecommendationBtns.forEach(el => {
            el.addEventListener('click', async e => {
                const target = e.currentTarget
                const id = e.currentTarget.id

                if (target.classList.contains('btn-outline-success')) {
                    let response = await fetch('/admin/products/recommendations-add', {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            product_id: id
                        })
                    })
                    response = await response.json()

                    if (response.ok) {
                        target.classList.remove('btn-outline-success')
                        target.classList.add('btn-success')
                    }
                } else {
                    let response = await fetch('/admin/products/recommendations-remove', {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            product_id: id
                        })
                    })
                    response = await response.json()

                    if (response.ok) {
                        target.classList.remove('btn-success')
                        target.classList.add('btn-outline-success')
                    }
                }
            })
        })

        productMakeBestsellerBtns.forEach(el => {
            el.addEventListener('click', async e => {
                const target = e.currentTarget
                const id = e.currentTarget.id

                if (target.classList.contains('btn-outline-info')) {
                    let response = await fetch('/admin/products/bestseller-add', {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            product_id: id
                        })
                    })
                    response = await response.json()

                    if (response.ok) {
                        target.classList.remove('btn-outline-info')
                        target.classList.add('btn-info')
                    }
                } else {
                    let response = await fetch('/admin/products/bestseller-remove', {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            product_id: id
                        })
                    })
                    response = await response.json()

                    if (response.ok) {
                        target.classList.remove('btn-info')
                        target.classList.add('btn-outline-info')
                    }
                }
            })
        })

        const removeFromBestsellerBtns = selectAll('[data-remove-bestseller]'),
            removeFromRecommendationBtns = selectAll('[data-remove-recommendation]')

        removeFromBestsellerBtns.forEach(el => {
            el.addEventListener('click', async e => {
                const id = e.currentTarget.id
                let response = await fetch('/admin/products/bestseller-remove', {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        product_id: id
                    })
                })
                response = await response.json()

                if (response.ok) {
                    window.location.reload()
                }
            })
        })

        removeFromRecommendationBtns.forEach(el => {
            el.addEventListener('click', async e => {
                const id = e.currentTarget.id
                let response = await fetch('/admin/products/recommendations-remove', {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        product_id: id
                    })
                })
                response = await response.json()

                console.log(response)

                if (response.ok) {
                    window.location.reload()
                }
            })
        })
    } catch (e) {
        console.log(e)
    }
}