const fetch = require("node-fetch").default;
const FormData = require("form-data");
const config = require("../config");

const authService = async (email, password) => {
    try {
        const reqBody = new FormData();

        reqBody.append("email", email);
        reqBody.append("password", password);

        const response = await fetch("https://notify.eskiz.uz/api/auth/login", {
            method: "POST",
            body: reqBody,
        });

        const data = await response.json();
        console.log(data);
        if (response.status >= 200 && response.status < 300) {
            data.success = true;
            return data;
        }

        data.success = false;
        return data;
    } catch (error) {
        console.log(error);
    }
};

const sendSmsTo = async (phoneNumber, message) => {
    const authInfo = await authService(config.SMS_EMAIL, config.SMS_PASSWORD);
    if (!authInfo.success) {
        return authInfo;
    }

    const reqBody = new FormData();

    reqBody.append("mobile_phone", phoneNumber);
    reqBody.append("message", message);
    reqBody.append("from", 4546);

    const response = await fetch(
        "https://notify.eskiz.uz/api/message/sms/send",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authInfo.data.token}`,
            },
            body: reqBody,
        }
    );
    const data = await response.json();
    console.log(data);
    if (response.status >= 200 && response.status < 300) {
        data.success = true;
        return data;
    }

    data.success = false;
    return data;
};

// ;(async () => {
//   console.log(await sendSmsTo("998903727207", "Salom Test"));
// })()

module.exports = sendSmsTo;
