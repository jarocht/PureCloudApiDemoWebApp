authenticator = {
    "token": '',
    "auth": authenticate,
    "deauth": deauthenticate
}

/**
* Retrieves a URL parameter by the parameter name.
* @name - The name of the URL parameter to retrieve.
**/
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
      results = regex.exec(location.hash);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
* Checks whether the client is authenticated or not.
* If the client is not authenticated, redirect and ask for user credentials.
* If the client is authenticated grab the session token and clean up the nav bar.
**/
function authenticate(redirectUri) {
    if (redirectUri === null) {
        redirectUri = window.location.href;
    }

    if (window.location.hash) {
        //Client is already authenticated, parse the access token for future requests
        authenticator.token = getParameterByName('access_token');
        location.hash = '';
        console.log("Successfully Authenticated!");
    } else {
        //We are not yet authenticated, redirect the user and ask them to authenticate us.
        var queryStringData = {
            response_type: "token",
            client_id: config.clientId,
            redirect_uri: redirectUri
        }
        var url = "https://login." + config.environment + "/authorize?" + $.param(queryStringData);
        window.location.replace(url);
    }
}

/**
* Redirects the user to the logout page where the api token is deauthorized against this user session.
**/
function deauthenticate() {
    authenticator.token = '';
    window.location.replace("https://login." + config.environment + "/logout");
}
