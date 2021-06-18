const parseKey = (post) => {
    return post[1].children[1].children[1].attribs.href
}

const parsePhoto = (post) => {
    try {
        return post[1].children[1].children[1].children[1].attribs.src;
    } catch (error) {
        return ''
    }
}

const parseTitle = (post) => {
    try {
        return post[1].children[3].children[0].attribs.alt;
    } catch (error) {
        return 'Loading'
    }
}

const parseHeader = (item) => {
    try {
        let fullHeader = item[0].children[0].data;
        return fullHeader.slice(15, fullHeader.length);
    } catch (error) {
        return 'Loading...'
    }
}

const parseDes = (post) => {
    try {
        return post[1].children[5].children[0].data;
    } catch (error) {
        return 'Loading...'
    }
}
export { parseKey, parsePhoto, parseTitle, parseDes, parseHeader };