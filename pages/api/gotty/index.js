const useGotty = require('use-gotty');

export default async function handler(req, res) {
  try {
    const httpServer = await useGotty(process.cwd(), ['sh'], 6666);
    res.status(200).json({ url: httpServer.url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start gotty' });
  }
}
