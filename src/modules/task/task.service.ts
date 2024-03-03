import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import mongoose, { Model } from 'mongoose';
import { CreateTaskDto, UpdateTaskDto } from './createTask.dto';
import { ITaskQueries } from 'src/types/task';
import { ProjectService } from '../project/project.service';
import { isObjectId } from './utils/isValidObjectId';

@Injectable()
export class TaskService {
  @InjectModel(Task.name)
  private readonly dataSource: Model<Task>;
  constructor(private projectService: ProjectService) {}

  async getTaskById(id: string) {
    const task = await this.dataSource.findOne({ _id: id });
    if (!task) throw new NotFoundException('Task not found.');
    return task;
  }
  async createTask(task: CreateTaskDto) {
    const project = await this.projectService.getProjectById(task.project_id);

    if (!project) {
      throw new BadRequestException('Project not found');
    }
    const newTask = await this.dataSource.create({
      _id: new mongoose.Types.ObjectId(),
      ...task,
    });

    project.tasks.push(newTask._id);
    await project.save();
    return task;
  }
  async deleteTask(id: string) {
    return this.dataSource.deleteOne({ _id: id });
  }
  async updateTask(id: string, payload: UpdateTaskDto) {
    if (!isObjectId(id)) return new BadRequestException('Invalid id !');
    return this.dataSource.updateOne({ _id: id }, payload);
  }
  async getTasks(options: ITaskQueries, sortCriteria: any) {
    return this.dataSource.find(options).sort(sortCriteria);
  }
}
