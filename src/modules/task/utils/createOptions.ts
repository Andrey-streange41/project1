import { isValidObjectId } from 'mongoose';
import { ITaskQueries } from 'src/types/task';

export const createOptions = (
  queries: any,
): [ITaskQueries, sortCriteria: any] => {
  if (!queries) return [{}, {}];

  const sortCriteria: any = {};
  if (queries.sortBy && queries.sortOrder) {
    sortCriteria[queries.sortBy] = queries.sortOrder === 'asc' ? 1 : -1;
  }

  return [
    {
      ...(queries.title ? { title: queries.title } : {}),
      ...(queries.status ? { status: queries.status } : {}),
      ...(queries.created_at ? { created_at: queries.created_at } : {}),
      ...(queries.project_id && isValidObjectId(queries.project_id)
        ? { project_id: queries.project_id }
        : {}),
    },
    {
      ...sortCriteria,
    },
  ];
};
