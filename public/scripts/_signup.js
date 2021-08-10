import { selectOne, fetchFunction } from "./_functions";

export default async function () {
  try {
    const signupForm = selectOne("#signup-form"),
      signupPhoneInput = signupForm.querySelector("#phone"),
      signupNameInput = signupForm.querySelector("#name"),
      signupEmailInput = signupForm.querySelector("#email"),
      signupSubmit = signupForm.querySelector(".button-blue");

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      signupSubmit.setAttribute("data-loading", true);
      signupSubmit.setAttribute("disabled", true);

      let response = await fetchFunction("/users/signup", "POST", {
        phone: signupPhoneInput.value.substring(1).replace(/ /g, ""),
        name: signupNameInput.value.trim(),
        email: signupEmailInput.value.trim().toLowerCase(),
      });

      if (response.ok) {
        window.location.href = "/users/login";
      }

      if (!response.ok) {
        signupSubmit.removeAttribute("data-loading");
        signupSubmit.setAttribute("disabled", true);

        let errorMessage;

        switch (response.message) {
          case "Error: invalid phone":
            errorMessage = "Введен неправильный номер";
            break;
          case "Error: Invalid name":
            errorMessage = "Введен неправильное имя";
            break;
          case "Error: Invalid email":
            errorMessage = "Введен неправильный адрес электронной почты";
            break;
          case "Error: User has already been registered":
            errorMessage =
              "Вы уже зарегистрировались под этим номером. Пожалуйста, войдите";
            break;
        }

        if (!signupForm.firstElementChild.classList.contains("alert-danger")) {
          let alertDanger = document.createElement("div");
          alertDanger.classList.add("alert-danger");
          alertDanger.textContent = errorMessage;
          signupForm.prepend(alertDanger);
        } else {
          signupForm.firstElementChild.textContent = errorMessage;
        }
      }
    });
  } catch (e) {}
}
