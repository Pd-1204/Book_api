const mongoose = require("mongoose");

//book schema
const BookSchema = mongoose.Schema({

});

//creating book model
const bookModel = mongoose.model("books", BookSchema);
module.exports=bookModel;