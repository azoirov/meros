const fetch = require("node-fetch");

module.exports = async (phone, text, code) => {
    let response = await fetch("https://notify.eskiz.uz/api/message/sms/send", {
        headers: {
            authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbm90aWZ5LmVza2l6LnV6XC9hcGlcL2F1dG" +
                "hcL2xvZ2luIiwiaWF0IjoxNjIyMTIyOTY3LCJleHAiOjE2MjQ3MTQ5NjcsIm5iZiI6MTYyMjEyMjk2NywianRpIjoiS2RCOXIxSG9FM0dLM1FmbSIsInN1YiI6N" +
                "DE0LCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.3xweACgpUQgk9jAjYkleNaBVfx2JewGS1LJpz3pYe1g",
            "content-type":
                "multipart/form-data; boundary=----WebKitFormBoundary9YpOYLbE12ykBvFv",
        },
        body: `------WebKitFormBoundary9YpOYLbE12ykBvFv\r\nContent-Disposition: form-data;
      name=\"mobile_phone\"\r\n\r\n${phone}\r\n------WebKitFormBoundary9YpOYLbE12ykBvFv\r\nContent-Disposition: form-data;
      name=\"message\"\r\n\r\n${text}${code}\r\n------WebKitFormBoundary9YpOYLbE12ykBvFv\r
      \nContent-Disposition: form-data; name=\"from\"\r\n\r\n4546\r\n------WebKitFormBoundary9YpOYLbE12ykBvFv--\r\n`,
        method: "POST",
        mode: "cors",
    });
    response = await response.json();
    return response;
};
