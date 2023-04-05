export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    lastActiveAt?: string;
    isPro: boolean;
    avatar?: string;
}