import { User } from "../users/userTypes";

export interface Book {
    id: string;
    title: string;
    author: User;
    coverImage: string;
    price: number;
    publishedDate: Date;
    description: string;
    category: string;
    stock: number;
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