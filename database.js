const books = [
    {
        ISBN :"1234BOOK", 
        title :"Getting started with mern", 
        pubdate:"2021-11-25",
        language:"en",
        numpage: 240,
        author:[1,2],
        publications:[1],
        category:["tech", "edu", "sci"]
    }
];

const author =[
    {
        id:1,
        name:"David",
        books:["1234BOOK", "myBook"]
    },
    {
        id:2,
        name:"John",
        books :["1234BOOK"]
    }
];

const publication =[
    {
        id:1,
        name:"writex",
        books:["1234BOOK"]
    },
    {
        id:2,
        name:"readx",
        books:[]
    }
];

module.exports = {books, author, publication}
//export default {books, author, publication} ->ES6