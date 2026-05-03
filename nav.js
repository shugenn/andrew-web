// Set active nav link based on current page
document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('nav a');
    var current = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === current) {
            link.classList.add('active');
        }
    });
});