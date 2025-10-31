/**
 * @format
 */

import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Ensure global.crypto exists
if (typeof global.crypto !== 'object') {
  global.crypto = {};
}

// Ensure getRandomValues exists (react-native-get-random-values provides it)
if (typeof global.crypto.getRandomValues !== 'function') {
  // safety: import again if needed
  require('react-native-get-random-values');
}

// Polyfill randomUUID for RN
if (typeof global.crypto.randomUUID !== 'function') {
  global.crypto.randomUUID = () => {
    const buf = new Uint8Array(16);
    global.crypto.getRandomValues(buf);
    // Per RFC 4122 §4.4 (version 4)
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const hex = [...buf].map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  };
}
AppRegistry.registerComponent(appName, () => App);
