import bcrypt from "bcryptjs"
export const data = {
    products: [
        {
            featured: [
                {
                name: "Fc Derby",
                img: "https://media.kohlsimg.com/is/image/kohls/5561921?wid=240&hei=240&op_sharpen=1",
                price: 660,
                inStock: 22,
                ratings: 3.8,
                // _id: 1
                },
                {
                    name: "Fc Geology",
                    img: "https://th.bing.com/th/id/R.39257a464a9a3bba49e4ed7ae3dca8cd?rik=4YmmDRU9TTVneA&pid=ImgRaw&r=0",
                    price: 660,
                    inStock: 3,
                    ratings: 1.8,
                    categories: "pants"
                    // _id: 2
                },
                {
                    name: "Fc RiminGata",
                    img: "https://media.kohlsimg.com/is/image/kohls/5561921?wid=240&hei=240&op_sharpen=1",
                    price: 460,
                    inStock: 20,
                    ratings: 2.8,
                    category: "shirts"
                    // _id: 3
                }
            ]
        },
        {
            productss:[
                {
                    category: "shirts",
                    name: "Fc Derby",
                    img: "https://th.bing.com/th/id/R.39257a464a9a3bba49e4ed7ae3dca8cd?rik=4YmmDRU9TTVneA&pid=ImgRaw&r=0",
                    price: 9660,
                    inStock: 22,
                    ratings: 3.8,
                    // _id: 1
                    },
                    {
                        name: "Fc Geology",
                        img: "https://th.bing.com/th/id/R.39257a464a9a3bba49e4ed7ae3dca8cd?rik=4YmmDRU9TTVneA&pid=ImgRaw&r=0",
                        price: 6630,
                        inStock: 15,
                        ratings: 1.8,
                        category: "pants",
                        // _id: 2
                    },
                    {
                        name: "Fc RiminGata",
                        img: "https://th.bing.com/th/id/R.39257a464a9a3bba49e4ed7ae3dca8cd?rik=4YmmDRU9TTVneA&pid=ImgRaw&r=0",
                        price: 22260,
                        inStock: 20,
                        ratings: 2.8,
                        category: "socks",
                        // _id: 3
                    },
                    {
                        name: "Fc RiminGata",
                        img: "https://th.bing.com/th/id/R.39257a464a9a3bba49e4ed7ae3dca8cd?rik=4YmmDRU9TTVneA&pid=ImgRaw&r=0",
                        price: 22260,
                        inStock: 0,
                        ratings: 2.8,
                        category: "gloves",
                        // _id: 8
                    },
                    {
                        category: "shirts",
                        name: "t-shirt",
                        img: "https://th.bing.com/th/id/R.39257a464a9a3bba49e4ed7ae3dca8cd?rik=4YmmDRU9TTVneA&pid=ImgRaw&r=0",
                        price: 1000,
                        inStock: 20,
                        ratings: 3.9,
                        
                        // _id: 4
                        },
                        {
                            name: "Mubleen watch",
                            img: "https://th.bing.com/th/id/R.39257a464a9a3bba49e4ed7ae3dca8cd?rik=4YmmDRU9TTVneA&pid=ImgRaw&r=0",
                            price: 13460,
                            inStock: 13,
                            ratings: 4.8,
                            category: "pants",
                            // _id: 5
                        },
            ]
        }
    ],
    users: [
        {
            name: "Zaki",
            password: bcrypt.hashSync("4444"),
            email: "zaki@gmail.com",
            isAdmin: true
        },
        {
            name: "Yusuf",
            password: bcrypt.hashSync("2222"),
            email: "yusuf@gmail.com",
            isAdmin: false
        },
        {
            name: "Aliyu JMB",
            password: bcrypt.hashSync("1111"),
            email: "jmb@jmb.com",
            isAdmin: false
        }
    ]
}