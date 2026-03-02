import History, { IHistory } from '../models/history.model';

/**
 * @desc    Fetch all history records for a specific user
 * @param   userId The string representation of the User's ObjectId
 */
export const getHistoryByUserId = async (userId: string): Promise<IHistory[]> => {
  return await History.find({ userId }).sort({ createdAt: -1 });
};

/**
 * @desc    Delete a specific history record
 * @param   id The ID of the history record to delete
 * @param   userId The ID of the user (to ensure they own the record)
 */
export const deleteItemById = async (id: string, userId: string): Promise<any> => {
  // We check for BOTH id and userId to prevent unauthorized deletions
  return await History.findOneAndDelete({ _id: id, userId });
};

/**
 * @desc    Create a new history record
 * @param   data The history object data
 */
export const createHistoryRecord = async (data: Partial<IHistory>): Promise<IHistory> => {
  return await History.create(data);
};
