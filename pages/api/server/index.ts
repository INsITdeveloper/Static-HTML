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

// Fungsi untuk mendapatkan kecepatan jaringan secara acak
const getRandomNetworkSpeed = () => {
  // Menghasilkan kecepatan download dan upload secara acak antara 0 dan 1Gbps
  const maxSpeed = 1 * 1024 * 1024; // 1Gbps dalam KBps
  const totalDownloadSpeed = (Math.random() * maxSpeed).toFixed(2);
  const totalUploadSpeed = (Math.random() * maxSpeed).toFixed(2);

  return {
    totalDownloadSpeed,
    totalUploadSpeed
  };
};

// Fungsi untuk mendapatkan nama OS
const getOsName = async () => {
  try {
    const osData = await si.osInfo();
    if (osData.platform === 'linux') {
      return 'Linux Stabile';
    } else if (osData.platform === 'win32') {
      return 'Windows Stabile';
    } else {
      return osData.platform; // Nama platform lainnya
    }
  } catch (error) {
    console.error('Error fetching OS name:', error);
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Mendapatkan informasi dari berbagai sumber
    const [cpuUsage, ramUsage, osName, serverTime] = await Promise.all([
      getCpuUsage(),
      getRamUsage(),
      getOsName(),
      getServerTime(),
    ]);

    const networkSpeed = getRandomNetworkSpeed();

    // Menyusun data respons
    const responseData = {
      serverTime,
      osName,
      ramUsage: `${ramUsage?.toFixed(2)}%`, // Konversi ke persentase dengan 2 desimal
      cpuUsage: `${cpuUsage?.toFixed(2)}%`, // Konversi ke persentase dengan 2 desimal
      networkSpeed: {
        totalDownloadSpeed: `${networkSpeed.totalDownloadSpeed} KBps`,
        totalUploadSpeed: `${networkSpeed.totalUploadSpeed} KBps`,
      }
    };

    // Mengirim respons dengan data yang dikumpulkan
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching server info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
