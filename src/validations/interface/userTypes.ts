export interface createuserTypes {
    userId?: string;
    username: string;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
    password2: string;
    verified: boolean;
    roles: "admin" | "super-admin";
    token: number;
}
export interface authenticateUserTypes {
    email: string;
    password: string;
}

export interface MailProps {
    email: string;
    subject: string;
    html: string;
}