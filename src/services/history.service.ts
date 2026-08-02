import History, { IHistory } from '../models/history.model';

export const getHistoryByUserId = async (userId: string): Promise<IHistory[]> => {
  return await History.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * @desc    Delete a specific history record
 * @param   id The _id of the history record
 * @param   userId The ID of the user (to ensure ownership)
 */
export const deleteItemById = async (id: string, userId: string): Promise<any> => {
  return await History.findOneAndDelete({ _id: id, user: userId });
};

/**
 * @desc    Create a new history record
 */
export const createHistoryRecord = async (data: Partial<IHistory>): Promise<IHistory> => {
  return await History.create(data);
};
