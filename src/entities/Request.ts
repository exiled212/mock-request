import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Unique,
	OneToOne,
} from 'typeorm';
import { Response } from './Response';
import { IgnoreConfig } from './IgnoreConfig';

@Entity()
@Unique('request_id_md5_ukey', ['id_md5'])
export class Request {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	id_md5!: string;

	@Column()
	url!: string;

	@Column()
	method!: string;

	@Column('simple-json', {
		nullable: true,
	})
	headers!: any;

	@Column('simple-json', {
		nullable: true,
	})
	queryParams!: any;

	@Column('simple-json', {
		nullable: true,
	})
	body!: any;

	@OneToOne(() => Response, (response) => response.request)
	response!: Response;

	@OneToOne(() => IgnoreConfig, (ignoreConfig) => ignoreConfig.request)
	ignoreConfig!: IgnoreConfig;
}
