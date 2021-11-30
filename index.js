require("dotenv").config();
const express = require("express");
var bodyParser =require("body-parser");
 //Database
const database = require("./database");
const mongoose = require("mongoose");

// Using ES6 imports



//Initialize express
const booky = express();
booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json());

//models
const BookModel = require("./database/book");
const authorModel = require("./database/author");
const AuthorModel = require("./database/author");



//initilaize mongoose
mongoose.connect(
  process.env.MONGO_URL
).then(()=> console.log("Connection is established..."));


//GET ALL BOOKS
/*
Route           /
Description     Get all books
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/", async(req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

//GET A SPECIFIC BOOK localhost:3000/12345Book
/*
Route           /
Description     Get specific book
Access          Public
Parameter       isbn 
Methods         GET
*/
booky.get("/is/:isbn", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if(getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for ISBN of ${req.params.isbn}`
    });
  }

  return res.json({book: getSpecificBook});

});

//get books on a specific category

booky.get("/c/:category", (req,res) =>{
    const getSpecificBook = database.books.filter((book)=>
    book.category.includes(req.params.category)
    );

    if(getSpecificBook.length === 0) {
        return res.json({
          error: `No book found for category of ${req.params.category}`
        });
      }
    
    return res.json({book: getSpecificBook});
});

//get books based on languages

booky.get("/language", (req,res)=>{
  const getSpecificBook = database.books.filter((book)=>
   book.language.includes(req.params.language));

   if(getSpecificBook.length===0){
     return res.json({
       error:`No book found for language of ${req.params.category}`
     });
   }
   return res.json({book:getSpecificBook});
});








//get all authors, route- /author

booky.get("/author", (req,res) =>{
  return res.json({authors: database.author});
});

//get all authors based on book

booky.get("/author/book/:isbn", (req,res) =>{
  const getSpecificAuthor = database.author.filter((author)=>
  author.books.includes(req.params.isbn)
  );
  if(getSpecificAuthor.length===0){
    returnres.json({
      error: `No author found for isbn of ${req.params.isbn}`
    });
  }
  return res.json({authors:getSpecificAuthor});
});

//get all publications
booky.get("/publications", (req,res)=>{
  return res.json({publications :database.publication});
});



//ADD NEW BOOKS- POST REQUEST
/* 
route   - /book/new
description - add new books
access - public
parameter- none
methods- post
*/

booky.post("/book/new", (req,res)=>{
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks: database.books});
});


//ADD NEW AUTHORS- POST REQUEST
/* 
route   - /author/new
description - add new books
access - public
parameter- none
methods- post
*/

booky.post("/author/new", (req,res)=>{
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json({updatedAuthors: database.author});
});


//ADD NEW PUBILCATIONS- POST REQUEST
/* 
route   - /publication/new
description - add new books
access - public
parameter- none
methods- post
*/

booky.post("/publication/new", (req,res)=>{
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json({updatedPublications: database.publication});
});



//delete a book
//route - /book/delete

booky.delete("/book/delete/:isbn", (req,res)=>{
  const updateBookDatabse = database.books.filter(
    (book) => book.ISBN !=req.params.isbn
  )
  database.books = updateBookDatabse;
  return res.json({books: database.books});
});

// UPDATE PUBLICATION AND BOOK
//route -- /publication/update/book/:isbn
//parameter -- :isbn
//methods -- put

/*booky.put("/publication/update/book/:isbn", (req,res)=>{
  database.publication.forEach((pub)=>{
    if(pub.id === req.body.pubId){
      return pub.books.push(req.params.isbn);
    }
  });
  database.pub.books.push(req.params.isbn);

  //update book db
  database.books.forEach((book)=>{
    if(book.ISBN==req.params.isbn){
      book.publications = req.body.pubId;
      return;
    }
  });
  return res.json(
    {books: database.books,
    publications:database.publication,
    message: "succesfully updated"
    }
  )
});
*/

booky.put("/publication/update/book/:isbn", (req,res)=> {
  //UPDATE THE PUB DB
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //UPDATE THE BOOK DB
  database.books.forEach((book) => {
    if(book.ISBN == req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });

  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "Successfully updated!"
    }
  )

});


//DELETE AN AUTHOR FROM BOOK AND VICE VERSA
//route - /book/delete/author , paramter- isbn, authorID

booky.delete("/book/delete/author/:isbn/:authorid", (req,res)=>{
  //update book db
  database.books.forEach((book)=>{
    if(book.ISBN === req.params.isbn){
      const newAuthorlist = book.author.filter(
        (eachAuthor)=>eachAuthor!== parseInt( req.params.authorid)
      );
      book.author = newAuthorlist;
      return;
    }

    //update author db
    database.author.forEach((eachAuthor)=>{
      if(eachAuthor.id === parseInt(req.params.authorid)){
        const newBooklist = eachAuthor.books.filter(
          (book) => book!= req.params.isbn
        );
        eachAuthor.books = newBooklist;
        return;
      }
    });
    return res.json({
      book : database.books,
      author: database.author,
      message : "author and book were deleted" 
    });
  })
});

booky.listen(3000,() => console.log("Server is up and running!!!"));
