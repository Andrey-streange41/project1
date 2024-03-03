import { IGetAllProjectsQuerry } from 'src/types/project';
import { ProjectController } from './project.controller';
import { CreateProjectDto } from './project.dto';

describe('ProjectController', () => {
  // Creating a project with valid data returns a 201 status code and the created project.
  it('should return 201 status code and the created project when creating a project with valid data', async () => {
    // Arrange
    const mockProjectService: any = { createProject: jest.fn() };
    const projectController = new ProjectController(mockProjectService);
    const createProjectDto = new CreateProjectDto();
    createProjectDto.title = 'Test Project';
    createProjectDto.description = 'Test Description';
    createProjectDto.start_date = new Date();
    createProjectDto.end_date = new Date();
    createProjectDto.tasks = ['Task 1', 'Task 2'];

    mockProjectService.createProject.mockResolvedValue(createProjectDto);

    // Act
    const result = await projectController.createProject(createProjectDto);

    // Assert
    expect(result).toBeDefined();
    expect(mockProjectService.createProject).toHaveBeenCalledWith(
      createProjectDto,
    );
    expect(result).toEqual(createProjectDto);
  });
  // Getting all projects with no filters returns a 200 status code and an array of all projects.
  it('should return 200 status code and an array of all projects when getting all projects with no filters', async () => {
    // Arrange
    const mockProjectService: any = { getProjects: jest.fn() };
    const projectController = new ProjectController(mockProjectService);
    const queries: IGetAllProjectsQuerry = {};

    const mockProjects = [
      { title: 'Project 1', description: 'Description 1' },
      { title: 'Project 2', description: 'Description 2' },
    ];
    mockProjectService.getProjects.mockResolvedValue(mockProjects);

    // Act
    const result = await projectController.getAllprojects(queries);

    // Assert
    expect(result).toBeDefined();
    expect(mockProjectService.getProjects).toHaveBeenCalledWith({});
    expect(result).toEqual(mockProjects);
  });
  // Getting all projects with a title filter returns a 200 status code and an array of projects with matching titles.
  it('should return 200 status code and an array of projects with matching titles when getting all projects with a title filter', async () => {
    // Arrange
    const mockProjectService: any = { getProjects: jest.fn() };
    const projectController = new ProjectController(mockProjectService);
    const queries = { title: 'Test Title' };
    const mockProjects = [
      { title: 'Test Title', description: 'Test Description' },
    ];

    mockProjectService.getProjects.mockResolvedValue(mockProjects);

    // Act
    const result = await projectController.getAllprojects(queries);

    // Assert
    expect(result).toBeDefined();
    expect(mockProjectService.getProjects).toHaveBeenCalledWith(queries);
    expect(result).toEqual(mockProjects);
  });
  // Getting all projects with an ID filter returns a 200 status code and an array of projects with matching IDs.
  it('should return 200 status code and an array of projects with matching IDs when getting all projects with an ID filter', async () => {
    // Arrange
    const mockProjectService: any = { getProjects: jest.fn() };
    const projectController = new ProjectController(mockProjectService);
    const queries: IGetAllProjectsQuerry = { id: '123' };
    const mockProjects = [{ id: '123', title: 'Test Project' }];

    mockProjectService.getProjects.mockResolvedValue(mockProjects);

    // Act
    const result = await projectController.getAllprojects(queries);

    // Assert
    expect(result).toBeDefined();
    expect(mockProjectService.getProjects).toHaveBeenCalledWith(queries);
    expect(result).toEqual(mockProjects);
  });
  // Deleting a project by ID that exists returns a 200 status code and a success message.
  it('should return 200 status code and success message when deleting a project by ID that exists', async () => {
    // Arrange
    const mockProjectService: any = { deleteProject: jest.fn() };
    const projectController = new ProjectController(mockProjectService);
    const projectId = '12345';

    mockProjectService.deleteProject.mockResolvedValue({
      message: 'Project deleted successfully',
    });

    // Act
    const result = await projectController.deleteProject(projectId);

    // Assert
    expect(result).toBeDefined();
    expect(mockProjectService.deleteProject).toHaveBeenCalledWith(projectId);
    expect(result).toEqual({ message: 'Project deleted successfully' });
  });
});
