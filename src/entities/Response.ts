import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinColumn,
} from 'typeorm';
import { Request } from './Request';

@Entity()
export class Response {
	@PrimaryGeneratedColumn()
	id!: number;

	@OneToOne(() => Request, { nullable: false })
	@JoinColumn()
	request!: Request;

	@Column()
	status!: number;

	@Column('simple-json', { default: null })
	headers!: any;

	@Column('simple-json', {
		nullable: true,
	})
	content!: any;
}
