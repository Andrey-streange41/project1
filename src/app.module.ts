import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from './modules/token/token.module';
import { TaskModule } from './modules/task/task.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://andrejzurba749:${process.env.DATABASE_PASSWORD}@cluster0.rlzrq1v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    ),
    UserModule,
    TokenModule,
    TaskModule,
    ProjectModule,
  ],
})
export class AppModule {}
