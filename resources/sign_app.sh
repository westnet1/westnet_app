ionic cordova plugin rm cordova-plugin-console
ionic cordova build --release --prod android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore resources/google_play/westnet.keystore -storepass W3stn3T**20I8// platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk westnet_app
zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk Westnet_1.2.1.apk
