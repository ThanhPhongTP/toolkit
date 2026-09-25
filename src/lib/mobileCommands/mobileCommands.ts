export type MobilePlatform = 'react-native' | 'flutter' | 'android' | 'ios'

export const PLATFORM_LABELS: Record<MobilePlatform, string> = {
  'react-native': 'React Native',
  flutter: 'Flutter',
  android: 'Android',
  ios: 'iOS',
}

export type ParamKey =
  | 'appName'
  | 'packageName'
  | 'bundleId'
  | 'deviceId'
  | 'udid'
  | 'simulator'
  | 'avd'
  | 'ip'
  | 'pairPort'
  | 'flavor'
  | 'buildType'
  | 'scheme'
  | 'workspace'
  | 'port'
  | 'apkPath'
  | 'aabPath'
  | 'appPath'
  | 'ipaPath'
  | 'keystore'
  | 'alias'
  | 'url'

export interface ParamDefinition {
  key: ParamKey
  label: string
  example: string
}

export const PARAMS: ParamDefinition[] = [
  { key: 'appName', label: 'App name', example: 'MyApp' },
  { key: 'packageName', label: 'Android package', example: 'com.example.app' },
  { key: 'bundleId', label: 'iOS bundle ID', example: 'com.example.app' },
  { key: 'deviceId', label: 'Device ID (adb / flutter)', example: 'emulator-5554' },
  { key: 'udid', label: 'iOS device UDID', example: '00008110-001A2B3C4D5E' },
  { key: 'simulator', label: 'iOS simulator', example: 'iPhone 16' },
  { key: 'avd', label: 'Android AVD', example: 'Pixel_8_API_35' },
  { key: 'ip', label: 'Device IP', example: '192.168.1.10' },
  { key: 'pairPort', label: 'Pairing port', example: '37099' },
  { key: 'flavor', label: 'Flavor', example: 'dev' },
  { key: 'buildType', label: 'Build type', example: 'debug' },
  { key: 'scheme', label: 'Xcode scheme', example: 'MyApp' },
  { key: 'workspace', label: 'Xcode workspace', example: 'MyApp' },
  { key: 'port', label: 'Metro port', example: '8081' },
  { key: 'apkPath', label: 'APK path', example: 'app-release.apk' },
  { key: 'aabPath', label: 'AAB path', example: 'app-release.aab' },
  { key: 'appPath', label: '.app path', example: 'build/MyApp.app' },
  { key: 'ipaPath', label: '.ipa path', example: 'build/MyApp.ipa' },
  { key: 'keystore', label: 'Keystore file', example: 'release.keystore' },
  { key: 'alias', label: 'Key alias', example: 'upload' },
  { key: 'url', label: 'Deep link URL', example: 'myapp://home' },
]

export type ParamValues = Partial<Record<ParamKey, string>>

export interface MobileCommand {
  id: string
  platform: MobilePlatform
  group: string
  title: string
  command: string
  description: string
  params: ParamKey[]
}

// {{key}} inserts the value as-is, {{key|cap}} capitalizes the first letter (e.g. gradle task names).
const PLACEHOLDER = /\{\{(\w+)(\|cap)?\}\}/g

type RawCommand = [group: string, title: string, command: string, description: string]

