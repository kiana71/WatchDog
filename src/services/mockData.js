// Mock clients data
export const mockClients = [
  {
    id: '1',
    name: 'Lobby Display',
    computerName: 'SIGNAGE-LOBBY-01',
    ipAddress: '192.168.1.101',
    macAddress: '00:1A:2B:3C:4D:5E',
    osName: 'Windows 10 Pro',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    version: '1.2.0',
    uptimeHours: 8.5,
  },
  {
    id: '2',
    name: 'Conference Room A',
    computerName: 'SIGNAGE-CONF-A',
    ipAddress: '192.168.1.102',
    macAddress: '00:1A:2B:3C:4D:5F',
    osName: 'Windows 11 Enterprise',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    version: '1.2.0',
    uptimeHours: 5.3,
  },
  {
    id: '3',
    name: 'Cafeteria Display',
    computerName: 'SIGNAGE-CAFE-01',
    ipAddress: '192.168.1.103',
    macAddress: '00:1A:2B:3C:4D:60',
    osName: 'macOS Sonoma 14.3',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    version: '1.1.5',
    uptimeHours: 0,
  },
  {
    id: '4',
    name: 'Reception Area',
    computerName: 'SIGNAGE-RECEP-01',
    ipAddress: '192.168.1.104',
    macAddress: '00:1A:2B:3C:4D:61',
    osName: 'Ubuntu Linux 22.04 LTS',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    version: '1.2.0',
    uptimeHours: 12.7,
  },
  {
    id: '5',
    name: 'Executive Hallway',
    computerName: 'SIGNAGE-EXEC-01',
    ipAddress: '192.168.1.105',
    macAddress: '00:1A:2B:3C:4D:62',
    osName: 'Windows 10 Enterprise LTSC',
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