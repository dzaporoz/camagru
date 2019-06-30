function $(x) {return document.getElementById(x);}

if (document.readyState !== 'loading') {
    prepareScripts();
} else {
    document.addEventListener('DOMContentLoaded', prepareScripts);
}

function prepareScripts() {
    document.addEventListener('click', function (event) {
        if (event.target.id === "usernameChangeBtn") {
            changeUsername();
        } else if (event.target.id === "passwordChangeBtn") {
            changePassword();
        } else if (event.target.id === "emailChangeBtn") {
            changeEmail();
        } else if (event.target.id === "notifChangeButton") {
            changeNotif();
        } else if (event.target.id === "resendNotif") {
            event.preventDefault();
            resendNotif(event.target);
        }
    }, false);
    $('oldpassword').addEventListener('input', function(e) { validateOldPassword(e); });
}

function changeNotif() {
    let action,
        button = $('notifChangeButton');
    if (button.className.match(/(?:^|\s)check(?!\S)/)) {
        action = "uncheck";
    } else {
        action = "check";
    }
    XMLHTTPQuery('/settings/change-notif', 'action=' + action).then( function() {
        if (action == "uncheck") {
            button.className = button.className.replace(/(?:^|\s)check(?!\S)/g , '');
        } else {
            button.className = button.className.replace(/(?:^|\s)uncheck(?!\S)/g , '');
        }
        button.className += " " + action;
    }).catch(errorMsg);
}

function resendNotif(link) {
    if (link.className == 'disabled') {
        errorMsg('You must wait a minute to send a new verification letter');
    } else {
        XMLHTTPQuery('/account/re-send-verification-letter', 'action=' + 123321).then(function (response) {
            if (response === 'ok') {
                doneMsg("Reverification letter was sent. Please check your mail");
                link.className = "disabled";
                setTimeout(function () {
                    link.className = '';
                }, 60000);
            } else {
                errorMsg(response);
            }
        }).catch(errorMsg);
    }
}

function XMLHTTPQuery(url, params) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
                resolve (xhr.responseText);
            } else if (this.status !== 200) {
                serverError();
                reject(new Error(this.statusText));
            }
        }
        xhr.ontimeout = function () { serverError(); reject(new Error(this.statusText)); };
        xhr.onerror = function () { serverError(); reject(new Error(this.statusText)); };
        xhr.send(params);
    });
}

function validateOldPassword(event) {
    if (event.target.value.length < 6) {
        event.target.style.borderColor = 'red';
    } else {
        event.target.style.borderColor = 'black';
    }
}

function changeUsername() {
    let xhr = new XMLHttpRequest(),
        input = $('username'),
        params = 'username=' + input.value;
    if (input.value.length < 4) { return; }
    xhr.open('POST', '/settings/change-username', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            if (xhr.responseText === 'ok') {
                doneMsg('Login was updated');
            } else if (xhr.responseText !== 'ko') {
                errorMsg(xhr.responseText);
            }
        }
    }
    xhr.ontimeout = serverError();
    xhr.onerror = serverError();
    xhr.send(params);
}

function changePassword() {
    let xhr = new XMLHttpRequest(),
        input = $('password'),
        params = 'oldpassword=' + encodeURIComponent($('oldpassword').value) + '&password=' +
            encodeURIComponent(input.value);
    if (input.value.length < 6 || input.value !== $('confirmation').value ||
        $('oldpassword').value.length < 6) {
        return;
    }
    xhr.open('POST', '/settings/change-password', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            if (xhr.responseText === 'ok') {
                doneMsg('Password was updated');
            } else if (xhr.responseText !== 'ko') {
                errorMsg(xhr.responseText);
            }
        }
    }
    xhr.ontimeout = serverError();
    xhr.onerror = serverError();
    xhr.send(params);
}

function changeEmail() {
    let xhr = new XMLHttpRequest(),
        params = 'email=' + $('email').value;
    xhr.open('POST', '/settings/change-email', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            if (xhr.responseText === 'ok') {
                doneMsg('E-mail was updated');
            } else if (xhr.responseText !== 'ko') {
                errorMsg(xhr.responseText);
            }
        }
    }
    xhr.ontimeout = serverError();
    xhr.onerror = serverError();
    xhr.send(params);
}

function serverError() {
    errorMsg("Unable to connect to server. Try again later");
}

function doneMsg(msgString) {
    let msgBox = $("msg");
    msgBox.className = "done-msg";
    msgBox.innerHTML = msgString;
    msgBox.style.display = "block";
}

function errorMsg(msgString) {
    let msgBox = $("msg");
    msgBox.className = "err-msg";
    msgBox.innerHTML = msgString;
    msgBox.style.display = "block";
}