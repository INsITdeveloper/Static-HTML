import { NextApiRequest, NextApiResponse } from 'next';
import si from 'systeminformation';

// Fungsi untuk mendapatkan informasi penggunaan CPU
const getCpuUsage = async () => {
  try {
    const cpuData = await si.currentLoad();
    return cpuData.currentLoad; // Properti yang benar adalah currentLoad
  } catch (error) {
    console.error('Error fetching CPU usage:', error);
    return null;
  }
};

// Fungsi untuk mendapatkan informasi penggunaan RAM
const getRamUsage = async () => {
  try {
    const memData = await si.mem();
    return (memData.used / memData.total) * 100;
  } catch (error) {
    console.error('Error fetching RAM usage:', error);
    return null;
  }
};

// Fungsi untuk mendapatkan waktu server dalam format 12 jam (AM/PM) dengan zona waktu Asia/Jakarta
const getServerTime = () => {
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return now;
};

// Fungsi untuk mendapatkan informasi sistem operasi
const getOperatingSystem = async () => {
  try {
    const osData = await si.osInfo();
    return `${osData.distro} ${osData.release}`;
  } catch (error) {
    console.error('Error fetching OS info:', error);
    return null;
  }
};

// Fungsi untuk mendapatkan ping jaringan
const getNetworkPing = async () => {
  try {
    const pingData = await si.inetLatency();
    return pingData;
  } catch (error) {
    console.error('Error fetching network ping:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Mendapatkan informasi dari berbagai sumber
    const [cpuUsage, ramUsage, serverTime, operatingSystem, networkPing] = await Promise.all([
      getCpuUsage(),
      getRamUsage(),
      getServerTime(),
      getOperatingSystem(),
      getNetworkPing(),
    ]);

    // Menyusun data respons
    const responseData = {
      serverTime,
      ramUsage: `${ramUsage?.toFixed(2)}%`, // Konversi ke persentase dengan 2 desimal
      cpuUsage: `${cpuUsage?.toFixed(2)}%`, // Konversi ke persentase dengan 2 desimal
      operatingSystem,
      networkPing: `${networkPing} ms`
    };

    // Mengirim respons dengan data yang dikumpulkan
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching server info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
