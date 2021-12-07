import { Entity, PrimaryGeneratedColumn, Unique, Column } from 'typeorm';

@Entity()
@Unique('config_method_url_ukey', ['method', 'url'])
export class MockConfig {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	url?: string;

	@Column()
	method?: string;

	@Column('simple-json', {
		nullable: true,
	})
	elements?: any;
}