const RAW_COMMANDS: Record<MobilePlatform, RawCommand[]> = {
  'react-native': [
    ['Setup', 'Create a new project', 'npx @react-native-community/cli@latest init {{appName}}', 'Scaffold a bare React Native app.'],
    ['Setup', 'Create an Expo project', 'npx create-expo-app@latest {{appName}}', 'Scaffold a new Expo app.'],
    ['Setup', 'Check environment', 'npx react-native doctor', 'Diagnose and fix missing SDKs, JDK, CocoaPods, etc.'],
    ['Setup', 'Install iOS pods', 'cd ios && bundle exec pod install && cd ..', 'Install CocoaPods dependencies using the Gemfile version.'],
    ['Setup', 'Install pods (shortcut)', 'npx pod-install ios', 'Run pod install from the project root.'],
    ['Run', 'Start Metro', 'npx react-native start', 'Start the Metro bundler.'],
    ['Run', 'Start Metro with clean cache', 'npx react-native start --reset-cache', 'Start Metro after clearing its transform cache.'],
    ['Run', 'Start Metro on a custom port', 'npx react-native start --port {{port}}', 'Useful when 8081 is already in use.'],
    ['Run', 'Run on Android', 'npx react-native run-android --mode={{buildType}}', 'Build and install the Android app (debug or release).'],
    ['Run', 'Run on a specific Android device', 'npx react-native run-android --deviceId={{deviceId}}', 'Target one device when several are connected.'],
    ['Run', 'Run on iOS simulator', 'npx react-native run-ios --simulator="{{simulator}}"', 'Build and launch on the named simulator.'],
    ['Run', 'Run on a physical iPhone', 'npx react-native run-ios --udid={{udid}}', 'Build and launch on a connected device.'],
    ['Run', 'Run iOS in Release mode', 'npx react-native run-ios --mode Release', 'Build with the Release configuration.'],
    ['Run', 'Expo: start dev server', 'npx expo start', 'Start the Expo dev server.'],
    ['Run', 'Expo: start with clean cache', 'npx expo start --clear', 'Start the dev server after clearing the bundler cache.'],
    ['Run', 'Expo: run on Android', 'npx expo run:android', 'Compile the native Android project and run it.'],
    ['Run', 'Expo: run on iOS device', 'npx expo run:ios --device', 'Compile the native iOS project and pick a device.'],
    ['Build', 'Android release APK', 'cd android && ./gradlew assembleRelease && cd ..', 'Output: android/app/build/outputs/apk/release/.'],
    ['Build', 'Android release AAB', 'cd android && ./gradlew bundleRelease && cd ..', 'Output: android/app/build/outputs/bundle/release/.'],
    ['Build', 'Expo prebuild', 'npx expo prebuild --clean', 'Regenerate the android/ and ios/ folders.'],
    ['Build', 'EAS build Android', 'eas build --platform android --profile production', 'Build on Expo cloud servers.'],
    ['Build', 'EAS build iOS', 'eas build --platform ios --profile production', 'Build on Expo cloud servers.'],
    ['Build', 'EAS submit', 'eas submit --platform ios --latest', 'Upload the latest build to App Store Connect.'],
    [
      'Build',
      'Bundle JS for Android',
      'npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res',
      'Embed the JS bundle so the app runs without Metro.',
    ],
    ['Clean', 'Reset watchman', 'watchman watch-del-all', 'Clear watchman file watches.'],
    ['Clean', 'Reinstall node_modules', 'rm -rf node_modules && npm install', 'Fresh install of JS dependencies.'],
    ['Clean', 'Reinstall pods', 'cd ios && rm -rf Pods Podfile.lock && bundle exec pod install && cd ..', 'Remove and reinstall CocoaPods.'],
    ['Clean', 'Clean Android build', 'cd android && ./gradlew clean && cd ..', 'Remove Android build outputs.'],
    ['Clean', 'Clear Metro temp cache', 'rm -rf $TMPDIR/metro-* $TMPDIR/haste-map-*', 'Remove Metro caches from the temp directory.'],
    ['Clean', 'Clear Xcode DerivedData', 'rm -rf ~/Library/Developer/Xcode/DerivedData', 'Fix stale iOS build errors.'],
    ['Debug', 'Forward Metro port to Android', 'adb reverse tcp:{{port}} tcp:{{port}}', 'Let a USB device reach Metro on your machine.'],
    ['Debug', 'Open dev menu (Android)', 'adb shell input keyevent 82', 'Same as shaking the device.'],
    ['Debug', 'Reload app (Android)', 'adb shell input text "RR"', 'Trigger a JS reload.'],
    ['Debug', 'Android logs', 'npx react-native log-android', 'Stream JS logs from Android.'],
    ['Debug', 'Android logs (logcat filter)', 'adb logcat *:S ReactNative:V ReactNativeJS:V', 'Native and JS logs straight from logcat, without logkitty.'],
    ['Debug', 'iOS logs', 'npx react-native log-ios', 'Stream JS logs from iOS.'],
  ],
  flutter: [
    ['Setup', 'Check environment', 'flutter doctor -v', 'Show detailed toolchain status.'],
    ['Setup', 'Create a new project', 'flutter create {{appName}}', 'Scaffold a new Flutter app.'],
    ['Setup', 'Get dependencies', 'flutter pub get', 'Install packages from pubspec.yaml.'],
    ['Setup', 'Upgrade dependencies', 'flutter pub upgrade --major-versions', 'Upgrade packages, including major versions.'],
    ['Setup', 'List outdated packages', 'flutter pub outdated', 'Show packages that have newer versions.'],
    ['Setup', 'Upgrade Flutter SDK', 'flutter upgrade', 'Update Flutter to the latest version on the current channel.'],
    ['Setup', 'Switch channel', 'flutter channel stable', 'Switch to the stable channel.'],
    ['Run', 'List devices', 'flutter devices', 'Show connected devices and simulators.'],
    ['Run', 'List emulators', 'flutter emulators', 'Show available emulators.'],
    ['Run', 'Launch an emulator', 'flutter emulators --launch {{avd}}', 'Start an emulator by ID.'],
    ['Run', 'Run on a device', 'flutter run -d {{deviceId}}', 'Run in debug mode on the given device.'],
    ['Run', 'Run a flavor', 'flutter run --flavor {{flavor}} -t lib/main_{{flavor}}.dart', 'Run a flavor with its own entry point.'],
    ['Run', 'Run in release mode', 'flutter run --release', 'Run an optimized build (no hot reload).'],
    ['Run', 'Run in profile mode', 'flutter run --profile', 'Measure performance with DevTools.'],
    ['Run', 'Pass compile-time variables', 'flutter run --dart-define=ENV={{flavor}}', 'Read with String.fromEnvironment("ENV").'],
    ['Run', 'Attach to a running app', 'flutter attach -d {{deviceId}}', 'Reconnect hot reload to an app that is already running.'],
    ['Run', 'Stream logs', 'flutter logs -d {{deviceId}}', 'Show app logs from a device.'],
    ['Build', 'Build APK per ABI', 'flutter build apk --release --split-per-abi', 'Build smaller APKs, one for each CPU architecture.'],
    ['Build', 'Build App Bundle', 'flutter build appbundle --release --flavor {{flavor}}', 'Build an AAB for Google Play.'],
    ['Build', 'Build IPA', 'flutter build ipa --release --export-method ad-hoc', 'Export an IPA (app-store, ad-hoc, development, enterprise).'],
    ['Build', 'Build iOS without signing', 'flutter build ios --release --no-codesign', 'Useful on CI before signing in Xcode.'],
    ['Build', 'Obfuscated build', 'flutter build apk --release --obfuscate --split-debug-info=build/symbols', 'Obfuscate Dart code and keep symbols for crash reports.'],
    ['Build', 'Install built app', 'flutter install -d {{deviceId}}', 'Install the last build on a device.'],
    ['Code gen', 'Run build_runner', 'dart run build_runner build --delete-conflicting-outputs', 'Generate code (freezed, json_serializable, ...).'],
    ['Code gen', 'Watch build_runner', 'dart run build_runner watch --delete-conflicting-outputs', 'Regenerate code whenever files change.'],
    ['Code gen', 'Generate localizations', 'flutter gen-l10n', 'Generate code from ARB files.'],
    ['Code gen', 'Generate launcher icons', 'dart run flutter_launcher_icons', 'Requires the flutter_launcher_icons package.'],
    ['Code gen', 'Generate splash screen', 'dart run flutter_native_splash:create', 'Requires the flutter_native_splash package.'],
    ['Quality', 'Analyze code', 'flutter analyze', 'Run static analysis.'],
    ['Quality', 'Format code', 'dart format .', 'Format all Dart files.'],
    ['Quality', 'Apply automated fixes', 'dart fix --apply', 'Fix lints and deprecated APIs.'],
    ['Quality', 'Run unit tests', 'flutter test', 'Run tests in the test/ folder.'],
    ['Quality', 'Tests with coverage', 'flutter test --coverage', 'Write coverage to coverage/lcov.info.'],
    ['Quality', 'Integration tests', 'flutter test integration_test -d {{deviceId}}', 'Run integration tests on a device.'],
    ['Clean', 'Clean and refetch', 'flutter clean && flutter pub get', 'Delete build/ and .dart_tool/, then reinstall packages.'],
    ['Clean', 'Repair pub cache', 'flutter pub cache repair', 'Reinstall every package in the cache.'],
    ['Clean', 'Reinstall iOS pods', 'cd ios && pod deintegrate && pod install --repo-update && cd ..', 'Fix CocoaPods errors on iOS.'],
  ],
  android: [
    ['Device', 'List devices', 'adb devices -l', 'Show connected devices with model info.'],
    ['Device', 'Restart adb server', 'adb kill-server && adb start-server', 'Fix devices that are offline or not detected.'],
    ['Device', 'Enable Wi-Fi debugging', 'adb tcpip 5555', 'Switch a USB-connected device to TCP mode.'],
    ['Device', 'Connect over Wi-Fi', 'adb connect {{ip}}:5555', 'Connect to a device on the same network.'],
    ['Device', 'Pair wireless device (Android 11+)', 'adb pair {{ip}}:{{pairPort}}', 'Use the code from Developer options > Wireless debugging.'],
    ['Device', 'Shell on a specific device', 'adb -s {{deviceId}} shell', 'Open a shell when several devices are connected.'],
    ['Emulator', 'List AVDs', 'emulator -list-avds', 'Show installed virtual devices.'],
    ['Emulator', 'Start emulator', 'emulator -avd {{avd}}', 'Launch a virtual device.'],
    ['Emulator', 'Cold boot with wiped data', 'emulator -avd {{avd}} -wipe-data', 'Factory-reset the emulator.'],
    ['Emulator', 'Start without snapshot', 'emulator -avd {{avd}} -no-snapshot-load', 'Cold boot and skip the saved state.'],
    ['Emulator', 'Kill emulator', 'adb emu kill', 'Shut down the running emulator.'],
    ['App', 'Install APK', 'adb install -r {{apkPath}}', 'Install or reinstall and keep app data.'],
    ['App', 'Uninstall app', 'adb uninstall {{packageName}}', 'Remove the app from the device.'],
    ['App', 'Launch app', 'adb shell monkey -p {{packageName}} -c android.intent.category.LAUNCHER 1', 'Launch without knowing the activity name.'],
    ['App', 'Start an activity', 'adb shell am start -n {{packageName}}/.MainActivity', 'Start a specific activity.'],
    ['App', 'Force stop app', 'adb shell am force-stop {{packageName}}', 'Kill the app process.'],
    ['App', 'Clear app data', 'adb shell pm clear {{packageName}}', 'Reset the app to a fresh install state.'],
    ['App', 'Find package', 'adb shell pm list packages | grep {{packageName}}', 'Check whether the app is installed.'],
    ['App', 'Get APK path on device', 'adb shell pm path {{packageName}}', 'Show where the APK is installed.'],
    ['App', 'Open deep link', 'adb shell am start -a android.intent.action.VIEW -d "{{url}}"', 'Test deep links and app links.'],
    ['App', 'Grant permission', 'adb shell pm grant {{packageName}} android.permission.POST_NOTIFICATIONS', 'Grant a runtime permission without a dialog.'],
    ['App', 'Show app version', 'adb shell dumpsys package {{packageName}} | grep version', 'Print versionName and versionCode.'],
    ['Logs/Debug', 'Stream logcat', 'adb logcat', 'Show all device logs.'],
    ['Logs/Debug', 'Logcat for one app', 'adb logcat --pid=$(adb shell pidof -s {{packageName}})', 'Only logs from the running app process.'],
    ['Logs/Debug', 'Clear logcat', 'adb logcat -c', 'Clear the log buffer.'],
    ['Logs/Debug', 'Errors only', 'adb logcat *:E', 'Show only error-level logs.'],
    ['Logs/Debug', 'Current activity', 'adb shell dumpsys activity activities | grep mResumedActivity', 'Show which activity is on screen.'],
    ['Logs/Debug', 'Memory usage', 'adb shell dumpsys meminfo {{packageName}}', 'Show the app memory breakdown.'],
    ['Logs/Debug', 'Bug report', 'adb bugreport bugreport.zip', 'Collect a full diagnostic report.'],
    ['Notifications', 'Show active notifications', 'adb shell dumpsys notification --noredact', 'List posted notifications with their full content and channel.'],
    ['Notifications', 'Enable verbose FCM logs', 'adb shell setprop log.tag.FirebaseMessaging VERBOSE', 'Run once per device boot, then use the FCM logs command.'],
    ['Notifications', 'FCM logs', 'adb logcat -s FirebaseMessaging:V', 'See when Firebase messages arrive and how they are handled.'],
    ['Notifications', 'Notification system logs', 'adb logcat -s NotificationService:V', 'See whether the system posted or blocked a notification.'],
    ['Notifications', 'Check notification permission', 'adb shell dumpsys package {{packageName}} | grep POST_NOTIFICATIONS', 'Check that POST_NOTIFICATIONS is granted (Android 13+).'],
    ['Notifications', 'Post a test notification', 'adb shell cmd notification post -t "Test title" test_tag "Test message"', 'Post a notification from the shell to check that the device shows them.'],
    ['Files/Media', 'Screenshot', 'adb exec-out screencap -p > screen.png', 'Save a screenshot to your machine.'],
    ['Files/Media', 'Record screen', 'adb shell screenrecord /sdcard/record.mp4', 'Press Ctrl+C to stop, then pull the file.'],
    ['Files/Media', 'Push file', 'adb push ./file.txt /sdcard/Download/', 'Copy a file to the device.'],
    ['Files/Media', 'Pull file', 'adb pull /sdcard/record.mp4 .', 'Copy a file from the device.'],
    ['Files/Media', 'Browse app files', 'adb shell run-as {{packageName}} ls -la', 'List private app files (debuggable builds only).'],
    ['Files/Media', 'Type text', 'adb shell input text "hello"', 'Type into the focused field.'],
    ['Gradle', 'Assemble variant', './gradlew assemble{{flavor|cap}}{{buildType|cap}}', 'Build an APK for a flavor and build type.'],
    ['Gradle', 'Bundle release', './gradlew bundle{{flavor|cap}}Release', 'Build an AAB for Google Play.'],
    ['Gradle', 'Install variant', './gradlew install{{flavor|cap}}{{buildType|cap}}', 'Build and install on a connected device.'],
    ['Gradle', 'List tasks', './gradlew tasks --all', 'Show every available Gradle task.'],
    ['Gradle', 'Dependency tree', './gradlew app:dependencies', 'Debug dependency conflicts.'],
    ['Gradle', 'Clean', './gradlew clean', 'Delete build outputs.'],
    ['Gradle', 'Refresh dependencies', './gradlew build --refresh-dependencies', 'Ignore cached dependencies.'],
    ['Gradle', 'Signing report', './gradlew signingReport', 'Print SHA-1 and SHA-256 for every variant.'],
    ['Gradle', 'Run unit tests', './gradlew test', 'Run JVM unit tests.'],
    ['Gradle', 'Run lint', './gradlew lint', 'Run Android Lint checks.'],
    ['Gradle', 'Stop Gradle daemons', './gradlew --stop', 'Free memory or fix a stuck daemon.'],
    [
      'Signing',
      'Generate release keystore',
      'keytool -genkeypair -v -storetype PKCS12 -keystore {{keystore}} -alias {{alias}} -keyalg RSA -keysize 2048 -validity 10000',
      'Create an upload key.',
    ],
    ['Signing', 'Show keystore fingerprints', 'keytool -list -v -keystore {{keystore}} -alias {{alias}}', 'Get SHA-1 and SHA-256 for Firebase or Google Sign-In.'],
    [
      'Signing',
      'Debug keystore fingerprints',
      'keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android',
      'Get the debug SHA-1.',
    ],
    ['Signing', 'Verify APK signature', 'apksigner verify --print-certs {{apkPath}}', 'Check which certificate signed an APK.'],
    ['Signing', 'AAB to APKs', 'bundletool build-apks --bundle={{aabPath}} --output=app.apks --connected-device', 'Build APKs from an AAB for the connected device.'],
    ['Signing', 'Install APKs', 'bundletool install-apks --apks=app.apks', 'Install the output of build-apks.'],
  ],
  ios: [
    ['Simulator', 'List simulators', 'xcrun simctl list devices available', 'Show available simulators and their UDIDs.'],
    ['Simulator', 'Boot simulator', 'xcrun simctl boot "{{simulator}}"', 'Start a simulator by name or UDID.'],
    ['Simulator', 'Open Simulator app', 'open -a Simulator', 'Show the Simulator window.'],
    ['Simulator', 'Shut down all', 'xcrun simctl shutdown all', 'Stop every running simulator.'],
    ['Simulator', 'Erase all', 'xcrun simctl erase all', 'Reset all simulators (shut them down first).'],
    ['Simulator', 'Install app', 'xcrun simctl install booted {{appPath}}', 'Install a .app build on the booted simulator.'],
    ['Simulator', 'Launch app', 'xcrun simctl launch booted {{bundleId}}', 'Launch the app on the booted simulator.'],
    ['Simulator', 'Terminate app', 'xcrun simctl terminate booted {{bundleId}}', 'Kill the running app.'],
    ['Simulator', 'Uninstall app', 'xcrun simctl uninstall booted {{bundleId}}', 'Remove the app from the simulator.'],
    ['Simulator', 'Open deep link', 'xcrun simctl openurl booted "{{url}}"', 'Test URL schemes and universal links.'],
    ['Simulator', 'Screenshot', 'xcrun simctl io booted screenshot screen.png', 'Save a screenshot of the booted simulator.'],
    ['Simulator', 'Record video', 'xcrun simctl io booted recordVideo video.mp4', 'Press Ctrl+C to stop recording.'],
    ['Simulator', 'Send push notification', 'xcrun simctl push booted {{bundleId}} payload.apns', 'Send an APNs JSON payload.'],
    ['Simulator', 'Grant permission', 'xcrun simctl privacy booted grant photos {{bundleId}}', 'Grant access (photos, camera, location, ...).'],
    ['Simulator', 'App data folder', 'xcrun simctl get_app_container booted {{bundleId}} data', 'Show the path of the app sandbox.'],
    ['Simulator', 'Clean status bar', 'xcrun simctl status_bar booted override --time 9:41 --batteryLevel 100', 'Tidy the status bar for App Store screenshots.'],
    [
      'Notifications',
      'Send inline test push',
      'echo \'{"aps":{"alert":{"title":"Test","body":"Hello"},"sound":"default"}}\' | xcrun simctl push booted {{bundleId}} -',
      'Send a push to the booted simulator without creating a payload file.',
    ],
    [
      'Notifications',
      'Simulator notification logs',
      'xcrun simctl spawn booted log stream --level debug --predicate \'process == "{{appName}}" AND eventMessage CONTAINS[c] "notification"\'',
      'Stream the app logs that mention notifications.',
    ],
    ['Notifications', 'Device notification logs', 'idevicesyslog -u {{udid}} -m notification', 'Stream device logs that contain "notification" (brew install libimobiledevice).'],
    ['Device', 'List devices', 'xcrun xctrace list devices', 'Show connected devices and simulators.'],
    ['Device', 'List devices (Xcode 15+)', 'xcrun devicectl list devices', 'Show paired physical devices.'],
    ['Device', 'Install on device', 'xcrun devicectl device install app --device {{udid}} {{appPath}}', 'Install a .app on a physical device.'],
    ['Device', 'Launch on device', 'xcrun devicectl device process launch --device {{udid}} {{bundleId}}', 'Launch an installed app.'],
    ['Build', 'List schemes', 'xcodebuild -list -workspace {{workspace}}.xcworkspace', 'Show targets, schemes and configurations.'],
    [
      'Build',
      'Build for simulator',
      "xcodebuild -workspace {{workspace}}.xcworkspace -scheme {{scheme}} -configuration Debug -destination 'platform=iOS Simulator,name={{simulator}}' build",
      'Build a debug version for a simulator.',
    ],
    [
      'Build',
      'Archive',
      'xcodebuild -workspace {{workspace}}.xcworkspace -scheme {{scheme}} -configuration Release -archivePath build/{{scheme}}.xcarchive archive',
      'Create an .xcarchive for distribution.',
    ],
    [
      'Build',
      'Export IPA',
      'xcodebuild -exportArchive -archivePath build/{{scheme}}.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build/ipa',
      'Export an .ipa from an archive.',
    ],
    [
      'Build',
      'Run tests',
      "xcodebuild test -workspace {{workspace}}.xcworkspace -scheme {{scheme}} -destination 'platform=iOS Simulator,name={{simulator}}'",
      'Run unit and UI tests on a simulator.',
    ],
    ['Build', 'Show bundle ID', 'xcodebuild -showBuildSettings -workspace {{workspace}}.xcworkspace -scheme {{scheme}} | grep PRODUCT_BUNDLE_IDENTIFIER', 'Read build settings.'],
    ['Build', 'Active Xcode path', 'xcode-select -p', 'Show which Xcode the command line tools use.'],
    ['Build', 'Switch Xcode version', 'sudo xcode-select -s /Applications/Xcode.app', 'Select a different Xcode installation.'],
    ['CocoaPods/SPM', 'Install pods', 'pod install', 'Install dependencies from Podfile.lock.'],
    ['CocoaPods/SPM', 'Install with repo update', 'pod install --repo-update', 'Update the spec repo before installing.'],
    ['CocoaPods/SPM', 'Update pods', 'pod update', 'Update pods to the newest allowed versions.'],
    ['CocoaPods/SPM', 'Outdated pods', 'pod outdated', 'Show pods with newer versions.'],
    ['CocoaPods/SPM', 'Deintegrate', 'pod deintegrate', 'Remove CocoaPods from the Xcode project.'],
    ['CocoaPods/SPM', 'Clear pod cache', 'pod cache clean --all', 'Remove all cached pods.'],
    [
      'CocoaPods/SPM',
      'Resolve Swift packages',
      'xcodebuild -resolvePackageDependencies -workspace {{workspace}}.xcworkspace -scheme {{scheme}}',
      'Fetch SPM dependencies.',
    ],
    ['Clean', 'Clear DerivedData', 'rm -rf ~/Library/Developer/Xcode/DerivedData', 'Fix stale build errors.'],
    ['Clean', 'Clean build', 'xcodebuild clean -workspace {{workspace}}.xcworkspace -scheme {{scheme}}', 'Delete build products for a scheme.'],
    ['Clean', 'Delete unavailable simulators', 'xcrun simctl delete unavailable', 'Free disk space used by old runtimes.'],
    ['Clean', 'Clear SPM cache', 'rm -rf ~/Library/Caches/org.swift.swiftpm', 'Fix Swift package resolution errors.'],
    ['Signing/Upload', 'List signing identities', 'security find-identity -v -p codesigning', 'Show installed code-signing certificates.'],
    ['Signing/Upload', 'List provisioning profiles', 'ls ~/Library/MobileDevice/Provisioning\\ Profiles/', 'Show installed provisioning profiles.'],
    ['Signing/Upload', 'Inspect provisioning profile', 'security cms -D -i embedded.mobileprovision', 'Decode a profile to read its entitlements and devices.'],
    [
      'Signing/Upload',
      'Upload to App Store Connect',
      'xcrun altool --upload-app -f {{ipaPath}} -t ios -u "$APPLE_ID" -p "$APP_SPECIFIC_PASSWORD"',
      'Upload an IPA using an app-specific password.',
    ],
    ['Signing/Upload', 'fastlane: sync certificates', 'fastlane match development', 'Sync certificates and profiles with match.'],
    ['Signing/Upload', 'fastlane: build IPA', 'fastlane gym --scheme {{scheme}}', 'Build and sign an IPA.'],
    ['Signing/Upload', 'fastlane: upload to TestFlight', 'fastlane pilot upload --ipa {{ipaPath}}', 'Upload a build to TestFlight.'],
    [
      'Logs',
      'Simulator app logs',
      'xcrun simctl spawn booted log stream --level debug --predicate \'process == "{{appName}}"\'',
      'Stream logs from one app on the booted simulator.',
    ],
    ['Logs', 'Device logs', 'idevicesyslog -u {{udid}}', 'Stream device logs (brew install libimobiledevice).'],
    ['Logs', 'Crash reports', 'open ~/Library/Logs/DiagnosticReports', 'Open the folder of local crash logs.'],
  ],
}

