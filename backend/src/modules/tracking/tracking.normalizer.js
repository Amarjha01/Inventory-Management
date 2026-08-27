const normalizeDotrack = (response) => {
  const data = response?.data;

  if (!data) {
    throw new Error("Invalid Dotrack response");
  }

  return {
    id: data.id,

    provider: "dotrack",

    vehicleNo: data.vehicleNo ?? null,
    vehicleType: data.vehicleType ?? null,

    location: {
      latitude: Number(data.lat),
      longitude: Number(data.lng),
      heading: Number(data.gpsMeta?.direction ?? 0),
      address: data.gpsMeta?.address ?? null,

      previous: {
        latitude: Number(data.gpsMeta?.preLat ?? data.lat),
        longitude: Number(data.gpsMeta?.preLng ?? data.lng),
      },
    },

    movement: {
      speed: Number(data.speed ?? 0),
      status: normalizeDotrackStatus(data.vehicleStatus),
      rawStatus: data.vehicleStatus ?? null,
      ignition: Boolean(data.gpsMeta?.ignition),
    },

    connectivity: {
      battery: data.gpsMeta?.battery ?? null,
      batteryConnected: data.gpsMeta?.batteryConnected ?? null,
      gsmSignal: data.gpsMeta?.gsmSignals ?? null,
      satellites: data.gpsMeta?.satellites ?? null,
    },

    active: Boolean(data.active),

    timestamp:
      data.lastUpdated ??
      response.timestamp ??
      null,

    meta: {
      ac: data.ac ?? data.gpsMeta?.ac ?? null,
      charging: data.gpsMeta?.charging ?? null,
      gpsTracking: data.gpsMeta?.gpsTracking ?? null,
      locked: data.gpsMeta?.locked ?? null,
      panic: data.gpsMeta?.panic ?? null,
      parked: data.parked ?? null,
      relay: data.relay ?? null,
      buzzer: data.buzzer ?? null,
      dashcam: data.dashcam ?? null,
      todayKm: data.todayKm ?? null,
      totalKm: data.totalKm ?? null,
      maxSpeed: data.maxSpeed ?? null,
      avgSpeed: data.avgSpeed ?? null,
    },
  };
};

const normalizeDotrackStatus = (status) => {
  if (!status) {
    return "UNKNOWN";
  }

  const normalized = status.toUpperCase();

  if (normalized.includes("RUN")) {
    return "RUNNING";
  }

  if (normalized.includes("IDLE")) {
    return "IDLE";
  }

  if (
    normalized.includes("STOP") ||
    normalized.includes("PARK")
  ) {
    return "STOPPED";
  }

  if (normalized.includes("OFFLINE")) {
    return "OFFLINE";
  }

  return "UNKNOWN";
};

const normalizeTrack360 = (response) => {
  const data = response?.data;

  if (!data) {
    throw new Error("Invalid Track360 response");
  }

  return {
    id: String(data.device_id),

    provider: "track360",

    vehicleNo: data.device_name ?? null,
    vehicleType: data.category ?? null,

    location: {
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      heading: Number(data.course ?? 0),
      address: data.address ?? null,

      previous: null,
    },

    movement: {
      speed: Number(data.speed ?? 0),
      status: normalizeTrack360Status(data.device_status),
      rawStatus: data.device_status ?? null,
      ignition: normalizeTrack360Ignition(
        data.device_status
      ),
    },

    connectivity: {
      battery: null,
      batteryConnected: null,
      gsmSignal: null,
      satellites: null,
    },

    active: data.device_status !== "OFFLINE",

    timestamp: data.last_update ?? null,

    meta: {
      filterStatus: data.filter_status ?? null,
      serverId: data.server_id ?? null,
      validTill: data.valid_till ?? null,
    },
  };
};

const normalizeTrack360Status = (status) => {
  if (!status) {
    return "UNKNOWN";
  }

  const normalized = status.toUpperCase();

  if (normalized.includes("IGNITION ON")) {
    return "RUNNING";
  }

  if (normalized.includes("IGNITION OFF")) {
    return "STOPPED";
  }

  if (normalized.includes("IDLE")) {
    return "IDLE";
  }

  if (normalized.includes("OFFLINE")) {
    return "OFFLINE";
  }

  return "UNKNOWN";
};

const normalizeTrack360Ignition = (status) => {
  if (!status) {
    return false;
  }

  return status
    .toUpperCase()
    .includes("IGNITION ON");
};

export {
  normalizeDotrack,
  normalizeTrack360,
};