import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class User {
    @PrimaryGeneratedColumn()
    public id?: string;

    @Column()
    public userId?: number;

    @Column()
    public login: string;
    
    @Column({ unique: true})
    public email: string;
    
    @Column()
    public picture: string;

 
}

export default User;