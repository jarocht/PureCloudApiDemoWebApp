view = {
    "log": log,
    "setStatusList": setStatusList,
    "setUserInfo": setUserInfo,
    "setStatusListValue": setStatusListValue,
    "updateDetailView": updateDetailView,
    "getPresenceFields": getPresenceFields,
    "getStatusesSelected": getStatusesSelected,
    "clearPresenceFields": clearPresenceFields
}

var consoleView = $('#console');
var detailView = $('#detail');
var statusDropDown = $('#statusDropDown');
var statusesDropDown = $('#statusesDropDown');
var userIdField = $('#userid');
var userNameField = $('#username');
var presenceId = $('#presenceId');
var presenceSystemPresence = $('#presenceSystemPresence');
var presenceLanguage = $('#presenceLanguage');
var presenceDisplayValue = $('#presenceDisplayValue');

function log(value) {
    console.log(value);
    value = JSON.stringify(value);
    consoleView.prepend("<option value=\"eventOption\">" + value + "</option>");
}

function setStatusList(presenceDefinitions, currentStatusId, userid) {
    statusDropDown.empty();
    statusesDropDown.empty();
    for (var i = 0; i < presenceDefinitions.length; i++) {
        //Selectable user Status
        statusDropDown.append("<option value=" + presenceDefinitions[i].id + ">" + presenceDefinitions[i].languageLabels.en_US + "</option>");
        if (currentStatusId === presenceDefinitions[i].id) {
            setStatusListValue(presenceDefinitions[i].id);
        }
        //For status editing
        if (presenceDefinitions[i].createdBy !== undefined) {
            if (presenceDefinitions[i].createdBy.id === userid) {
                statusesDropDown.append("<option value=" + presenceDefinitions[i].id + ">" + presenceDefinitions[i].languageLabels.en_US + "</option>");
            }
        }
    }
}

function setStatusListValue(currentStatusId) {
    statusDropDown.val(currentStatusId);
}

function setUserInfo(user) {
    userIdField.append(user.id + "");
    userNameField.append(user.displayName);
}

function updateDetailView() {
    var data = $('#console option:selected').text();
    detailView.text(JSON.stringify(JSON.parse(data), null, 4));
}

function getPresenceFields(callback) {
    
    if (callback !== null && callback !== undefined) {
        callback(presenceId.val(), presenceSystemPresence.val(), presenceLanguage.val(), presenceDisplayValue.val());
    } else {
        console.log("Presence Fields:");
        console.log("ID: " + presenceId.val());
        console.log("System Presence: " + presenceSystemPresence.val());
        console.log("Language: " + presenceLanguage.val());
        console.log("Display Value: " + presenceDisplayValue.val());
    }
}

function clearPresenceFields() {
    presenceId.val("");
    presenceDisplayValue.val("");
}

function getStatusesSelected() {
    return statusesDropDown.val();
}