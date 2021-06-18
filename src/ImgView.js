import React from 'react';
import { StyleSheet, Image, Dimensions, View, Animated } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler'

const WINDOW = Dimensions.get('window')

const ImgView = ({ route }) => {

    const scale = new Animated.Value(1)
    const { url } = route.params;

    const onPinchEvent = Animated.event(
        [
            {
                nativeEvent: { scale: scale }
            }
        ],
        {
            useNativeDriver: true
        }
    )

    const onPinchStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true
            }).start()
        }
    }
    return (

        <View style={styles.imgWrapper}>
            <PinchGestureHandler
                onGestureEvent={onPinchEvent}
                onHandlerStateChange={onPinchStateChange}>
                <Animated.Image
                    source={{ uri: url }}
                    style={{
                        width: WINDOW.width,
                        height: 300,
                        transform: [{ scale: scale }]
                    }}
                    resizeMode='contain'
                />
            </PinchGestureHandler>
        </View>

    )
}
const styles = StyleSheet.create({
    imgWrapper: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        width: WINDOW.width,
        height: WINDOW.width / 4 * 3
    }
})

export default ImgView;