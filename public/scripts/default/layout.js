if (document.readyState !== 'loading') {
    prepareScripts();
} else {
    document.addEventListener('DOMContentLoaded', prepareScripts);
}

function prepareScripts() {
    document.addEventListener('click', function (event) {
        if (event.target.id == 'msg') {
            event.target.style.transition = "2s";
            event.target.style.opacity = "0";
            setTimeout(function () {
                event.target.style.display = "none";
                event.target.style.opacity = "1";
                }, 2000);
        }
    });
}
