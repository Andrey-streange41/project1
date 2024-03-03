import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';
import { Project, ProjectSchema } from '../project/project.cshema';
import { ProjectService } from '../project/project.service';
import { APP_FILTER } from '@nestjs/core';
import { TaskFilter } from './task.filter';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    ProjectService,
    {
      provide: APP_FILTER,
      useClass: TaskFilter,
    },
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class TaskModule {}
