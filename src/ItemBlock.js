import React from 'react';
import { Text, StyleSheet, Dimensions, View, ScrollView, Pressable, Image } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element'
import { parseTitle, parsePhoto } from './store/parseData';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { ratio } from './store/posts'
import { parseDes } from './store/parseData'

const WINDOW = Dimensions.get('window')
// const THUMBNAIL_HEIGHT = WINDOW.height * 0.57 // details image size
const THUMBNAIL_WIDTH = WINDOW.width - 50;
const THUMBNAIL_HEIGHT = THUMBNAIL_WIDTH / ratio

const ItemBlock = ({ post, id, navigation }) => {
    const leftAction = () => {
        return (
            <View style={styles.desContainer}>
                <Text style={styles.desText}>{parseDes(post)}</Text>
            </View>
        )
    }
    return (
        <>
            <View style={styles.container}>
                <Pressable
                    onPress={() => { navigation.navigate('DetailView', { id: id, navigation: navigation }) }}
                >
                    <Swipeable
                        renderLeftActions={leftAction}
                        renderRightActions={leftAction}
                    >
                        <View style={{ height: THUMBNAIL_HEIGHT }}>
                            <View style={[styles.titleWrapper]}>
                                <Text style={[styles.title, { color: 'black' }]}>{parseTitle(post)}</Text>
                            </View>

                            <View
                                style={styles.imgWrapper}
                            >
                                <SharedElement id={id}>
                                    <Image
                                        source={{ uri: parsePhoto(post) }}
                                        style={styles.imageStyles}
                                    />
                                </SharedElement>

                            </View>
                        </View>
                    </Swipeable>
                </Pressable>
            </View>

        </>
    )
}
const styles = StyleSheet.create({

    container: {
        position: 'relative',
        width: '100%',
        height: THUMBNAIL_HEIGHT,
        marginBottom: 30
    },

    scrollViewStyle: {
        borderRadius: 30,
        backgroundColor: '#1C1C1D'
    },

    titleWrapper: {
        position: 'absolute',
        top: 15,
        width: WINDOW.width - 100,
        paddingHorizontal: 15,
        zIndex: 10,
        backgroundColor: 'rgba(255,185,0, 0.4)',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    title: {
        fontSize: WINDOW.width * 0.065,
        fontWeight: '700',
        textShadowColor: '#eeeeee',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        textAlign: 'center'
    },
    imgWrapper: {
        overflow: 'hidden',
        flex: 1,
        borderRadius: 20
    },
    imageStyles: {
        borderRadius: 10,
        width: THUMBNAIL_WIDTH,
        height: THUMBNAIL_HEIGHT,
        alignSelf: 'center'
    },

    descriptionWrapper: {
        position: 'absolute',
        bottom: 15,
        width: '100%',
        paddingHorizontal: 15,
        maxWidth: WINDOW.width * 0.85
    },
    description: {
        fontSize: WINDOW.width * 0.04
    },
    desContainer: {
        width: THUMBNAIL_WIDTH,
        height: THUMBNAIL_HEIGHT,
        backgroundColor: '#1C1C1D',
        borderRadius: 20,
    },
    desText: {
        fontSize: Math.min(WINDOW.width * 0.053, 20),
        color: '#989898',
        marginVertical: 50,
        marginHorizontal: 30,
    },
})
export default ItemBlock;