window.toggleShellNav = function toggleShellNav() {
    document.body.classList.toggle('shell-nav-open');
};

window.closeShellNav = function closeShellNav() {
    document.body.classList.remove('shell-nav-open');
};

window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
        closeShellNav();
    }
});
