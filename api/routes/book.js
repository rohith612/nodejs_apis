/**
 * @Book module 
 */
const express = require('express')
const router = express.Router()
var con = require('../../config/db')

/**
 * Book apis gose here
 * @params : [] 
 */
router.get('/books', (req, res) => {
    let query = 'SELECT * FROM books';
    con.query(query, (err, result, fields) => {
        if (err || result.length == 0) res.status(204).send({ data: "can't get all books" })
        res.status(200).send({ data: result });
    })
})

/**
 * Get a specific book request
 * @params : id
 */
router.get('/book/:id', (req, res) => {
    var bookId = req.params.id;
    let query = `SELECT * FROM books where book_id = ${bookId}`;
    con.query(query, (err, result, fields) => {
        if (err || result.length == 0) res.status(204).send({ data: "can't get books" })
        res.status(200).send({ data: result })
    });
})
/**
 * Add a new book 
 * @params : book_nam , book_dec, book_author
 */
router.post('/book', verifyToken, (req, res) => {

    let bookTitle = req.body.book_name;
    let bookDec = req.body.book_dec;
    let bookAuthor = req.body.book_author;

    let query = `insert into books(book_name,book_dec,book_author) values ('${bookTitle}','${bookDec}','${bookAuthor}')`;

    con.query(query, (err, result) => {
        if (err) res.status(500).send({ data: "can't insert books" })
        res.status(200).send({ data: "data inserted" })
    })
})
/**
 * Update the book
 * @params book_id, book_name , book_author , book_dec
 */
router.patch('/book', verifyToken, (req, res) => {

    let bookTitle = req.body.book_name;
    let bookDec = req.body.book_dec;
    let bookAuthor = req.body.book_author;
    let bookId = req.body.book_id;

    let query = `update books set book_name = '${bookTitle}' , book_dec = '${bookDec}' , book_author = '${bookAuthor}' where book_id = '${bookId}'`;


    con.query(query, (err, result) => {
        if (err) res.status(500).send({ data: "Can't update books" })
        res.status(200).send({ data: "Data updated" })
    })

})
/**
 * Delete book 
 * @param : id
 */
router.delete('/book/:id', (req, res) => {

    let bookId = req.params.id;
    let query = `delete from  books where book_id = '${bookId}'`;
    con.query(query, (err, result) => {
        if (err) res.status(500).send({ data: "Can't delete books" })
        res.status(200).send({ data: "Deleted successfully" })
    })
})

router.get('/sample' , (req,res) => {
    // console.log('rohith called')
    res.send('<p>hello</p>')
})


module.exports = router