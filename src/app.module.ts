import { Module } from '@nestjs/common';
import { FamilyMemberModule } from './family_member/family_member.module';
import { FamilyGroupModule } from './family_group/family_group.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from 'config.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyMember } from './family_member/entity/family-member.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      validationSchema: configValidationSchema
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [FamilyMember],
        autoLoadEntities: true,
        synchronize: true
      })
    }),
    FamilyMemberModule,
    FamilyGroupModule
  ]
})
export class AppModule {}
