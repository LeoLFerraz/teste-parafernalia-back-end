function encapsulateInLikeRegex(param) {
    return new RegExp(".*" + param + ".*");
}

function validateDateTimeFormat(string) {
    return string.match(/^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T([0-9][0-9]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])Z$/);
}

module.exports = {
    encapsulateInLikeRegex,
    validateDateTimeFormat
}
