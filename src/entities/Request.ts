import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

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
}
