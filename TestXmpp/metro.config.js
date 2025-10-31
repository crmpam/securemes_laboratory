const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
        // Prefer RN/browser builds from packages (avoids Node core deps)
        resolverMainFields: ['react-native', 'browser', 'module', 'main'],
        // Shim node:dns (and plain 'dns' just in case)
        extraNodeModules: {
            'node:dns': path.resolve(__dirname, 'shims/dns.js'),
            dns: path.resolve(__dirname, 'shims/dns.js'),
        },
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
