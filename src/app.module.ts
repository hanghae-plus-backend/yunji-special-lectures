import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SpecialLecturesController } from './special-lectures/special-lectures.controller';
import { SpecialLecturesService } from './special-lectures/domain/special-lectures.service';
import { SpecialLecturesModule } from './special-lectures/special-lectures.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import SpecialLecturesEntitiesTypeORM from './special-lectures/infra/db/typeORM/entities';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: process.env.DB_TYPE,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          username: process.env.DB_USER_NAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DATABASE,
          entities: SpecialLecturesEntitiesTypeORM,
          synchronize: false,
          logging: false,
        } as TypeOrmModuleOptions;
      },
    }),
    SpecialLecturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
