function $(x) {return document.getElementById(x);}

var validation = [0,0,0,0];

if (document.readyState !== 'loading') {
    prepareScripts();
} else {
    document.addEventListener('DOMContentLoaded', prepareScripts);
}

function prepareScripts() {

    $('username').addEventListener('change', function (e) {
        var re = /^[a-zA-Z0-9\-_]{4,16}$/;
        if (re.test(e.target.value)) {
            markElement(e.target, 0, true);
            $('usernamehint').innerHTML = "";
        } else {
            markElement(e.target, 0, false);
            $('usernamehint').innerHTML = (e.target.value.length < 4) ? "Login lenght must be more than 3 characters" :
            "Login must contain only numbers, latin letters, underscope and minus characters";
        }
        validateForm();
    });

    $('email').addEventListener('change', function (e) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(e.target.value).toLowerCase())) {
            markElement(e.target, 1, true);
            $('emailhint').innerHTML = "";
        } else {
            markElement(e.target, 1, false);
            $('emailhint').innerHTML = "Wrong e-mail format";
        }
        validateForm();
    });

    $('confirmation').addEventListener('change', validatePass);
    $('password').addEventListener('change', validatePass);

}


function validatePass() {
    var pass = $('password'),
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
    if (validation.every(validateArray)) {
        $('button').disabled = false;
    } else {
        $('button').disabled = true;
    }
}

function validateArray(currentValue) {
    return (currentValue == 1) ? true : false;
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