Cordova GPS Tracking
=============================================

## Compatibility

| Name                       | Version |
|----------------------------|---------|
| Cordova CLI                | 7.1.0   |
| Cordova-Android            | 6.3.0   |

## How to build

Build app

```
npm install
npm run build
```

App will be built into `www` folder.


Replace platform with one of supported platforms: android, ios. In this example we will build for Android.

```
cordova platform add android
cordova plugin add cordova-plugin-mauron85-background-geolocation
cordova build android
```

There is *after_platform_add* hook in config.xml which runs script that install all required plugins.

## Run on device

### iOS
You will need to install ios-deploy package.

```
npm -g install ios-deploy
```

```
cordova run ios --device
```

### Android
```
cordova run android --device
```

## Run in simulator

### iOS
You will need to install ios-sim package first
```
npm -g install ios-sim
```

Run in default emulator
```
cordova emulate ios
```

You can use cordova run ios --list to see all available targets and cordova run ios --target=target_name to run application on a specific device or emulator (for example, cordova run ios --target="iPhone-6").


### Android
To deploy the app on a default Android emulator.

```
cordova emulate android
```

You can use cordova run android --list to see all available targets and cordova run android --target=target_name to run application on a specific device or emulator (for example, cordova run android --target="Nexus4_emulator").

## Credits

* [transistorsoft](https://github.com/transistorsoft) for background-geolocation-console, cordova-background-geolocation and SampleApp.

### iOS quirks

If you're using XCode, boot the SampleApp in the iOS Simulator and enable ```Debug->Location->City Drive```.
