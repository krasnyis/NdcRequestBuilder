const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppName: () => ipcRenderer.invoke('get-app-name'),
  
  // NDC request processing
  processNdcRequest: (requestData) => ipcRenderer.invoke('process-ndc-request', requestData),
  
  // Menu event listeners
  onMenuNewRequest: (callback) => ipcRenderer.on('menu-new-request', callback),
  onMenuOpenRequest: (callback) => ipcRenderer.on('menu-open-request', callback),
  onMenuSaveRequest: (callback) => ipcRenderer.on('menu-save-request', callback),
  onMenuAbout: (callback) => ipcRenderer.on('menu-about', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});