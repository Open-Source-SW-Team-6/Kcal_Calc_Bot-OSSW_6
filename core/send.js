exports.sendMsg = function(mMessage, type) {
    var Send = {};

    if (type == 0) {
        return Send = {
            'message': {
                'text': mMessage
            },
            "keyboard": {
                "type": "text"
            }
        };
    }
}