function extractParams(command: string): ParamKey[] {
  const keys = new Set<ParamKey>()
  for (const match of command.matchAll(PLACEHOLDER)) keys.add(match[1] as ParamKey)
  return [...keys]
}

export const MOBILE_COMMANDS: MobileCommand[] = (Object.keys(RAW_COMMANDS) as MobilePlatform[]).flatMap((platform) =>
  RAW_COMMANDS[platform].map(([group, title, command, description], index) => ({
    id: `${platform}-${index}`,
    platform,
    group,
    title,
    command,
    description,
    params: extractParams(command),
  })),
)

export function fillCommand(template: string, values: ParamValues): string {
  return template.replace(PLACEHOLDER, (placeholder, key: string, cap?: string) => {
    const value = values[key as ParamKey]?.trim()
    if (!value) return placeholder
    return cap ? value.charAt(0).toUpperCase() + value.slice(1) : value
  })
}

export function searchMobileCommands(query: string, platform?: MobilePlatform): MobileCommand[] {
  const q = query.trim().toLowerCase()
  return MOBILE_COMMANDS.filter(
    (entry) =>
      (!platform || entry.platform === platform) &&
      (!q ||
        entry.title.toLowerCase().includes(q) ||
        entry.command.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.group.toLowerCase().includes(q)),
  )
}
