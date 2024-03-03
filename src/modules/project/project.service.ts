import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.cshema';
import mongoose, { Model } from 'mongoose';
import { CreateProjectDto } from './project.dto';
import { IGetAllProjectsQuerry } from 'src/types/project';

@Injectable()
export class ProjectService {
  @InjectModel(Project.name)
  private readonly projectEntity: Model<Project>;
  async createProject(data: CreateProjectDto) {
    return this.projectEntity.create({
      _id: new mongoose.Types.ObjectId(),
      ...data,
    });
  }

  async getProjectById(id: string) {
    return this.projectEntity.findOne({ _id: id });
  }

  async getProjects(options: IGetAllProjectsQuerry) {
    return this.projectEntity.find(options);
  }

  async deleteProject(id: string) {
    return this.projectEntity.deleteOne({ _id: id });
  }
}
