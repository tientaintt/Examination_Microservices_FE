// Regex to validate input
// Regiter
export const emailRegex = /^[a-zA-Z0-9\+\.\_\%\-\+]{1,256}\@[a-zA-Z0-9][a-zA-Z0-9\-]{0,62}(\.[a-zA-Z0-9][a-zA-Z0-9\-]{0,25})+$/;
export const usernameRegex = /^([a-zA-Z0-9._-]{6,16}$)/;
export const passwordRegex = /^[!-~]{8,20}$/;
export const INSCREASE = 'asc';
export const DESCREASE = 'desc';

// Error messages when validation fails
export const displayNameInvalid = 'Please enter your display name!';
export const userNameInvalid = "Username must be made of letter, number, '-', '_', and/or '.' . Length must be between 6 and 16 chars.";
export const passwordInvalid = "Password must be made of letters, numbers, and/or '!' - '~'. Length must be between 8 and 20 chars.";
export const emailInvalid = "Must be made of letters, numbers, contains '@' and/or '_' - '-'.Dot isn't allowed at the start and end of the local part. Consecutive dots aren't allowed. a maximum of 64 characters are allowed.";
export const ROLE_ADMIN = "ADMIN";
export const ROLE_STUDENT = "STUDENT";
export const ROLE_TEACHER = "TEACHER";