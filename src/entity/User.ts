import { Entity, Column } from 'typeorm';
import BaseModel from './BaseModel';

@Entity({ name: 'users' })
export class User extends BaseModel {
  @Column({ type: 'varchar', length: 20 })
  googleId: string;

  @Column()
  facebookId: string;

  @Column()
  username: string;

}
