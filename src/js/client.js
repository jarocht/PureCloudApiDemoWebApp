var channel = {};
var user = {};
var presenceDefinitions = [];
var subscriptions = [];

function messageEvent(event) {
    event = JSON.parse(event.data);
    if (event.topicName.contains("status")) {
        view.log(event);
        view.log(user.displayName + " is now " + event.eventBody.status.name);
        view.setStatusListValue(event.eventBody.status.id);
    } else if (event.topicName.contains("channel.metadata")) {
        view.log(event);
        view.log( event.eventBody.message);
    } else {
        view.log(event);
    }
}

function getUserInfo(callback) {
    ApiRequest("GET", "users/me", null, callback);
}

//Get the list of presence definitions.
//Note: there could be more than 25 definitions, it would be good to for a pageSize of 100
function getPresenceDefinitions(callback) {
    ApiRequest("GET", "presencedefinitions?pageNumber=1&pageSize=100", null, callback);
}

//Our first post request! when using an ajax request the Purecloud API expects the "body" to be a string. 
//Additionally we need to set the "application/json" header to receive the response.
//Since this request is more finicky than a typical GET request we've also added an "error" function to give us feedback on error conditions that may occur.
function addPresenceDefinition(body, callback) {
    ApiRequest("POST", "presencedefinitions", body, callback);
}

function deletePresenceDefinition(presenceId, callback) {
    ApiRequest("DELETE", "presencedefinitions/" + presenceId, null, callback);
}

function setPresence(presenceId) {
    var presence = {
        "presenceDefinition": {
            "id": presenceId
        }
    };
    ApiRequest("PUT", "users/" + user.id + "/presences/PURECLOUD", JSON.stringify(presence));
}

function selectedStatusChanged(data) {
    setPresence(data);
}

function selectedOutputChanged() {
    view.updateDetailView();
}

function submit() {
    view.getPresenceFields(function (id, sysPresence, language, displayName) {
        if (id === "" || sysPresence === "" || language === "" || displayName === "") {
            window.alert("All fields are required");
        } else {
            var presence = JSON.parse(JSON.stringify(objects.presenceObj));
            presence.name = id;
            presence.languageLabels[language] = displayName;
            presence.systemPresence = sysPresence;
            addPresenceDefinition(JSON.stringify(presence), function (success, data) {
                if (success) {
                    view.log(data);
                    getPresenceDefinitions(function (success, data) {
                        if (success) {
                            updatePresenceData(data);
                        }
                    });
                } else {
                    console.log("error");
                    console.log(data);
                }
            });
            
            view.clearPresenceFields();
        }
    });
}

function deleteStatus() {
    deletePresenceDefinition(view.getStatusesSelected(), function(success, data) {
        if (success) {
            view.log(data);
            getPresenceDefinitions(function (success, data) {
                if (success) {
                    updatePresenceData(data);
                }
            });
        } else {
            console.log("error");
            console.log(data);
        }
    });
}

function logout() {
    authenticator.deauth();
}

function updatePresenceData(data) {
    view.log(data);
    presenceDefinitions = data.entities;
    view.setStatusList(presenceDefinitions, user.status.id, user.id);
}

authenticator.auth();
addChannel(function (success, data) {
    if (success) {
        channel = data;
        beginViewChannel(channel.connectUri, messageEvent);

        getUserInfo(function (success, data) {
            if (success) {
                view.log(data);
                user = data;
                addSubscription(channel.id, "users." + user.id + ".status");
                view.setUserInfo(user);
                getPresenceDefinitions(function (success, data) {
                    if (success) {
                        updatePresenceData(data);
                    }
                });
            }
        });
    }
});