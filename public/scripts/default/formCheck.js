function $(x) {return document.getElementById(x);}

let validation = [0,0,0,0];

if (document.readyState !== 'loading') {
    prepareScripts();
} else {
    document.addEventListener('DOMContentLoaded', prepareScripts);
}

function prepareScripts() {

    let el;
    el = $('username');
    el && el.addEventListener('input', function(e) { validateLogin(e); });
    if (!el) { validation[0] = 1 }
    el = $('email');
    el && el.addEventListener('input', function(e) { validateEmail(e); });
    if (!el) { validation[1] = 1 }
    if ($('confirmation') && $('password')) {
        $('confirmation').addEventListener('input', validatePass);
        $('password').addEventListener('input', validatePass);
    }
}

function validateLogin(event) {
    let re = /^[a-zA-Z0-9\-_]{4,16}$/;
    if (re.test(event.target.value)) {
        markElement(event.target, 0, true);
        $('usernamehint').innerHTML = "";
    } else {
        markElement(event.target, 0, false);
        $('usernamehint').innerHTML = (event.target.value.length < 4) ? "Login lenght must be more than 3 characters" :
            "Login must contain only numbers, latin letters, underscope and minus characters";
    }
    validateForm();
}

function validateEmail(event) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let hint = $('emailhint');
    if (re.test(String(event.target.value).toLowerCase())) {
        markElement(event.target, 1, true);
        if (hint) {
            $('emailhint').innerHTML = "";
        }
    } else {
        markElement(event.target, 1, false);
        if (hint) {
            $('emailhint').innerHTML = "Wrong e-mail format";
        }
    }
    validateForm();
}

function validatePass() {
    let pass = $('password'),
        confirm = $('confirmation');
    if (pass.value.length >= 6) {
        markElement(pass, 2, true);
        $('passwordhint').innerHTML = "";
    } else {
        markElement(pass, 2, false);
        $('passwordhint').innerHTML = "Password must have lenght greater than 5 characters";
    }

    if (confirm.value == pass.value) {
        markElement(confirm, 3, true);
        $('confirmationhint').innerHTML = "";
    } else {
        markElement(confirm, 3, false);
        $('confirmationhint').innerHTML = "Pasword is not equal to confirmation";
    }

    validateForm();
}

function validateForm() {
    if (but = $('button')) {
        but.disabled = (!validation.every(function (element) {
            return (element == 1) ? true : false;
        }));
    }
}

function markElement(element, index, valid) {
    if (valid) {
        element.style.borderColor = 'green';
        validation[index] = 1;
    } else {
        element.style.borderColor = 'red';
        validation[index] = 0;
    }
}