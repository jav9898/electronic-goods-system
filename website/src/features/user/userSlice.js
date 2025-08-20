import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    id: 1,
    name: 'Shop Manager',
    email: 'manager@gyakusou.com',
    role: 'admin',
    avatar: null,
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    }
  },
  settings: {
    autoSave: true,
    showLowStockAlerts: true,
    defaultView: 'grid',
    itemsPerPage: 20
  },
  isAuthenticated: true,
  lastLogin: new Date().toISOString(),
  permissions: ['read', 'write', 'delete', 'admin']
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    updatePreferences: (state, action) => {
      state.profile.preferences = { ...state.profile.preferences, ...action.payload };
    },
    setAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
      if (action.payload) {
        state.lastLogin = new Date().toISOString();
      }
    },
    updatePermissions: (state, action) => {
      state.permissions = action.payload;
    },
    toggleNotifications: (state) => {
      state.profile.preferences.notifications = !state.profile.preferences.notifications;
    },
    setTheme: (state, action) => {
      state.profile.preferences.theme = action.payload;
    }
  }
});

export const {
  updateProfile,
  updateSettings,
  updatePreferences,
  setAuthentication,
  updatePermissions,
  toggleNotifications,
  setTheme
} = userSlice.actions;

// Selectors
export const selectUserProfile = state => state.user.profile;
export const selectUserSettings = state => state.user.settings;
export const selectUserPreferences = state => state.user.profile.preferences;
export const selectIsAuthenticated = state => state.user.isAuthenticated;
export const selectUserPermissions = state => state.user.permissions;
export const selectLastLogin = state => state.user.lastLogin;

export default userSlice.reducer;
