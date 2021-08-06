module.exports = {
    openapi: "3.0.3",
    info: {
        title: "Meros API",
        description: "Meros shop API Documentation",
        version: "1.0.0",
        contact: {
            name: "Asadbek",
        },
    },
    apis: ["**/*Route.js"],
    paths: {
        "/users/signup": {
            post: {
                summary: "Register New User",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    phone: {
                                        type: "string",
                                    },
                                    name: {
                                        type: "string",
                                    },
                                    email: {
                                        type: "string",
                                    },
                                },
                                example: {
                                    phone: "998990000000",
                                    name: "Toshmat",
                                    email: "username@site.com",
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "User Created",
                    },
                    400: {
                        description: "User did not created",
                    },
                    500: {
                        description: "Internal server error",
                    },
                },
            },
        },
        "/users/check-phone": {
            post: {
                summary: "Check user phone number validation",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    phone: {
                                        type: "string",
                                    },
                                },
                                example: {
                                    phone: "998990000000",
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Phone number is valid (exist)",
                    },
                    500: {
                        description: "Internal server error",
                    },
                },
            },
        },

        "/users/login": {
            post: {
                summary: "Login User with sending sms to user phone number",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    phone: {
                                        type: "string",
                                    },
                                },
                                example: {
                                    phone: "998990000000",
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Code sent to user",
                    },
                    401: {
                        description: "Code  not sent to user",
                    },
                    500: {
                        description: "Internal server error",
                    },
                },
            },
        },
        "/users/validate-code": {
            post: {
                summary: "Validate sent code to user",
                parameters: [
                    {
                        in: "header",
                        required: true,
                        name: "code-Validation-Id",
                        value: "92bd06bb-0996-4976-acc8-ff9e26c1990d",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    code: {
                                        type: "string",
                                    },
                                },
                                example: {
                                    code: "208547",
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Code is valid",
                    },
                    401: {
                        description: "Code is invalid",
                    },
                    500: {
                        description: "Internal server error",
                    },
                },
            },
        },
    },
};
