import History from '../models/history.model';

export const getHistoryByUserId = async (userId: string) => {
  return await History.find({ userId }).sort({ createdAt: -1 });
};

export const deleteItemById = async (id: string, userId: string) => {
  // We add userId to the delete check to ensure users can't delete each other's items
  return await History.findOneAndDelete({ _id: id, userId });
};
