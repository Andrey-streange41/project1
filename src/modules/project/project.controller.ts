import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './project.dto';
import { CreateProjectValidationPipe } from './project.pipe';
import { IGetAllProjectsQuerry } from 'src/types/project';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Project } from './project.cshema';

@Controller('project')
@ApiTags('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {
    this.projectService = projectService;
  }
  @Post('/create')
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Project has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UsePipes(new CreateProjectValidationPipe())
  async createProject(@Body() user: CreateProjectDto) {
    return this.projectService.createProject(user);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project found.', type: Project })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async getProject(@Param('id') id: string) {
    const project = await this.projectService.getProjectById(id);
    return project;
  }

  @Get('/')
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Project title filter',
  })
  @ApiQuery({ name: 'id', required: false, description: 'Project ID filter' })
  @ApiResponse({ status: 200, description: 'Projects found.', type: [Project] })
  async getAllprojects(@Query() queries: IGetAllProjectsQuerry) {
    const options = {
      ...(queries.title ? { title: queries.title } : {}),
      ...(queries.id ? { id: queries.id } : {}),
    };

    return this.projectService.getProjects(options);
  }

  @Delete('/delete/:id')
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({
    status: 200,
    description: 'Project has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async deleteProject(@Param('id') id: string) {
    const result = await this.projectService.deleteProject(id);
    return result;
  }
}
