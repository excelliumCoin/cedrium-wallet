// pages/api/fund.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { authKey, amount } = req.body;

  if (!authKey || !amount) {
    return res.status(400).json({ error: 'authKey ve amount gerekli' });
  }

  try {
    const response = await axios.post(
      `https://faucet-api.cedra.dev/mint?amount=${amount}&auth_key=${authKey}`,
      ''
    );
    return res.status(200).json({ success: true, data: response.data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
