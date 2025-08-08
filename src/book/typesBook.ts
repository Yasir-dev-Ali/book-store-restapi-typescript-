import { User } from "../users/userTypes";

export interface Book {
    id: string;
    title: string;
    author: User;
    coverImage: string;
    price: string;
    publishedDate: Date;
    description: string;
    category: string;
    stock: number;
    uploader: User;
    filePath: string;
    createdAt?: Date;
    updatedAt?: Date;


}

export interface BookResponse {
    message: string;
    book: Book;
}
export interface BookError {
    message: string;
    code: number;
}