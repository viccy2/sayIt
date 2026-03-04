import History, { IHistory } from '../models/history.model';

/**
 * @desc    Fetch all history records for a specific user
 * @param   userId The string ID (matching your Atlas 'user' field)
 */
export const getHistoryByUserId = async (userId: string): Promise<IHistory[]> => {
  // Changed field from 'userId' to 'user' to match your Atlas sample
  return await History.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * @desc    Delete a specific history record
 * @param   id The _id of the history record
 * @param   userId The ID of the user (to ensure ownership)
 */
export const deleteItemById = async (id: string, userId: string): Promise<any> => {
  // Changed 'userId' to 'user' to ensure the security check works
  return await History.findOneAndDelete({ _id: id, user: userId });
};

/**
 * @desc    Create a new history record
 */
export const createHistoryRecord = async (data: Partial<IHistory>): Promise<IHistory> => {
  return await History.create(data);
};
