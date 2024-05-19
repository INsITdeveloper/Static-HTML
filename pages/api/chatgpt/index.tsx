import { NextApiRequest, NextApiResponse } from 'next';
import jarifapi from 'jarif-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const pgen = await jarifapi.promptgen('cat');
    res.status(200).json(pgen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
