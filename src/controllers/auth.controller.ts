import { Request, Response } from 'express';

export const googleCallback = (req: Request, res: Response) => {
  // Successful authentication, redirect to Vue frontend history page
  res.redirect(`${process.env.CLIENT_URL}/history`);
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

export const getUser = (req: Request, res: Response) => {
  // Returns the logged-in user's profile to the Vue app
  res.json(req.user || null);
};
