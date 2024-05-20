import { NextApiRequest, NextApiResponse } from 'next';
import si from 'systeminformation';
import axios from 'axios';

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

// Fungsi untuk mendapatkan kecepatan jaringan
const getNetworkSpeed = async () => {
  try {
    const networkData = await si.networkStats();
    if (networkData.length > 0) {
      const totalRxSec = networkData.reduce((acc, iface) => acc + iface.rx_sec, 0);
      const totalTxSec = networkData.reduce((acc, iface) => acc + iface.tx_sec, 0);
      return {
        totalDownloadSpeed: (totalRxSec / 1024).toFixed(2), // Konversi ke KBps
        totalUploadSpeed: (totalTxSec / 1024).toFixed(2), // Konversi ke KBps
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching network speed:', error);
    return null;
  }
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

// Fungsi untuk mendapatkan total visitor dari API eksternal
const getTotalVisitors = async () => {
  try {
    const response = await axios.get('https://sh.zanixon.xyz/');
    return response.data.totalVisitors; // Asumsi respons memiliki properti totalVisitors
  } catch (error) {
    console.error('Error fetching total visitors:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Mendapatkan informasi dari berbagai sumber
    const [cpuUsage, ramUsage, networkSpeed, osName, serverTime, totalVisitors] = await Promise.all([
      getCpuUsage(),
      getRamUsage(),
      getNetworkSpeed(),
      getOsName(),
      getServerTime(),
      getTotalVisitors(),
    ]);

    // Menyusun data respons
    const responseData = {
      serverTime,
      osName,
      ramUsage: `${ramUsage?.toFixed(2)}%`, // Konversi ke persentase dengan 2 desimal
      cpuUsage: `${cpuUsage?.toFixed(2)}%`, // Konversi ke persentase dengan 2 desimal
      networkSpeed: {
        totalDownloadSpeed: `${networkSpeed?.totalDownloadSpeed} KBps`,
        totalUploadSpeed: `${networkSpeed?.totalUploadSpeed} KBps`,
      },
      totalVisitors,
    };

    // Mengirim respons dengan data yang dikumpulkan
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching server info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
