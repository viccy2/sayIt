import { Response } from 'express';
import History from '../models/history.model';

export const getUserHistory = async (req: any, res: Response): Promise<any> => {
  try {
    // 1. Get the ID and clean it
    const rawId = req.user?._id;
    if (!rawId) return res.status(401).json({ message: 'Unauthorized' });

    // Convert to string and remove any hidden spaces/newlines
    const cleanId = String(rawId).trim();

    console.log(`--- DEBUGGING HISTORY ---`);
    console.log(`Request User ID: "${cleanId}" (Length: ${cleanId.length})`);

    // 2. Try to find JUST ONE record globally to compare
    const sample = await History.findOne({}).lean();
    if (sample) {
      console.log(`Atlas Sample User ID: "${sample.user}" (Length: ${String(sample.user).length})`);
      console.log(`Do they match exactly?: ${String(sample.user) === cleanId}`);
    } else {
      console.log("❌ Database check: The collection 'histories' appears to be EMPTY to this query.");
    }

    // 3. The Query
    const history = await History.find({ user: cleanId })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📊 Records found for ${cleanId}: ${history.length}`);
    console.log(`--- DEBUGGING END ---`);
    
    return res.status(200).json(history);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
