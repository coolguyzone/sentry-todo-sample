import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite plugin that patches the global WebSocket constructor during development
 * to buffer `send()` calls until the connection is in the OPEN state.
 *
 * This prevents the "send was called before connect" error thrown by
 * `/@vite/client` when HMR messages are dispatched before the WebSocket
 * handshake completes.
 */
function bufferHmrSend(): Plugin {
  return {
    name: 'buffer-hmr-send',
    apply: 'serve',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          // Injected as a classic (non-module) script at the very top of
          // <head> so it executes synchronously before Vite's module-based
          // HMR client creates its WebSocket.
          children: `(function(){var N=window.WebSocket;window.WebSocket=function(u,p){var s=p!==void 0?new N(u,p):new N(u),q=[],send=s.send.bind(s);s.send=function(d){if(s.readyState===N.OPEN){send(d)}else{q.push(d)}};s.addEventListener("open",function(){for(var i=0;i<q.length;i++){send(q[i])}q.length=0});return s};window.WebSocket.prototype=N.prototype;window.WebSocket.CONNECTING=N.CONNECTING;window.WebSocket.OPEN=N.OPEN;window.WebSocket.CLOSING=N.CLOSING;window.WebSocket.CLOSED=N.CLOSED})();`,
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [bufferHmrSend(), react()],
})
