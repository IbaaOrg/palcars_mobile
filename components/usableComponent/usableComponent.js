import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { Colors, Sizes, Fonts } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';

export const Button = ({ btnText, onPress, btnStyle }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={{ ...styles.buttonStyle, ...btnStyle }}
        >
            <Text style={{ lineHeight: 21.0, paddingTop: Sizes.fixPadding - 5.0, ...Fonts.whiteColor18Bold }}>
                {btnText}
            </Text>
        </TouchableOpacity>
    )
}

export const Header = ({ headerText, isRtl, arrowPress }) => {
    return (
        <View style={{ margin: Sizes.fixPadding * 2.0, flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', }}>
            <MaterialIcons
                name={isRtl ? "arrow-forward" : "arrow-back"}
                size={24}
                color={Colors.blackColor}
                onPress={arrowPress}
            />
            <Text style={styles.headerTextStyle}>
                {headerText}
            </Text>
        </View>
    )
}

export function showRating({ number, starSize }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
                (number == 5.0 || number == 4.0 || number == 3.0 || number == 2.0 || number == 1.0)
                    ?
                    <MaterialIcons
                        name="star"
                        size={starSize}
                        color={Colors.orangeColor}
                    />
                    :
                    null
            }
            {
                (number == 5.0 || number == 4.0 || number == 3.0 || number == 2.0)
                    ?
                    <MaterialIcons
                        name="star"
                        size={starSize}
                        color={Colors.orangeColor}
                    />
                    :
                    null
            }
            {
                (number == 5.0 || number == 4.0 || number == 3.0)
                    ?
                    <MaterialIcons
                        name="star"
                        size={starSize}
                        color={Colors.orangeColor}
                    />
                    :
                    null
            }
            {
                (number == 5.0 || number == 4.0)
                    ?
                    <MaterialIcons
                        name="star"
                        size={starSize}
                        color={Colors.orangeColor}
                    />
                    :
                    null
            }
            {
                (number == 5.0) ?
                    <MaterialIcons
                        name="star"
                        size={starSize}
                        color={Colors.orangeColor}
                    />
                    :
                    null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 5.0,
        shadowColor: 'rgba(13,120,46,0.5)',
        borderColor: 'rgba(13,120,46,0.5)',
        borderWidth: 1.3,
        elevation: 1.5,
    },
    headerTextStyle: {
        paddingTop: Sizes.fixPadding - 5.0,
        lineHeight: 21.0,
        ...Fonts.blackColor18SemiBold,
        marginHorizontal: Sizes.fixPadding
    }
})
