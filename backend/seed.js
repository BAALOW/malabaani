const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
    { name:"Pizza", urlImage:"https://i.pinimg.com/736x/3e/c9/fe/3ec9fe32c6217014789b5f42e2343f47.jpg", price:10, category:"fastfood" },
    { name:"Burger", urlImage:"https://i.pinimg.com/736x/04/21/07/04210725ae30e4435fff7d04c122507e.jpg", price:5, category:"fastfood" },
    { name:"Fries", urlImage:"https://i.pinimg.com/736x/23/1a/5a/231a5a17a219341fb8ec95e519c19c49.jpg", price:3, category:"fastfood" },
    { name:"pasta", urlImage:"https://i.pinimg.com/736x/0a/3c/a4/0a3ca4ab1c1660a154b5a468bfeb99d8.jpg", price:8, category:"fastfood" },
    { name:"shuwarma", urlImage:"https://i.pinimg.com/1200x/80/c8/c6/80c8c60ea7a54c4d6479b970bbddded2.jpg", price:6, category:"fastfood" },
    { name:"salad", urlImage:"https://i.pinimg.com/1200x/56/fb/3f/56fb3f0a81ab2a5fef185f774365ef82.jpg", price:4, category:"fastfood" },
    { name:"chicken", urlImage:"https://i.pinimg.com/1200x/02/01/60/02016082a6fde6123fde3e6ff9fe9f84.jpg", price:12, category:"fastfood" },
    { name:"steak", urlImage:"https://i.pinimg.com/1200x/f1/11/43/f11143857989c1d45dd3d386fa2e60f5.jpg", price:15, category:"fastfood" },
    { name:"fish", urlImage:"https://i.pinimg.com/1200x/8c/b8/1a/8cb81add7b80532f3cfb45680872543c.jpg", price:9, category:"fastfood" },
    { name:"rice", urlImage:"https://i.pinimg.com/736x/5c/98/87/5c9887b1e624bcf5e00789227ca628de.jpg", price:7, category:"fastfood" },
    { name:"noodles", urlImage:"https://i.pinimg.com/1200x/85/09/10/850910eeb1283265cdded6dc94107ba4.jpg", price:6, category:"fastfood" },
    { name:"soup", urlImage:"https://i.pinimg.com/1200x/03/d1/61/03d16168720ee8eca04c95830e16799b.jpg", price:5, category:"fastfood" },
    { name:"cambuulo", urlImage:"https://i.pinimg.com/736x/b6/58/14/b65814787f04dc884fd3a7c47e71c61a.jpg", price:4, category:"fastfood" },
    { name:"sambusa", urlImage:"https://i.pinimg.com/1200x/f3/ca/bf/f3cabf7162f9ab499190b36f2eec838f.jpg", price:0.25, category:"fastfood" },
    { name:"beer", urlImage:"https://i.pinimg.com/736x/e5/1f/d5/e51fd563b3546cefd52f9684cc675072.jpg", price:3, category:"fastfood" },
    { name:"sandwich", urlImage:"https://i.pinimg.com/1200x/32/ee/39/32ee39b12bf192c100f096f1c4f5bf27.jpg", price:4, category:"fastfood" },
    { name:"hotdog", urlImage:"https://i.pinimg.com/736x/0b/34/66/0b3466b52c42deea1b412cf8afbf51af.jpg", price:3, category:"fastfood" },
    { name:"eggs", urlImage:"https://i.pinimg.com/736x/91/5d/eb/915deb45803c0e600e7fbc9832d78daa.jpg", price:2, category:"fastfood" },
    { name:"Coke", urlImage:"https://i.pinimg.com/736x/b6/95/c3/b695c35d2feeba11ec91c563c9d353c4.jpg", price:1, category:"drinks" },
    { name:"Pepsi", urlImage:"https://i.pinimg.com/736x/56/77/83/56778331576a589e4766f600eedbaf35.jpg", price:1, category:"drinks" },
    { name:"Fanta", urlImage:"https://i.pinimg.com/1200x/db/40/eb/db40ebec8b15c8c8bcdaa0233c39f210.jpg", price:1, category:"drinks" },
    { name:"mango juice", urlImage:"https://i.pinimg.com/1200x/34/09/9d/34099d3b61e04f41b9aac36b873dd0d4.jpg", price:2, category:"drinks" },
    { name:"orange juice", urlImage:"https://i.pinimg.com/736x/0f/02/aa/0f02aaa9039a9164e064f84e4ab82d92.jpg", price:2, category:"drinks" },
    { name:"watermelon juice", urlImage:"https://i.pinimg.com/736x/18/e7/da/18e7da068367328100f4e7812aa840e7.jpg", price:2, category:"drinks" },
    { name:"water", urlImage:"https://i.pinimg.com/736x/87/9d/23/879d2335e89ca81de4a04f488e04f179.jpg", price:0.5, category:"drinks" },
    { name:"coffee", urlImage:"https://i.pinimg.com/736x/5b/f6/3b/5bf63be8e9ef56f668b3e7b82bdc7352.jpg", price:2, category:"drinks" },
    { name:"tea", urlImage:"https://i.pinimg.com/736x/aa/22/0d/aa220d97f7143ab98b80b0705eeb4679.jpg", price:1.5, category:"drinks" },
    { name:"ice cream", urlImage:"https://i.pinimg.com/1200x/cf/96/2f/cf962f61d2da43249776e52be62049bc.jpg", price:3, category:"desserts" },
    { name:"cake", urlImage:"https://i.pinimg.com/736x/fa/43/da/fa43dadd75f1a88e08898fe9249ea4d0.jpg", price:4, category:"desserts" },
    { name:"donut", urlImage:"https://i.pinimg.com/736x/4d/d2/2c/4dd22c6e1f533436f65138cbf0c00c6f.jpg", price:2, category:"desserts" },
    { name:"brownie", urlImage:"https://i.pinimg.com/736x/18/39/b5/1839b51798c581c9219f3d7ccd62cbda.jpg", price:3, category:"desserts" },
    { name:"pudding", urlImage:"https://i.pinimg.com/1200x/5a/52/bf/5a52bf65691fc38d85048924171ca5e2.jpg", price:2.5, category:"desserts" },
    { name:"cupcake", urlImage:"https://i.pinimg.com/736x/28/e3/97/28e397fca47efd3555b5ec80727e2d27.jpg", price:2, category:"desserts" },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        await Product.deleteMany({});
        console.log("Old products deleted");

        await Product.insertMany(products);
        console.log("✅ 33 Products inserted successfully!");

        mongoose.connection.close();
    } catch (err) {
        console.log("ERROR =>", err.message);
        mongoose.connection.close();
    }
};

seedDB();