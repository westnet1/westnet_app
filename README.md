1) Download Android Studio https://developer.android.com/studio?
	yes | sdkmanager --licenses

2) Install Java 8
	sudo apt install openjdk-8-jdk

3) Clonar repositorio
	git clone https://github.com/westnet1/westnet_app

4) Install NPM
	sudo apt install -y npm

5) Install NVM
	https://github.com/nvm-sh/nvm

6) Install NodeJs latest version
	nvm install --lts

7) Install dependencies
	cd $PATH/westnet_app
	npm i

8) Install library Ionic
	npm install -g @ionic/cli

9) Install library Cordova
	 npm i -g cordova

10) Add platform android in project
	ionic cordova platform add android@8.0.0

11) Configure file ~/.bashrc
	insert “
export ANDROID_HOME=/home/${user}/Android/Sdk
export ANDROID_SDK_ROOT=/home/${user}/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64
export JAVAC_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64/bin/javac
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
“
source ~/.bashrc


12) Install Gradle
	sudo apt install -y gradle

13) Copy network_security_config.xml
	cp westnet_app/network_security_config.xml platforms/android/app/src/main/res/xml

14) Install Zipalign
    sudo apt install -y zipalign

15) Build projecto to production
    ionic cordova build android --prod –release

16) Generate APK in environment of production
	ionic cordova plugin rm cordova-plugin-console
	ionic cordova build android –

	ionic cordova plugin rm cordova-plugin-console

    ionic cordova build --release --prod android

    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore resources/google_play/westnet.keystore -storepass W3stn3T**20I8// platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk westnet_app

    zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ${NAME_APP}.apk


Error : Failed to install the following Android SDK packages as some licences have not been accepted.
	yes | sdkmanager --licenses
