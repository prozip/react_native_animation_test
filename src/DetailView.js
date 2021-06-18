import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import { SpringScrollView } from 'react-native-custom-scroll';
import cheerio from 'cheerio';
import Share from 'react-native-share';

import { ratio } from './store/posts';
import axios from 'axios';

const WINDOW = Dimensions.get('window')
const PADDING_HORIZONTAL = 20

const POINT_WIDTH = 10
const NUM_POINTS = Math.floor((WINDOW.width - PADDING_HORIZONTAL - 20) / POINT_WIDTH)

const POINTS = new Array(NUM_POINTS).fill(0)

const height = WINDOW.height * 0.5;
const width = height * ratio;

const DetailView = ({ route, navigation }) => {
    const { id } = route.params;
    const [data, updateData] = useState({
        des: '', location: {
            local: '',
            location: ''
        }, tag: '', title: '',
        img: ''
    });
    const [isMoreImg, changeMoreImg] = useState(false);
    const [moreImg, getMoreImg] = useState([]);

    const htmlParser = useRef(null);
    const ref = useRef(null);


    const getData = async () => {
        const url = id;
        try {
            const response = await axios.get('https://travel.sygic.com' + url);
            htmlParser.current = cheerio.load(response.data);
            const des = htmlParser.current('.description').text();
            const title = htmlParser.current('[itemprop=name]').text();
            const tag = htmlParser.current('.tags-panel').text();
            const location = htmlParser.current('.destination-details');
            const img = htmlParser.current('[itemprop=image]')[0].attribs.src;
            updateData((prev) => {
                return {
                    ...prev, des: des,
                    location: {
                        local: location[0].children[2].data,
                        location: location[0].children[6].data
                    }, tag: tag, title: title,
                    img: img
                }
            })
        } catch (error) {
            console.log("detail load fail")
        }
    }

    useEffect(() => {
        getData();
    }, [])

    const getDataDetail = async (url) => {
        const poi = url.split(":")[1];
        try {
            const res = await axios.get('https://api-cdn.sygictraveldata.com/v2.6/en/places/poi:' + poi + "/media");
            if (res.data.data.media.length > 5) {
                getMoreImg(res.data.data.media.slice(0, 5));
            } else {
                getMoreImg(res.data.data.media);
            }
        } catch (error) {
            console.log('Load detail error')
        }
    }

    const loadImage = () => {
        getDataDetail(id);
        changeMoreImg(!isMoreImg);
    }

    const Content = () => {
        const renderItem = ({ item }) => (
            <TouchableOpacity onPress={() => { navigation.navigate('ImgView', { url: item.url }) }}>
                <View style={styles.moreImgWrapper}>
                    <Image style={styles.moreImg} source={{ uri: item.url }}></Image>
                </View>
            </TouchableOpacity>
        );
        const runShare = async () => {
            const options = {
                message: data.title
            }
            const shareResponse = await Share.open(options)
        }

        return (
            <View>
                <View style={styles.imgWrapper}>
                    <SharedElement id={id}>
                        <Image
                            source={{ uri: data.img }}
                            style={styles.img}
                        ></Image>
                    </SharedElement>
                </View>
                <View style={{ backgroundColor: '#1C1C1D' }}>
                    <View style={styles.content}>
                        <Text style={[styles.text, { marginBottom: 80 }]}>
                            <Text style={styles.textBold}>{data.title}</Text>
                        </Text>
                        <Text style={[styles.text, { textAlign: 'right' }]}>
                            <Text style={styles.subTitle}>Local name:</Text>
                            {"  " + data.location.local}
                        </Text>
                        <Text style={[styles.text, { textAlign: 'right' }]}>
                            <Text style={styles.subTitle}>Location:</Text>
                            {"  " + data.location.location}
                        </Text>
                        <View style={[styles.separator, { marginTop: 0 }]}>
                            {POINTS.map((_, index) => <Text key={index} style={styles.point}>•</Text>)}
                        </View>

                        <Text style={styles.text}>
                            {data.des}
                        </Text>


                        {!isMoreImg ? <TouchableOpacity onPress={() => loadImage()}>
                            <View style={styles.btnWrapper}>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>More Image</Text>
                                </View>
                            </View>
                        </TouchableOpacity> :
                            <View>
                                <FlatList
                                    data={moreImg}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                    horizontal>
                                </FlatList>
                                <View style={[styles.separator, { marginTop: 0 }]}>
                                    {POINTS.map((_, index) => <Text key={index} style={styles.point}>•</Text>)}
                                </View>
                            </View>
                        }
                        <Text style={styles.text}>
                            <Text style={styles.subTitle}>Tags: </Text>
                            {"\n      " + data.tag.replace('Tags', '').trim()}
                        </Text>
                    </View>

                    <View style={styles.line} />


                    <TouchableOpacity onPress={() => runShare()}>
                        <View style={styles.btnWrapper}>
                            <View style={[styles.btn, { backgroundColor: 'rgba(45, 125, 154, 0.5)' }]}>
                                <Text style={styles.btnText}>Share</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (

        <View style={{ flex: 1 }}>
            <SpringScrollView
                showsVerticalScrollIndicator={false}
                ref={ref}
                onRefresh={() => {
                    ref.current.endRefresh();
                    navigation.pop();
                }}
            >
                <Content></Content>
            </SpringScrollView>
        </View>

    )
}
const styles = StyleSheet.create({

    subTitle: {
        color: '#D3D3D3',
        fontWeight: '600'
    },

    content: {
        paddingVertical: 30,
        paddingHorizontal: PADDING_HORIZONTAL,
        overflow: 'hidden'
    },

    imgWrapper: {
        overflow: 'hidden',
        borderTopRightRadius: 20,
        borderTopStartRadius: 20,
        backgroundColor: 'black'
    },
    img: {
        height: height, width: width, alignSelf: 'center'
    },

    text: {
        fontSize: Math.min(WINDOW.width * 0.053, 20),
        color: '#989898'
    },
    textBold: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 40,
    },

    separator: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 25,
        paddingHorizontal: 20
    },
    point: {
        width: POINT_WIDTH,
        color: '#3D3D3D',
        fontSize: 15
    },

    line: {
        backgroundColor: '#3D3D3D',
        width: '100%',
        height: StyleSheet.hairlineWidth
    },
    btnWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100
    },

    btn: {
        width: '45%',
        backgroundColor: '#2C2C2C',
        height: 45,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    btnText: {
        color: '#FFF',
        fontWeight: '500',
        fontSize: 16,
        marginLeft: 4
    },
    moreImg: {
        width: WINDOW.width * 0.6,
        height: WINDOW.width * 0.45
    },
    moreImgWrapper: {
        overflow: 'hidden',
        borderRadius: 10,
        marginRight: 15,
        marginTop: 25,
        marginBottom: 30,
        backgroundColor: 'black'
    }
})

export default DetailView;