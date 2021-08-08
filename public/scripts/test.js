import {closingToast, openToast} from "./_toast";

wishListBtns.forEach(btn => {
    btn.addEventListener("click", async e => {
        const target = e.currentTarget
        if (target.classList.contains("in-wish-list")) {
            let product_id = e.currentTarget.id;
            let response = await fetch("/wishlist", {
                method: "DELETE",
                body: JSON.stringify({ product_id }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            response = await response.json()

            console.log(response)

            if (response.ok) {
                let btns = document.querySelectorAll('button.wish-list-btn');
                btns.forEach(btn => {
                    if (btn.id === target.id) {
                        btn.style.backgroundColor = "#666666"
                        btn.classList.remove("in-wish-list")
                    }
                })
                openToast("failed", "Товар удален из избранного")
                closingToast()
            }
        } else {
            let product_id = e.currentTarget.id;
            let response = await fetch("/wishlist", {
                method: "POST",
                body: JSON.stringify({ product_id }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            response = await response.json();

            if (response.ok) {
                let btns = document.querySelectorAll('button.wish-list-btn');
                btns.forEach(btn => {
                    if (btn.id === target.id) {
                        btn.style.backgroundColor = "#32386B"
                        btn.classList.add("in-wish-list")
                    }
                })
                openToast("success", "Товар добавлен в избранное")
                closingToast()
            }

            if (!response.ok) {
                openToast('failed', 'Вы не вошли в систему. Пожалуйста, войдите сначала')
                closingToast()
            }
        }
    })
})