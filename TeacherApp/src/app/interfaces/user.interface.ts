export interface User {
    id?: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    role_id: number;
    creation_date: string;
    leaving_date?: string;
}
