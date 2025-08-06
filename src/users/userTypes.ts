export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}
export interface UserRegistrationData {
  username: string;
  password: string;
  email: string;
}
export interface UserResponse {
  message: string;
  user: {
    username: string;
    email: string;
  };
}
export interface UserError {
    message: string;
    code: number;
}
export interface UserRegistrationError {
    message: string;
    code: number;
}