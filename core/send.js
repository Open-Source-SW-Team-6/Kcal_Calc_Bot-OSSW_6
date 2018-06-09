exports.sendMsg = function(mMessage, type, buttonsArr) {
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
    else if(type == 1) {
        return Send = {
            "message": {
                "text": mMessage
            },
            "keyboard": {
                "type": "buttons",
                "buttons": buttonsArr
            }
        }
    }
    else if(type == 2) {
        return Send = {
            "keyboard": {
                "type": "text"
            }
        }
    }
}