/****************************************************************************************
* CHANNELS
****************************************************************************************/

/**
* Create a new channel for notifications
* @callback - Function to be called upon successful completion of add channel request.
* @state - (optional) Object containing the current state to be passed to the callback
**/
function addChannel(callback, state) {
    var path = "notifications/channels";
    ApiRequest("POST", path, null, callback, state);
}

/**
* Begin recieving messages for the selected channel
* @uri - The web socket URL that corresponds to the channel
* @messageHandler - Event handler to be called upon receiving a web socket message.
**/
function beginViewChannel(uri, messageHandler) {
    var ws = new WebSocket(uri);
    ws.onmessage = messageHandler;
}

/******************************************************************************************
* SUBSCRIPTIONS
*******************************************************************************************/

//Populates a list of subscriptions available in the PureCloud platform into the Available Subscriptions selection.
function getAvailableTopics(callback, state) {
    var path = "notifications/availabletopics";
    ApiRequest("GET", path, null, callback, state);
}

//Retrieve current list of subscriptions for the selected channel
function getChannelSubscriptions(id, callback, state) {
    //Get Subscriptions
    var path = "notifications/channels/" + id + "/subscriptions";
    ApiRequest("GET", path, null, callback, state);
}

//Add a subscription to the channel
function addSubscription(channelId, subscriptionId, callback, state) {
    var path = "notifications/channels/" + channelId + "/subscriptions";
    var body = JSON.stringify([{ id: subscriptionId }]);
    ApiRequest("POST", path, body, callback, state);
}

//Add an array of subscriptions to the channel, does not verify less than 1k subs
function addSubscriptions(channelId, subscriptionIdList, callback, state) {
    var path = "notifications/channels/" + channelId + "/subscriptions";
    var body = [];
    for (var i = 0; i < subscriptionIdList.length; i++) {
        body.push({ "id": subscriptionIdList[i] });
    }
    body = JSON.stringify(body);
    ApiRequest("POST", path, body, callback, state);
}

/******************************************************************************************
* BASE API
*******************************************************************************************/

/**
* API Request Wrapper
* @method - The type of request to make, "GET", "POST", "PUT", etc.
* @path - The url suffix of the endpoint to after the "api/v1/", example "users/me"
* @body - (optional) The object body of the request to be sent, optional depending on request type
* @callback - Function to be called upon a successful completion of API call
* @state - (optional) Object containing the current state to be passed to the callback
* @version - (optional) The API version to use, defaults to "v1" if not set.
**/
function ApiRequest(method, path, body, callback, state, version) {
    if (version === null || version === undefined) {
        version = "v1";
    }

    $.ajax({
        url: "https://api." + config.environment + "/api/" + version + "/" + path,
        type: method,
        data: body,
        contentType: "application/json",
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'bearer ' + authenticator.token); },
        success: function (data) {
            if (callback !== null && callback !== undefined) {
                if (state !== null && state !== undefined) {
                    callback(true, data, state);
                } else {
                    callback(true, data);
                }
            } else {
                console.log(data);
            }
        },
        error: function (data) {
            console.log("error");
            if (callback !== null && callback !== undefined) {
                if (state !== null && state !== undefined) {
                    callback(false, data, state);
                } else {
                    callback(false, data);
                }
            } else {
                console.log(data);
            }
        }
    });
}