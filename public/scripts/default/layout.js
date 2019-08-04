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
        } else if (event.target.id == 'credits') {
            alert('Icons made by "Freepic" (flaticon.com/authors/freepik)\n from "Flaticon" (flaticon.com) is licensed by CC 3.0 BY (creativecommons.org/licenses/by/3.0/)');
        }
    });

    if (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <= 1000) {
        let link = document.querySelector('#header-corner a');
        link.href = 'javascript:void(0)';
    }
}
