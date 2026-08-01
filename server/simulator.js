const TEMP_THRESHOLD = 80;
const MAX_HISTORY = 100;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function updateDevices(devices, history) {
  devices.forEach((device) => {
    const prevStatus = device.status;

    device.temperature = round1(
      clamp(device.temperature + (Math.random() - 0.5) * 6, 20, 100)
    );

    device.battery = round1(
      clamp(device.battery + (Math.random() - 0.5) * 4, 0, 100)
    );

    if (device.temperature >= TEMP_THRESHOLD) {
      device.status = 'warning';

      if (prevStatus !== 'warning') {
        history.push({
          id: `${device.id}-${Date.now()}`,
          deviceId: device.id,
          type: device.type,
          temperature: device.temperature,
          status: 'warning',
          timestamp: new Date().toISOString(),
          message: `온도 임계값(${TEMP_THRESHOLD}°C) 초과`,
        });

        if (history.length > MAX_HISTORY) {
          history.shift();
        }
      }
    } else {
      device.status = 'normal';
    }
  });

  return devices;
}

function startSimulator(devices, history, onUpdate) {
  setInterval(() => {
    const updated = updateDevices(devices, history);
    onUpdate(updated);
  }, 1000);
}

module.exports = { startSimulator, updateDevices, TEMP_THRESHOLD };
