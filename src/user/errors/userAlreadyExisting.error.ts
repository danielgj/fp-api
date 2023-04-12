export class UserAlreadyExistingError extends Error {
    constructor(email: string) {
        super(`User with email ${email} already exists`);
        Object.setPrototypeOf(this, UserAlreadyExistingError.prototype);
    }
}