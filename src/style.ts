import { StyleSheet } from 'react-native';

import color from 'color';

export const HIGHLIGHT = '#0CCD58';
export const PRIMARY = '#29955f';
export const FOREGROUND = '#fefffe';
export const BACKGROUND = '#16464f';

export const HINT = color(FOREGROUND).darken(0.4).desaturate(1).toString();

export default StyleSheet.create({
    title: {
        fontSize: 50,
        color: FOREGROUND,
        fontWeight: 'bold'
    },
    page: {
        height: '100%',
        width: '100%'
    },
    bigInput: {
        fontSize: 20,
        width: '100%',
        textAlign: 'center'
    },
    error: {
        color: '#641515'
    },
    listItem: {
        paddingTop: 5,
        paddingBottom: 2,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        height: 40
    },
    listItemText: {
        fontSize: 20
    }
});
