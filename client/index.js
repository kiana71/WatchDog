import WebSocket from 'ws';
import os from 'os';
import { exec } from 'child_process';
import osUtils from 'node-os-utils';
import path from 'path';

const SERVER_URL = 'ws://your-server-url:8080';
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

class WatchdogClient {
  constructor() {
    this.computerName = os.hostname();
    this.ipAddress = this.getIPAddress();
    this.version = '1.0.0';
    this.isConnected = false;
    this.reconnectAttempts = 0;
  }

  getIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
      for (const alias of iface) {
        if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address;
        }
      }
    }
    return '127.0.0.1';
  }

  async connect() {
    try {
      this.ws = new WebSocket(SERVER_URL);

      this.ws.on('open', () => {
        console.log('Connected to server');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.sendClientInfo();
        this.startHeartbeat();
      });

      this.ws.on('message', async (data) => {
        const message = JSON.parse(data);
        await this.handleCommand(message);
      });

      this.ws.on('close', () => {
        console.log('Disconnected from server');
        this.isConnected = false;
        this.reconnect();
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.reconnect();
      });
    } catch (error) {
      console.error('Connection error:', error);
      this.reconnect();
    }
  }

  reconnect() {
    if (this.reconnectAttempts < 5) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), delay);
    }
  }

  async sendClientInfo() {
    const info = {
      type: 'client_info',
      data: {
        computerName: this.computerName,
        ipAddress: this.ipAddress,
        version: this.version,
        uptimeHours: os.uptime() / 3600,
        cpuUsage: await osUtils.cpu.usage(),
        memoryUsage: await osUtils.mem.info(),
      }
    };
    this.send(info);
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'heartbeat' });
      }
    }, HEARTBEAT_INTERVAL);
  }

  async handleCommand(message) {
    switch (message.type) {
      case 'reboot':
        await this.rebootSystem();
        break;
      case 'shutdown':
        await this.shutdownSystem();
        break;
      default:
        console.log('Unknown command:', message.type);
    }
  }

  async rebootSystem() {
    this.send({ type: 'reboot_initiated' });
    exec('shutdown /r /t 5', (error) => {
      if (error) {
        console.error('Reboot error:', error);
        this.send({ type: 'reboot_failed', error: error.message });
      }
    });
  }

  async shutdownSystem() {
    this.send({ type: 'shutdown_initiated' });
    exec('shutdown /s /t 5', (error) => {
      if (error) {
        console.error('Shutdown error:', error);
        this.send({ type: 'shutdown_failed', error: error.message });
      }
    });
  }

  send(data) {
    if (this.isConnected) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

const client = new WatchdogClient();
client.connect();