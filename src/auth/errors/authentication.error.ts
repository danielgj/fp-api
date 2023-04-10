export class AuthenticationError extends Error {
    constructor() {
        super(`There was an error authenticating the user`);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}