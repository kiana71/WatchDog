// Mock clients data
export const mockClients = [
  {
    id: '1',
    name: 'Lobby Display',
    computerName: 'SIGNAGE-LOBBY-01',
    ipAddress: '192.168.1.101',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    screenshot: 'https://images.pexels.com/photos/6633920/pexels-photo-6633920.jpeg',
    version: '1.2.0',
    uptimeHours: 8.5,
  },
  {
    id: '2',
    name: 'Conference Room A',
    computerName: 'SIGNAGE-CONF-A',
    ipAddress: '192.168.1.102',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    screenshot: 'https://images.pexels.com/photos/7181166/pexels-photo-7181166.jpeg',
    version: '1.2.0',
    uptimeHours: 5.3,
  },
  {
    id: '3',
    name: 'Cafeteria Display',
    computerName: 'SIGNAGE-CAFE-01',
    ipAddress: '192.168.1.103',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    screenshot: 'https://images.pexels.com/photos/8117889/pexels-photo-8117889.jpeg',
    version: '1.1.5',
    uptimeHours: 0,
  },
  {
    id: '4',
    name: 'Reception Area',
    computerName: 'SIGNAGE-RECEP-01',
    ipAddress: '192.168.1.104',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    screenshot: 'https://images.pexels.com/photos/7256899/pexels-photo-7256899.jpeg',
    version: '1.2.0',
    uptimeHours: 12.7,
  },
  {
    id: '5',
    name: 'Executive Hallway',
    computerName: 'SIGNAGE-EXEC-01',
    ipAddress: '192.168.1.105',
    isOnline: true,
    lastSeen: new Date(Date.now() - 60000 * 3).toISOString(), // 3 minutes ago
    screenshot: 'https://images.pexels.com/photos/8117886/pexels-photo-8117886.jpeg',
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
  {
    id: '3',
    clientId: '2',
    type: 'screenshot',
    status: 'completed',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    result: 'Success',
  },
];