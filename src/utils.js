function encapsulateInLikeRegex(param) {
    return new RegExp(".*" + param + ".*");
}

module.exports = {
    encapsulateInLikeRegex
}
