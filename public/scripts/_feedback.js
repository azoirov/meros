import {selectOne, selectAll} from './_functions'

export default function () {
    try {
        const feedbackModalRating = selectOne('.feedback-modal__rating'),
            feedbackModal = selectOne('.feedback-modal'),
            feedbackForm = selectOne('.feedback-modal__form'),
            feedbackRatingInput = selectOne('.feedback-modal__rating-number'),
            feedbackTextField = selectOne('.feedback-modal__textarea'),
            feedbackModalOpener = selectOne('#feedback-modal-opener'),
            feedbackModalCloser = selectOne('#feedback-modal-closer')
        feedbackModalOpener.addEventListener('click', e => {
            feedbackModal.classList.remove('d-none')
            document.body.style.overflow = 'hidden'
        })
        feedbackModalCloser.addEventListener('click', e => {
            feedbackModal.classList.add('d-none')
            document.body.style.overflow = ''
        })

        for (let i = 0; i < 5; i++) {
            feedbackModalRating.innerHTML += `
                <svg class="feedback-modal__rating-star" width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.3715 18.4706L13.9722 18.1933L13.5729 18.4706L7.05553 22.9967C6.76892 23.1956 6.5671 23.2735 6.43641 23.294C6.33331 23.3102 6.26883 23.2937 6.20089 23.2482C6.13167 23.1968 6.10477 23.1487 6.09225 23.0771C6.07519 22.9797 6.08118 22.7952 6.19273 22.489L6.19278 22.489L6.19553 22.4811L8.74261 15.2214L8.92063 14.714L8.47625 14.4112L1.91192 9.93828L1.91167 9.93811C1.62669 9.7441 1.49631 9.59029 1.44436 9.49319C1.4072 9.42372 1.40815 9.38718 1.42766 9.33271L1.42896 9.32902C1.44805 9.27475 1.48039 9.22589 1.57841 9.17748C1.69507 9.11986 1.90724 9.06524 2.25944 9.069L2.26303 9.06902L10.3163 9.11339L10.8215 9.11617L10.9833 8.63755L13.4461 1.35126L13.4466 1.34956C13.5523 1.03426 13.6653 0.869252 13.7502 0.78874C13.8181 0.724405 13.8799 0.7 13.9722 0.7C14.0645 0.7 14.1263 0.724406 14.1942 0.78874C14.2791 0.869253 14.3921 1.03426 14.4977 1.34956L14.4983 1.35126L16.9611 8.63755L17.1229 9.11617L17.6281 9.11339L25.6813 9.06903L25.6849 9.06899C26.043 9.06522 26.2541 9.12023 26.3683 9.1769C26.4625 9.22363 26.4951 9.27113 26.5154 9.32903L26.5167 9.3327C26.5362 9.38718 26.5372 9.42372 26.5 9.49319C26.4481 9.59029 26.3177 9.7441 26.0327 9.93811L26.0324 9.93828L19.4681 14.4112L19.0232 14.7144L19.202 15.2222L21.7584 22.4816C21.7584 22.4817 21.7584 22.4818 21.7585 22.4819C21.8664 22.7887 21.8717 22.9746 21.8538 23.0741C21.8404 23.1488 21.8119 23.1981 21.7409 23.2501C21.6808 23.2919 21.619 23.3109 21.511 23.2939C21.3782 23.2732 21.174 23.1946 20.889 22.9968C20.8889 22.9967 20.8889 22.9967 20.8888 22.9967L14.3715 18.4706Z"
                        stroke="" stroke-width="1.4"/>
                </svg>
            `
        }

        const feedbackModalRatingStars = selectAll('.feedback-modal__rating-star')

        feedbackModalRatingStars.forEach((item, index) => {
            item.addEventListener('click', e => {
                for (let i = 0; i < 5; i++) {
                    feedbackModalRatingStars[i].classList.remove('active')
                }
                for (let i = 0; i <= index; i++) {
                    feedbackModalRatingStars[i].classList.add('active')
                }
                feedbackRatingInput.value = index + 1
            })
        })

        feedbackForm.addEventListener('submit', async e => {
            e.preventDefault()
            let star = feedbackRatingInput.value

            if (isNaN(feedbackRatingInput.value) || feedbackRatingInput.value < 0) {
                star = 0
            }

            if (feedbackRatingInput.value > 5) {
                star = 5
            }
            let response = await fetch('/category/product/comment', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                method: 'POST',
                body: JSON.stringify({
                    comment_text: feedbackTextField.value.trim(),
                    product_id: e.currentTarget.id,
                    star
                })
            })
            response = await response.json()

            if (response.ok) {
                window.location.reload()
            }
        })
    } catch (e) {}
}