import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinColumn,
} from 'typeorm';
import { Request } from './Request';

@Entity()
export class IgnoreConfig {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	headers!: boolean;

	@Column()
	queryParams!: boolean;

	@Column()
	body!: boolean;

	@OneToOne(() => Request, (request) => request.id, { nullable: false })
	@JoinColumn()
	request!: Request;
}
