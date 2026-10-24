// src/services/attendance.service.js

import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getTodayAttendance = async (params = {}) => {
  const { data } = await api.get(ENDPOINTS.ATTENDANCE, {
    params: {
      date: new Date().toISOString().slice(0, 10),
      ...params,
    },
  });

  return data.data;
};

export const getAttendanceHistory = async (params = {}) => {
  const { data } = await api.get(ENDPOINTS.ATTENDANCE, {
    params,
  });

  return data.data;
};

export const checkIn = async (payload = {}) => {
  const { data } = await api.post(
    `${ENDPOINTS.ATTENDANCE}/check-in`,
    payload,
  );

  return data.data;
};

export const checkOut = async (payload = {}) => {
  const { data } = await api.post(
    `${ENDPOINTS.ATTENDANCE}/check-out`,
    payload,
  );

  return data.data;
};

export const markEmployeeAttendance = async (payload) => {
  const { data } = await api.post(
    `${ENDPOINTS.ATTENDANCE}/mark`,
    payload,
  );

  return data.data;
};

export const getAttendanceEmployees = async (params = {}) => {
  const { data } = await api.get(
    `${ENDPOINTS.ATTENDANCE}/employees`,
    { params },
  );

  return data.data;
};

export const createEmployeeWithFace = async (payload) => {
  const { data } = await api.post(
    "/attendance/employees",
    payload
  );

  return data.data;
};