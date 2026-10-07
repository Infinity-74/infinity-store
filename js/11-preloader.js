// ---------- Preloader ----------
(function () {
    const preloader = document.getElementById('preloader');
    function hidePreloader() {
        if (preloader) preloader.classList.add('hide');
    }
    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
        setTimeout(hidePreloader, 2500); // شبكة أمان
    }
})();
