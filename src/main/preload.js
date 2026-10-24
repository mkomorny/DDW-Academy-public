'use strict';

const { contextBridge, ipcRenderer } = require('electron');

// The renderer gets exactly these calls and nothing else — no `require`,
// no filesystem, no shell. Everything the course needs is either bundled data
// or goes through this narrow surface.
contextBridge.exposeInMainWorld('conservatory', {
  loadProgress: () => ipcRenderer.invoke('progress:load'),
  saveProgress: (data) => ipcRenderer.invoke('progress:save', data),
  revealProgress: () => ipcRenderer.invoke('progress:reveal'),
  appInfo: () => ipcRenderer.invoke('app:info'),
});

// AI bridge: the renderer only ever sends a key (once, to configure) or a
// prompt (to complete) and gets structured results back — the API key itself
// never reaches the renderer, only a masked preview. See src/main/main.js's
// ai:* handlers and src/main/ai-providers.js for what actually runs.
contextBridge.exposeInMainWorld('ai', {
  status: () => ipcRenderer.invoke('ai:status'),
  setKey: (key) => ipcRenderer.invoke('ai:setKey', key),
  setModel: (modelId) => ipcRenderer.invoke('ai:setModel', modelId),
  testModel: (modelId) => ipcRenderer.invoke('ai:testModel', modelId),
  clear: () => ipcRenderer.invoke('ai:clear'),
  complete: (opts) => ipcRenderer.invoke('ai:complete', opts),
  rewriteSection: (text, level) => ipcRenderer.invoke('ai:rewriteSection', text, level),
});
