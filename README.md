# Digital Signage Watchdog System

A comprehensive monitoring system for digital signage displays.

## Dashboard Deployment

### Prerequisites
- Node.js 18 or higher
- A hosting service (e.g., Netlify, Vercel)

### Environment Variables
Before deploying, make sure to set up the following environment variable:

```bash
VITE_RELEASE_URL=https://github.com/your-org/digital-signage-watchdog/releases/download/latest
```

This should point to your actual release server where the client binaries are hosted.

### Deployment Steps

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Build the project:
```bash
npm run build
```
4. Deploy the `dist` folder to your hosting service

## Client Installation

### Windows Installation

1. Download the latest client release
2. Extract the ZIP file to a permanent location (e.g., `C:\Program Files\Digital Signage Watchdog`)
3. Open Command Prompt as Administrator
4. Navigate to the installation directory:
```cmd
cd "C:\Program Files\Digital Signage Watchdog"
```
5. Install dependencies and service:
```cmd
npm install
node install-service.js
```

The watchdog will automatically:
- Start with Windows
- Run in the background
- Reconnect if connection is lost
- Update automatically when new versions are available

### macOS Installation

1. Download the latest client release
2. Extract the ZIP file to Applications folder
3. Open Terminal
4. Navigate to the installation directory:
```bash
cd "/Applications/Digital Signage Watchdog"
```
5. Install dependencies and launch agent:
```bash
npm install
sudo node install-service-mac.js
```

## Configuration

Edit `config.js` in the client installation directory:

```javascript
{
  "serverUrl": "wss://your-dashboard-url.com",
  "screenshotInterval": 60000,  // milliseconds
  "heartbeatInterval": 30000    // milliseconds
}
```

## Troubleshooting

### Windows
- Check Windows Services for "Digital Signage Watchdog"
- View logs in Event Viewer under "Applications"
- Restart service: `net stop "Digital Signage Watchdog" && net start "Digital Signage Watchdog"`

### macOS
- Check service status: `launchctl list | grep watchdog`
- View logs: `log show --predicate 'processImagePath contains "watchdog"'`
- Restart service: `launchctl unload ~/Library/LaunchAgents/com.watchdog.plist && launchctl load ~/Library/LaunchAgents/com.watchdog.plist`