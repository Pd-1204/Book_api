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
const PublicationModel = require("./database/publication");
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
booky.get("/is/:isbn",async (req,res) => {
  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
 
   if(!getSpecificBook) {
     return res.json({
       error: `No book found for ISBN of ${req.params.isbn}`
     });
   }
 
   return res.json(getSpecificBook);
 
 });
//get books on a specific category

booky.get("/c/:category", async (req,res)=> {

  const getSpecificBook = await BookModel.findOne({category: req.params.categry});
  //If no specific book is returned the , the findne func returns null, and to execute the not
  //found property we have to make the condn inside if true, !null is true.
  if(!getSpecificBook) {
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

booky.get("/author",async (req, res)=> {
  const getAllAuthors = AuthorModel.find();
  return res.json(getAllAuthors);
});


//get all authors based on book


booky.get("/author/book/:isbn",async (req,res)=> {
  const getSpecificAuthor = await AuthorModel.findOne({books: req.params.isbn});

if(!getSpecificAuthor) {
  return res.json({
    error: `No author found for isbn of ${req.params.isbn}`
  });
}

return res.json({authors: getSpecificAuthor});
});


//get all publications
booky.get("/publications", (req,res) => {
  const getAllPublications = PublicationModel.find();
  return res.json(getAllPublications);
});


//ADD NEW BOOKS- POST REQUEST
/* 
route   - /book/new
description - add new books
access - public
parameter- none
methods- post
*/

booky.post("/book/new", async(req,res)=>{
  const {newBook} = req.body;
  const addNewBook= BookModel.create(newBook)
  return res.json({books: addNewBook, message:"Book/s added succesfully !"});
});


//ADD NEW AUTHORS- POST REQUEST
/* 
route   - /author/new
description - add new books
access - public
parameter- none
methods- post
*/

booky.post("/author/new", async(req,res)=>{
  const {newAuthor} = req.body;
 AuthorModel.create(newAuthor);
  return res.json({authors: database.author, message:"Authors added successfully !"});
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
