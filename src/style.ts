import { StyleSheet } from 'react-native';

export const HIGHLIGHT = '#0CCD58';
export const PRIMARY = '#0B6A26';
export const FOREGROUND = '#DFEFE2';
export const BACKGROUND = '#000801';

export default StyleSheet.create({
    title: {
        fontSize: 50,
        color: FOREGROUND,
        fontWeight: 'bold'
    },
    inverse: {
        backgroundColor: PRIMARY
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
