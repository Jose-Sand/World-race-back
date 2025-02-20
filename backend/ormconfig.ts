// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { DataSource, DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: ['./dist/**/entities/*.entity.js'],
  synchronize: process.env.NODE_ENV !== 'production',
  migrationsRun: true,
  logging: true,
  migrations: ['./dist/src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_TypeORM',
};
const dataSource = new DataSource(config);
export default dataSource;
