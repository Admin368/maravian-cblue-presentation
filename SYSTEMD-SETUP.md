# Alternative Setup: Using Systemd Service

If you prefer to use systemd directly instead of PM2, follow these steps:

## 1. Edit the service file

1. Open the provided `maravian-presentation.service` file and update:
   - Replace `<your-ubuntu-username>` with your actual Ubuntu username
   - Replace `/path/to/maravian-cblue-presentation` with the actual path (both occurrences)

## 2. Install the service

1. Copy the service file to systemd directory:
   ```bash
   sudo cp maravian-presentation.service /etc/systemd/system/
   ```

2. Reload systemd to recognize the new service:
   ```bash
   sudo systemctl daemon-reload
   ```

3. Enable the service to start on boot:
   ```bash
   sudo systemctl enable maravian-presentation
   ```

4. Start the service:
   ```bash
   sudo systemctl start maravian-presentation
   ```

## 3. Service Management Commands

- Check service status:
  ```bash
  sudo systemctl status maravian-presentation
  ```

- View logs:
  ```bash
  sudo journalctl -u maravian-presentation
  ```

- Restart the service:
  ```bash
  sudo systemctl restart maravian-presentation
  ```

- Stop the service:
  ```bash
  sudo systemctl stop maravian-presentation
  ```

## Note

The systemd method doesn't provide all the features of PM2 (like monitoring, cluster mode, etc.), but it offers a more native integration with the Ubuntu system.
