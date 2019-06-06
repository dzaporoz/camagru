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
        }
    }, false);
    $('oldpassword').addEventListener('input', function(e) { validateOldPassword(e); });
}

function changeNotif() {
    let property,
        button = $('notifChangeButton')
        result;
    if (button.className.match(/(?:^|\s)checked(?!\S)/)) {
        button.className = button.className.replace(/(?:^|\s)checked(?!\S)/g , '');
        property = "unchecked";
    } else {
        button.className = button.className.replace(/(?:^|\s)unchecked(?!\S)/g , '');
        property = "checked";
    }
    button.className += " " + property;
    result = XMLHTTPQuery('/settings/change-notif', 'property=')


}

function XMLHTTPQuery(url, params) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            return (xhr.responseText);
        }
    }
    xhr.ontimeout = serverError();
    xhr.onerror = serverError();
    xhr.send(params);
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