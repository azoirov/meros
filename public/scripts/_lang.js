export default function lang() {
    let cookies = document.cookie;
    console.log("cookie");

    cookies = cookies.split("; ");

    let hasLang;

    cookies.forEach((cookie) => {
        cookie = cookie.split("=");
        if (cookie[0] === "lang") {
            lang = cookie[1] === "uz" ? "uz" : "ru";
            hasLang = true;
            return;
        }
    });

    if (!hasLang) {
        document.cookie = "lang=ru";
    }

    let languagesElement = document.querySelector(".languages");
    let languages = languagesElement.querySelectorAll("li");

    languages.forEach((language) => {
        if (language.getAttribute("language") === lang)
            language.classList.add("active");
    });

    languages.forEach((language) => {
        language.addEventListener("click", (e) => {
            document.cookie = `lang=${language.getAttribute("language")}`;
            window.location.reload();
        });
    });
}
