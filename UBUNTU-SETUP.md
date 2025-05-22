# Ubuntu Server Setup Guide for Maravian Presentation

## Prerequisites
- Node.js installed on your Ubuntu server
- Git installed to clone your repository

## Installation Steps

1. **Install PM2 globally**
   ```bash
   sudo npm install pm2 -g
   ```

2. **Clone your repository** (replace with your actual repository URL)
   ```bash
   git clone https://github.com/yourusername/maravian-cblue-presentation.git
   cd maravian-cblue-presentation
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or if you use pnpm
   pnpm install
   ```

4. **Start the server with PM2**
   ```bash
   pm2 start ecosystem.config.js
   ```

5. **Set PM2 to start on system boot**
   ```bash
   pm2 startup systemd
   ```
   - Then run the command it outputs (it will look like: `sudo env PATH=$PATH...`)

6. **Save the PM2 process list**
   ```bash
   pm2 save
   ```

## Managing Your Application

- **Check status**
  ```bash
  pm2 status
  ```

- **View logs**
  ```bash
  pm2 logs maravian-presentation
  ```

- **Restart the application**
  ```bash
  pm2 restart maravian-presentation
  ```

- **Stop the application**
  ```bash
  pm2 stop maravian-presentation
  ```

## Troubleshooting

- If your application crashes, PM2 will automatically restart it based on the configuration in `ecosystem.config.js`
- Check the logs with `pm2 logs maravian-presentation` to diagnose issues
- Monitor memory usage with `pm2 monit`

## Additional PM2 Commands

- **Update PM2**
  ```bash
  pm2 update
  ```

- **Monitor CPU/Memory**
  ```bash
  pm2 monit
  ```

- **Show detailed information**
  ```bash
  pm2 show maravian-presentation
  ```
