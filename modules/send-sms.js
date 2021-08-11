const fetch = require("node-fetch");

module.exports = async (phone, text, code) => {
    let response = await fetch("https://notify.eskiz.uz/api/message/sms/send", {
        headers: {
            authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9ub3RpZnkuZXNraXoudXpcL2FwaVwvYXV0aFwvbG9naW4iLCJpYXQiOjE2Mjg1ODk3MTksImV4cCI6MTYzMTE4MTcxOSwibmJmIjoxNjI4NTg5NzE5LCJqdGkiOiJ2ZWxmQzFtZDFuTlBHSW9mIiwic3ViIjo1LCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.ASkDdh-ujq-KH99sGCPofEuF22hhyYyw9GqCeMblVgU",
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
    console.log(response)
    return response;
};
