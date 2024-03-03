import { TaskModule } from './task.module';

describe('TaskModule', () => {
  it('should import TaskModule successfully', () => {
    const taskModule = new TaskModule();
    expect(taskModule).toBeDefined();
  });
});
