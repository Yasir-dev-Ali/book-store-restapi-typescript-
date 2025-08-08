// import mongoose from "mongoose";
// import { Book } from "./typesBook";


// const bookSchema = new mongoose.Schema<Book>({
//     id: {
//         type: String,
//         required: true,
//     },
//     title: {
//         type: String,
//         required: true,
//     },
//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     coverImage: {
//         type: String,
//         required: true,
//     },
//     price: {
//         type: String,
//         required: true,
//     },
//     publishedDate: {
//         type: Date,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     category: {
//         type: String,
//         required: true,
//         enum: [
//             "Fiction",
//             "Non-Fiction",
//             "Science",
//             "History",
//             "Biography",
//             "Fantasy",
//             "Mystery",
//             "Romance",
//             "Thriller",
//             "Horror",
//             "Self-Help",
//             "Health",
//             "Travel",
//             "Cooking",
//             "Children",
//             "Young Adult",
//             "Comics",
//             "Graphic Novels"
//         ],
//     },
  
//     filePath: {
//         type: String,
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// const BookModel = mongoose.model<Book>("Book", bookSchema);

// export default BookModel;
// export { BookModel };


import mongoose from "mongoose";
import { Book } from "./typesBook";

const bookSchema = new mongoose.Schema<Book>(
    {
        title: { type: String, required: true },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coverImage: { type: String, required: true },
        price: { type: String, required: true },
        publishedDate: { type: Date, required: true },
        description: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: [
                "Fiction", "Non-Fiction", "Science", "History", "Biography",
                "Fantasy", "Mystery", "Romance", "Thriller", "Horror",
                "Self-Help", "Health", "Travel", "Cooking", "Children",
                "Young Adult", "Comics", "Graphic Novels"
            ],
        },
        filePath: { type: String, required: true },
    },
    { timestamps: true } // adds createdAt and updatedAt
);

const BookModel = mongoose.model<Book>("Book", bookSchema);

export default BookModel;

