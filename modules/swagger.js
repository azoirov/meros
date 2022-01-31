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
        "/mobile-banners":{
            get:{
                summary:"get banners",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    ok: {
                                        type: "Boolean",
                                    },
                                    banners:{
                                        type:"Object"
                                    }

                                },
                                example: {
                                    ok: true,
                                    banners:{}
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"get banners succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
        "/mobile-user":{
            get:{
                summary:"get banners",
                parameters:[{
                    "in":"header",
                    required:true,
                    name:"Authorization",
                    value:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3NDMxNDJmLTEzMDUtNGRhMy1hNTQxLWM1MTEwYjVjZGFhYSIsImlhdCI6MTYyMjg1NTgwNX0.lyj6SvyBlpdZ2OrJN1GInnXsRRXhZty2Rj1xoT_2nwI",
                    schema:{
                        type:"string",
                    }
                }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    ok: {
                                        type: "Boolean",
                                    },
                                    user:{
                                        type:"Object"
                                    }

                                },
                                example: {
                                    ok: true,
                                    user:{}
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"get user succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
        "/mobile-rec":{
            get:{
                summary:"get banners",  
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    ok: {
                                        type: "Boolean",
                                    },
                                    recommendation:{
                                        type:"Array"
                                    }

                                },
                                example: {
                                    ok: true,
                                    recommendation:[]
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"get recommendation succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
        "/mobile-sale":{
            get:{
                summary:"get products",  
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    ok: {
                                        type: "Boolean",
                                    },
                                    sale:{
                                        type:"Array"
                                    }

                                },
                                example: {
                                    ok: true,
                                    sale:[]
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"get sale succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
        "/product/one/:product_id":{
            get:{
                summary:"get one product",  
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    ok: {
                                        type: "Boolean",
                                    },
                                    product:{
                                        type:"Object"
                                    },
                                    comments:{
                                        type:"Array"
                                    },

                                },
                                example: {
                                    ok: true,
                                    product:{},
                                    comments:[]
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"get sale succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
        "/mobile-best":{
            get:{
                summary:"get bestsellers",  
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    ok: {
                                        type: "Boolean",
                                    },
                                    bestsellers:{
                                        type:"Array"
                                    }

                                },
                                example: {
                                    ok: true,
                                    bestsellers:[]
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"get bestsellers succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
        "/cart/api/minus":{
            patch:{
                summary:"to minus product from own basket",
                parameters:[{
                    "in":"header",
                    required:true,
                    name:"Authorization",
                    value:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3NDMxNDJmLTEzMDUtNGRhMy1hNTQxLWM1MTEwYjVjZGFhYSIsImlhdCI6MTYyMjg1NTgwNX0.lyj6SvyBlpdZ2OrJN1GInnXsRRXhZty2Rj1xoT_2nwI",
                    schema:{
                        type:"string",
                    }
                }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    product_id:{
                                        type:"string"
                                    }
                                },
                                example: {
                                    product_id: "2a15ad09-84e1-4fa5-bfbe-5f3d36f2b948",
                                    
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
        "/cart/api/plus":{
            patch:{
                summary:"to plus product in own basket",
                parameters:[{
                    "in":"header",
                    required:true,
                    name:"Authorization",
                    value:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3NDMxNDJmLTEzMDUtNGRhMy1hNTQxLWM1MTEwYjVjZGFhYSIsImlhdCI6MTYyMjg1NTgwNX0.lyj6SvyBlpdZ2OrJN1GInnXsRRXhZty2Rj1xoT_2nwI",
                    schema:{
                        type:"string",
                    }
                }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    product_id:{
                                        type:"string"
                                    }

                                },
                                example: {
                                    product_id: "2a15ad09-84e1-4fa5-bfbe-5f3d36f2b948",
                                    
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
        "/cart/add":{
            post:{
                summary:"to add product in own basket",
                parameters:[{
                    "in":"header",
                    required:true,
                    name:"Authorization",
                    value:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3NDMxNDJmLTEzMDUtNGRhMy1hNTQxLWM1MTEwYjVjZGFhYSIsImlhdCI6MTYyMjg1NTgwNX0.lyj6SvyBlpdZ2OrJN1GInnXsRRXhZty2Rj1xoT_2nwI",
                    schema:{
                        type:"string",
                    }
                }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    product_id:{
                                        type:"string"
                                    }

                                },
                                example: {
                                    product_id: "2a15ad09-84e1-4fa5-bfbe-5f3d36f2b948",
                                    
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
        "/wishlist":{
            post:{
                summary:"to add product to wishlist",
                parameters:[{
                    "in":"header",
                    required:true,
                    name:"Authorization",
                    value:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3NDMxNDJmLTEzMDUtNGRhMy1hNTQxLWM1MTEwYjVjZGFhYSIsImlhdCI6MTYyMjg1NTgwNX0.lyj6SvyBlpdZ2OrJN1GInnXsRRXhZty2Rj1xoT_2nwI",
                    schema:{
                        type:"string",
                    }
                }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    product_id:{
                                        type:"string"
                                    }

                                },
                                example: {
                                    product_id: "2a15ad09-84e1-4fa5-bfbe-5f3d36f2b948",
                                    
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
        "/wishlist":{
            delete:{
                summary:"to delete product from wishlist",
                parameters:[{
                    "in":"header",
                    required:true,
                    name:"Authorization",
                    value:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3NDMxNDJmLTEzMDUtNGRhMy1hNTQxLWM1MTEwYjVjZGFhYSIsImlhdCI6MTYyMjg1NTgwNX0.lyj6SvyBlpdZ2OrJN1GInnXsRRXhZty2Rj1xoT_2nwI",
                    schema:{
                        type:"string",
                    }
                }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    product_id:{
                                        type:"string"
                                    }

                                },
                                example: {
                                    product_id: "2a15ad09-84e1-4fa5-bfbe-5f3d36f2b948",
                                    
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
        "/comment":{
            post:{
                summary:"to comment for product",
                parameters:[{
                    "in":"header",
                    required:true,
                    name:"Authorization",
                    value:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3NDMxNDJmLTEzMDUtNGRhMy1hNTQxLWM1MTEwYjVjZGFhYSIsImlhdCI6MTYyMjg1NTgwNX0.lyj6SvyBlpdZ2OrJN1GInnXsRRXhZty2Rj1xoT_2nwI",
                    schema:{
                        type:"string",
                    }
                }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    comment_text:{
                                        type:"string"
                                    },
                                    product_id:{
                                        type:"string"
                                    },
                                    star:{
                                        type:"number"
                                    },

                                },
                                example: {
                                    comment_text:"a good product",
                                    product_id: "2a15ad09-84e1-4fa5-bfbe-5f3d36f2b948",
                                    star:5
                                },
                            },
                        },
                    },
                },
                responses:{
                    '200':{
                        description:"succes",
                    },
                    '400':{
                        description:"some error"
                    },
                    '500':{
                        description:"Internal server error"
                    }
                }
            },
            
        },
    },
};
