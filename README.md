# Vaultage cross platform mobile app

Based on react-native.

## Objectives

1. Mobile-friendly UI to fetch passwords (with clipboard feature!)
2. Maybe: UI to manage passwords

## Developing

You need to be familiar with [react](https://reactjs.org/) and [redux](https://redux.js.org/). Learning the fundamentals of [react-native](https://facebook.github.io/react-native/) may not hurt.

## Devlog

You need:
-  an IOs or android devkit. Refer to the appropriate doc for setup instructions. 
-  An emulator OR a physical device with debug enabled.

### Running the app

- `npm run android` to run an avd or android device (preferred on Linux, windows)
- `npm run ios` to run on IOs device or IOs emulator (preferred on Mac)
- `npm run windows-phone` run on wi... lol jk

Shake the device to open the developer menu. Chose _enable live reload_ in the menu. Sometimes the app stops automatically reloading or keeps crashing after you made changes to native code (can even happen when adding a node module). Close the emulator **and the dev server**, then re-run the command above to restart it.


_outdated_: Due to a conflict between `@types/react-native` and `@types/node` (needed at the root of the repo), we need to manually enter the typings required by the app in tsconfig.json (see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/15960#issuecomment-346645559 )


Too much overhead maintaining this in the monorepo. Moving to own repo...