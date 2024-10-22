export class CreateUserDto {
    userId: number;
    login: string;
    email: string;
    picture: string;
    firstName: string;
    lastName: string
}

export default CreateUserDto;
