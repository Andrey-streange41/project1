import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  CreateTaskValidationPipe,
  CheckObjectIdValidationPipe,
  UpdateTaskValidationPipe,
} from './task.pipe';
import { CreateTaskDto, UpdateTaskDto } from './createTask.dto';
import { TaskService } from './task.service';
import { createOptions } from './utils/createOptions';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Task } from './task.schema';

@Controller('task')
@ApiTags('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {
    this.taskService = taskService;
  }
  @Post('/')
  @ApiBody({
    type: CreateTaskDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: Task,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UsePipes(new CreateTaskValidationPipe())
  async createTask(@Body() body: CreateTaskDto) {
    const task = await this.taskService.createTask(body);
    return task;
  }

  @Get('/:id')
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task found.', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @UsePipes(new CheckObjectIdValidationPipe(new ValidationPipe()))
  async getTask(@Param() params: { id: string }) {
    const task = await this.taskService.getTaskById(params.id);
    return task;
  }

  @Get('/')
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Task title filter',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Task status filter',
  })
  @ApiQuery({
    name: 'created_at',
    required: false,
    description: 'Task creation date filter',
  })
  @ApiQuery({
    name: 'project_id',
    required: false,
    description: 'Project ID filter',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
  })
  @ApiResponse({ status: 200, description: 'Tasks found.', type: [Task] })
  async getAllTasks(@Query() queries: any) {
    const [options, sortCriteria] = createOptions(queries);
    const tasks = await this.taskService.getTasks(options, sortCriteria);
    return tasks;
  }

  @Delete('/:id')
  @UsePipes(new CheckObjectIdValidationPipe(new ValidationPipe()))
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async deleteTask(@Param() params: { id: string }) {
    const deleted = await this.taskService.deleteTask(params.id);
    return deleted;
  }

  @Put('/:id')
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task has been successfully updated.',
    type: Task,
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @UsePipes(new UpdateTaskValidationPipe())
  async updateTask(
    @Body()
    body: UpdateTaskDto,
    @Param() params: { id: string },
  ) {
    const updated = await this.taskService.updateTask(params.id, body);

    return updated;
  }
}
