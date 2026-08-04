import History, { IHistory } from '../models/history.model';

export const getHistoryByUserId = async (userId: string): Promise<IHistory[]> => {
  return await History.find({ user: userId }).sort({ createdAt: -1 });
};

export const deleteItemById = async (id: string, userId: string): Promise<any> => {
  return await History.findOneAndDelete({ _id: id, user: userId });
};

export const createHistoryRecord = async (data: Partial<IHistory>): Promise<IHistory> => {
  return await History.create(data);
};
