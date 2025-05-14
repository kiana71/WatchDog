// Mock clients data
export const mockClients = [
  {
    id: '1',
    name: null,
    description: null,
    computerName: 'SIGNAGE-LOBBY-01',
    ipAddress: '192.168.1.101',
    publicIpAddress: '203.0.113.45',
    macAddress: '00:1A:2B:3C:4D:5E',
    osName: 'Windows 10 Pro',
    buildNumber: '19044.2846',
    cpu: 'Intel Core i5-10400 @ 2.90GHz',
    totalMemory: 8192, // 8GB in MB
    storage: {
      total: 500, // GB
      free: 320, // GB
      type: 'SSD'
    },
    graphicsCard: 'Intel UHD Graphics 630',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    version: '1.2.0',
    uptimeHours: 8.5,
  },
  {
    id: '2',
    name: null,
    description: null,
    computerName: 'SIGNAGE-CONF-A',
    ipAddress: '192.168.1.102',
    publicIpAddress: '203.0.113.46',
    macAddress: '00:1A:2B:3C:4D:5F',
    osName: 'Windows 11 Enterprise',
    buildNumber: '22621.1928',
    cpu: 'Intel Core i7-11700 @ 3.60GHz',
    totalMemory: 16384, // 16GB in MB
    storage: {
      total: 1000, // GB
      free: 780, // GB
      type: 'NVMe SSD'
    },
    graphicsCard: 'NVIDIA RTX 3050',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    version: '1.2.0',
    uptimeHours: 5.3,
  },
  {
    id: '3',
    name: null,
    description: null,
    computerName: 'SIGNAGE-CAFE-01',
    ipAddress: '192.168.1.103',
    publicIpAddress: '203.0.113.47',
    macAddress: '00:1A:2B:3C:4D:60',
    osName: 'macOS Sonoma 14.3',
    buildNumber: '23D56',
    cpu: 'Apple M1',
    totalMemory: 8192, // 8GB in MB
    storage: {
      total: 256, // GB
      free: 180, // GB
      type: 'NVMe SSD'
    },
    graphicsCard: 'Apple M1 Integrated Graphics',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    version: '1.1.5',
    uptimeHours: 0,
  },
  {
    id: '4',
    name: null,
    description: null,
    computerName: 'SIGNAGE-RECEP-01',
    ipAddress: '192.168.1.104',
    publicIpAddress: '203.0.113.48',
    macAddress: '00:1A:2B:3C:4D:61',
    osName: 'Ubuntu Linux 22.04 LTS',
    buildNumber: '22.04.3',
    cpu: 'AMD Ryzen 5 5600G @ 3.9GHz',
    totalMemory: 16384, // 16GB in MB
    storage: {
      total: 512, // GB
      free: 350, // GB
      type: 'SATA SSD'
    },
    graphicsCard: 'AMD Radeon Vega 7',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    version: '1.2.0',
    uptimeHours: 12.7,
  },
  {
    id: '5',
    name: null,
    description: null,
    computerName: 'SIGNAGE-EXEC-01',
    ipAddress: '192.168.1.105',
    publicIpAddress: '203.0.113.49',
    macAddress: '00:1A:2B:3C:4D:62',
    osName: 'Windows 10 Enterprise LTSC',
    buildNumber: '1809.17763.4645',
    cpu: 'Intel Core i3-10100 @ 3.60GHz',
    totalMemory: 4096, // 4GB in MB
    storage: {
      total: 240, // GB
      free: 180, // GB
      type: 'SATA SSD'
    },
    graphicsCard: 'Intel UHD Graphics 630',
    isOnline: true,
    lastSeen: new Date(Date.now() - 60000 * 3).toISOString(), // 3 minutes ago
    version: '1.2.0',
    uptimeHours: 3.1,
  },
];

// Mock client actions
export const mockActions = [
  {
    id: '1',
    clientId: '1',
    type: 'reboot',
    status: 'completed',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    result: 'Success',
  },
  {
    id: '2',
    clientId: '3',
    type: 'reboot',
    status: 'failed',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    result: 'Connection timeout',
  },
];