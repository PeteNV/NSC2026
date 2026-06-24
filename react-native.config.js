module.exports = {
  dependencies: {
    'room-scanner': {
      root: './modules/room-scanner',
      platforms: {
        ios: {
          podspecPath: './modules/room-scanner/room-scanner.podspec',
        },
      },
    },
  },
};
