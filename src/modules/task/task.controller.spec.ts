import { BadRequestException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './createTask.dto';
import { TaskController } from './task.controller';
import { TaskModule } from './task.module';
import { status } from '../../types/task';

describe('TaskController', () => {
  test('should import TaskModule successfully', () => {
    const taskModule = new TaskModule();
    expect(taskModule).toBeDefined();
  });
  test('should create a task with valid input and return a 201 response with the created task object', async () => {
    // Arrange
    const taskServiceMock: any = {
      createTask: jest.fn().mockResolvedValue({
        _id: '1',
        project_id: '65e454f6147346977b60d6f8',
        title: 'Task 1',
        description: 'Description of Task 1',
        status: 'Новая',
        priority: 1,
        deadline: new Date(),
      }),
    };
    const taskController = new TaskController(taskServiceMock);
    const createTaskDto = new CreateTaskDto();
    createTaskDto.project_id = '65e454f6147346977b60d6f8';
    createTaskDto.title = 'Task 1';
    createTaskDto.description = 'Description of Task 1';
    createTaskDto.status = 'Новая';
    createTaskDto.priority = 1;
    createTaskDto.deadline = new Date();

    // Act
    const result = await taskController.createTask(createTaskDto);

    // Assert
    expect(result).toEqual({
      _id: '1',
      project_id: '65e454f6147346977b60d6f8',
      title: 'Task 1',
      description: 'Description of Task 1',
      status: 'Новая',
      priority: 1,
      deadline: expect.any(Date),
    });
    expect(taskServiceMock.createTask).toHaveBeenCalledWith(createTaskDto);
  });
  test('should return a 400 response with an error message when creating a task with missing required fields', async () => {
    // Arrange
    const taskServiceMock: any = {
      createTask: jest
        .fn()
        .mockRejectedValue(new BadRequestException('Project not found')),
    };
    const taskController = new TaskController(taskServiceMock);
    const createTaskDto = new CreateTaskDto();
    createTaskDto.project_id = '65e454f6147346977b60d6f8';
    createTaskDto.title = 'Task 1';
    createTaskDto.status = 'Новая';
    createTaskDto.priority = 1;
    createTaskDto.deadline = new Date();

    // Act
    try {
      await taskController.createTask(createTaskDto);
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Project not found');
      expect(taskServiceMock.createTask).toHaveBeenCalledWith(createTaskDto);
    }
  });
  it('should get a task by ID and return a 200 response with the task object', async () => {
    // Arrange
    const taskServiceMock: any = {
      getTaskById: jest.fn().mockResolvedValue({
        _id: '1',
        project_id: '65e454f6147346977b60d6f8',
        title: 'Task 1',
        description: 'Description of Task 1',
        status: 'Новая',
        priority: 1,
        deadline: new Date(),
      }),
    };
    const taskController = new TaskController(taskServiceMock);
    const params = { id: '1' };

    // Act
    const result = await taskController.getTask(params);

    // Assert
    expect(result).toEqual({
      _id: '1',
      project_id: '65e454f6147346977b60d6f8',
      title: 'Task 1',
      description: 'Description of Task 1',
      status: 'Новая',
      priority: 1,
      deadline: expect.any(Date),
    });
    expect(taskServiceMock.getTaskById).toHaveBeenCalledWith('1');
  });
  it('should get all tasks with valid query parameters and return a 200 response with an array of task objects', async () => {
    // Arrange
    const taskServiceMock: any = {
      getTasks: jest.fn().mockResolvedValue([
        {
          _id: '1',
          project_id: '65e454f6147346977b60d6f8',
          title: 'Task 1',
          description: 'Description of Task 1',
          status: 'Новая',
          priority: 1,
          deadline: new Date(),
        },
      ]),
    };
    const taskController = new TaskController(taskServiceMock);
    const queries: any = {
      title: 'Task 1',
      status: 'Новая',
      created_at: new Date(),
      project_id: '65e454f6147346977b60d6f8',
      sortBy: 'title',
      sortOrder: 'asc',
    };

    // Act
    const result = await taskController.getAllTasks(queries);

    // Assert
    expect(result).toEqual([
      {
        _id: '1',
        project_id: '65e454f6147346977b60d6f8',
        title: 'Task 1',
        description: 'Description of Task 1',
        status: 'Новая',
        priority: 1,
        deadline: expect.any(Date),
      },
    ]);
    expect(taskServiceMock.getTasks).toHaveBeenCalledWith(
      {
        title: 'Task 1',
        status: 'Новая',
        created_at: expect.any(Date),
        project_id: '65e454f6147346977b60d6f8',
      },
      {
        title: 1,
      },
    );
  });
  it('should delete a task by ID and return a 200 response with the deleted task object', async () => {
    // Arrange
    const taskServiceMock: any = {
      deleteTask: jest.fn().mockResolvedValue({
        _id: '1',
        project_id: '123',
        title: 'Task 1',
        description: 'Description of Task 1',
        status: 'Новая',
        priority: 1,
        deadline: new Date(),
      }),
    };
    const taskController = new TaskController(taskServiceMock);
    const taskId = '1';

    // Act
    const result = await taskController.deleteTask({ id: taskId });

    // Assert
    expect(result).toEqual({
      _id: '1',
      project_id: '123',
      title: 'Task 1',
      description: 'Description of Task 1',
      status: 'Новая',
      priority: 1,
      deadline: expect.any(Date),
    });
    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(taskId);
  });
  it('should update a task by ID with valid input and return a 200 response with the updated task object', async () => {
    // Arrange
    const taskServiceMock: any = {
      updateTask: jest.fn().mockResolvedValue({
        _id: '1',
        project_id: '123',
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'В процессе',
        priority: 2,
        deadline: new Date(),
      }),
    };
    const taskController = new TaskController(taskServiceMock);
    const updateTaskDto = new UpdateTaskDto();
    updateTaskDto.title = 'Updated Task';
    updateTaskDto.description = 'Updated Description';
    updateTaskDto.status = 'В процессе';
    updateTaskDto.priority = 2;
    updateTaskDto.deadline = new Date();
    const params = { id: '1' };

    // Act
    const result = await taskController.updateTask(updateTaskDto, params);

    // Assert
    expect(result).toEqual({
      _id: '1',
      project_id: '123',
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'В процессе',
      priority: 2,
      deadline: expect.any(Date),
    });
    expect(taskServiceMock.updateTask).toHaveBeenCalledWith('1', updateTaskDto);
  });
  it('should create a task with optional fields missing and return a 201 response with the created task object with default values', async () => {
    // Arrange
    const taskServiceMock: any = {
      createTask: jest.fn().mockResolvedValue({
        _id: '1',
        project_id: '123',
        title: 'Task 1',
        description: 'Description of Task 1',
        status: 'Новая',
        priority: 0,
        deadline: null,
      }),
    };
    const taskController = new TaskController(taskServiceMock);
    const createTaskDto = new CreateTaskDto();
    createTaskDto.project_id = '123';
    createTaskDto.title = 'Task 1';
    createTaskDto.status = 'Новая';

    // Act
    const result = await taskController.createTask(createTaskDto);

    // Assert
    expect(result).toEqual({
      _id: '1',
      project_id: '123',
      title: 'Task 1',
      description: 'Description of Task 1',
      status: 'Новая',
      priority: 0,
      deadline: null,
    });
    expect(taskServiceMock.createTask).toHaveBeenCalledWith(createTaskDto);
  });
  it('should get all tasks with no query parameters and return a 200 response with an array of all task objects', async () => {
    // Arrange
    const taskServiceMock: any = {
      getTasks: jest.fn().mockResolvedValue([
        {
          _id: '1',
          project_id: '123',
          title: 'Task 1',
          description: 'Description of Task 1',
          status: 'Новая',
          priority: 1,
          deadline: new Date(),
        },
      ]),
    };
    const taskController = new TaskController(taskServiceMock);

    // Act
    const result = await taskController.getAllTasks({});

    // Assert
    expect(result).toEqual([
      {
        _id: '1',
        project_id: '123',
        title: 'Task 1',
        description: 'Description of Task 1',
        status: 'Новая',
        priority: 1,
        deadline: expect.any(Date),
      },
    ]);
    expect(taskServiceMock.getTasks).toHaveBeenCalledWith({}, {});
  });
  it('should return a null response when getting a task with an invalid ID', async () => {
    // Arrange
    const taskServiceMock: any = {
      getTaskById: jest.fn().mockResolvedValue(null),
    };
    const taskController = new TaskController(taskServiceMock);
    const params = { id: 'invalidId' };

    // Act
    const result = await taskController.getTask(params);

    // Assert
    expect(result).toEqual(null);
    expect(taskServiceMock.getTaskById).toHaveBeenCalledWith('invalidId');
  });
  it('should return a null response  when deleting a task with an invalid ID', async () => {
    // Arrange
    const taskServiceMock: any = {
      deleteTask: jest.fn().mockResolvedValue(null),
    };
    const taskController = new TaskController(taskServiceMock);
    const id = 'invalid-id';

    // Act
    const result = await taskController.deleteTask({ id });

    // Assert
    expect(result).toEqual(null);
    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(id);
  });
  it('should return a null response  when updating a task with an invalid ID', async () => {
    // Arrange
    const taskServiceMock: any = {
      updateTask: jest.fn().mockResolvedValue(null),
    };
    const taskController = new TaskController(taskServiceMock);
    const updateTaskDto = new UpdateTaskDto();
    const invalidId = 'invalid-id';

    // Act
    const result = await taskController.updateTask(updateTaskDto, {
      id: invalidId,
    });
    // Assert
    expect(result).toEqual(null);
    expect(taskServiceMock.updateTask).toHaveBeenCalledWith(
      invalidId,
      updateTaskDto,
    );
  });
  it('should return a 200 response with an empty array when querying tasks with invalid parameters', async () => {
    // Arrange
    const taskServiceMock: any = {
      getTasks: jest.fn().mockResolvedValue([]),
    };
    const taskController = new TaskController(taskServiceMock);
    const queries = {
      title: 'invalid',
      status: status.NEW,
      created_at: new Date(),
      project_id: 'invalid',
    };

    // Act
    const result = await taskController.getAllTasks(queries);

    // Assert
    expect(result).toEqual([]);
    expect(taskServiceMock.getTasks).toHaveBeenCalledWith(
      { title: 'invalid', status: status.NEW, created_at: expect.any(Date) },
      {},
    );
  });
  it('should return a 400 response with an error message when creating a task with a non-existent project ID', async () => {
    // Arrange
    const taskServiceMock: any = {
      createTask: jest
        .fn()
        .mockRejectedValue(new BadRequestException('Project not found')),
    };
    const taskController = new TaskController(taskServiceMock);
    const createTaskDto = new CreateTaskDto();
    createTaskDto.project_id = 'nonexistent';
    createTaskDto.title = 'Task 1';
    createTaskDto.description = 'Description of Task 1';
    createTaskDto.status = 'Новая';
    createTaskDto.priority = 1;
    createTaskDto.deadline = new Date();

    // Act
    try {
      await taskController.createTask(createTaskDto);
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Project not found');
      expect(taskServiceMock.createTask).toHaveBeenCalledWith(createTaskDto);
    }
  });
  it('should return a 400 response with an error message when creating a task with an invalid status', async () => {
    // Arrange
    const taskServiceMock: any = {
      createTask: jest
        .fn()
        .mockRejectedValue(
          new BadRequestException('Task creation validation failed'),
        ),
    };
    const taskController = new TaskController(taskServiceMock);
    const createTaskDto = new CreateTaskDto();
    createTaskDto.project_id = '123';
    createTaskDto.title = 'Task 1';
    createTaskDto.description = 'Description of Task 1';
    createTaskDto.status = 'Invalid Status';
    createTaskDto.priority = 1;
    createTaskDto.deadline = new Date();

    // Act
    try {
      await taskController.createTask(createTaskDto);
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Task creation validation failed');
      expect(taskServiceMock.createTask).toHaveBeenCalledWith(createTaskDto);
    }
  });
  it('should return a null response  when updating a task with an invalid status', async () => {
    // Arrange
    const taskServiceMock: any = {
      updateTask: jest.fn().mockResolvedValue(null),
    };
    const taskController = new TaskController(taskServiceMock);
    const updateTaskDto = new UpdateTaskDto();
    updateTaskDto.status = 'InvalidStatus';

    // Act
    const result = await taskController.updateTask(updateTaskDto, { id: '1' });

    // Assert
    expect(result).toEqual(null);
    expect(taskServiceMock.updateTask).toHaveBeenCalledWith('1', updateTaskDto);
  });
});
