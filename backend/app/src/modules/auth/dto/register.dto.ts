export class RegisterDto {
    userId: number;
    login: string;
    email: string;
    picture: string;
    twoFactor: boolean;
    isfirsttime: boolean;
    firstName: string;
    lastName: string
}

export default RegisterDto;
