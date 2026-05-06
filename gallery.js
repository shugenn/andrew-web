var photos = {
    hs: [
        'highschool-photo/hs-1.jpg',
        'highschool-photo/hs-2.jpg',
        'highschool-photo/hs-3.jpg',
        'highschool-photo/hs-4.jpg',
        'highschool-photo/hs-5.jpg',
        'highschool-photo/hs-6.jpg'
    ],
    bn: [
        'bince-photo/bince-1.jpeg',
        'bince-photo/bince-2.jpeg',
        'bince-photo/bince-3.jpeg',
        'bince-photo/bince-4.jpeg',
        'bince-photo/bince-5.jpeg',
        'bince-photo/bince-6.jpeg'
    ],
    pp: [
        'ppft-photo/ppft-1.jpg',
        'ppft-photo/ppft-2.jpg',
        'ppft-photo/ppft-3.jpg',
        'ppft-photo/ppft-4.jpg',
        'ppft-photo/ppft-5.jpg',
        'ppft-photo/ppft-6.jpg'
    ]
};

var ss = {};

function buildSlideshow(key) {
    var container = document.getElementById('ss-' + key);
    var list = photos[key];
    container.innerHTML = '';
    for (var i = 0; i < list.length; i++) {
        var div = document.createElement('div');
        div.id = 'slide-' + key + '-' + i;
        div.style.cssText = 'position:absolute; inset:0; opacity:' + (i === 0 ? '1' : '0') + '; transition:opacity 0.9s ease;';

        var img = document.createElement('img');
        img.src = list[i];
        img.alt = key + ' ' + (i + 1);
        img.style.cssText = 'width:100%; height:100%; object-fit:cover; display:block; filter:brightness('
            + (i === 0 ? '0.9) saturate(0.95)' : '0.85) saturate(0.9)')
            + '; transform:scale(' + (i === 0 ? '1.04' : '1')
            + '); transition:transform 6s ease, filter 0.9s ease;';

        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:absolute; inset:0; background:linear-gradient(to top, rgba(10,0,0,0.65) 0%, rgba(10,0,0,0.15) 40%, transparent 70%); z-index:1;';

        div.appendChild(img);
        div.appendChild(overlay);
        container.appendChild(div);
    }
    ss[key] = { cur: 0, total: list.length, timer: null };
}

function goSlide(key, idx) {
    var s = ss[key];
    var oldSlide = document.getElementById('slide-' + key + '-' + s.cur);
    if (oldSlide) {
        oldSlide.style.opacity = '0';
        var oi = oldSlide.querySelector('img');
        if (oi) { oi.style.transform = 'scale(1)'; oi.style.filter = 'brightness(0.85) saturate(0.9)'; }
    }
    s.cur = idx;
    var newSlide = document.getElementById('slide-' + key + '-' + s.cur);
    if (newSlide) {
        newSlide.style.opacity = '1';
        var ni = newSlide.querySelector('img');
        if (ni) { ni.style.transform = 'scale(1.04)'; ni.style.filter = 'brightness(0.95) saturate(1)'; }
    }
}

function startSS(key) {
    var s = ss[key];
    if (s.timer) clearInterval(s.timer);
    s.timer = setInterval(function () {
        goSlide(key, (ss[key].cur + 1) % ss[key].total);
    }, 3200);
}

function stopSS(key) {
    if (ss[key] && ss[key].timer) { clearInterval(ss[key].timer); ss[key].timer = null; }
}

function openModal(key) {
    stopSS(key);
    var m = document.getElementById('modal-' + key);
    if (m) { m.style.display = 'flex'; }
}

function closeModal(key) {
    var m = document.getElementById('modal-' + key);
    if (m) { m.style.display = 'none'; }
    startSS(key);
}

var lb = { key: '', idx: 0 };

function openLightbox(key, idx) {
    lb.key = key;
    lb.idx = idx;
    var lbEl = document.getElementById('lightbox');
    lbEl.style.display = 'flex';
    updateLightbox();
}

function updateLightbox() {
    var list = photos[lb.key];
    var img = document.getElementById('lb-img');
    img.style.opacity = '0';
    setTimeout(function () {
        img.src = list[lb.idx];
        img.style.opacity = '1';
    }, 120);
    document.getElementById('lb-counter').textContent = (lb.idx + 1) + ' / ' + list.length;
}

function shiftLightbox(dir) {
    var list = photos[lb.key];
    lb.idx = (lb.idx + dir + list.length) % list.length;
    updateLightbox();
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

function closeLightboxFull() {
    document.getElementById('lightbox').style.display = 'none';
    closeModal(lb.key);
}

function openVideoPlayer(src, title) {
    var modal = document.getElementById('video-modal');
    var player = document.getElementById('video-player');
    var titleEl = document.getElementById('video-modal-title');

    player.src = src;
    titleEl.textContent = title;
    modal.style.display = 'flex';
    player.play();
}

function closeVideoPlayer() {
    var modal = document.getElementById('video-modal');
    var player = document.getElementById('video-player');

    player.pause();
    player.src = '';
    modal.style.display = 'none';
}

document.addEventListener('keydown', function (e) {
    var vm = document.getElementById('video-modal');
    if (vm && vm.style.display === 'flex') {
        if (e.key === 'Escape') closeVideoPlayer();
        return;
    }
    var lb_open = document.getElementById('lightbox').style.display === 'flex';
    if (lb_open) {
        if (e.key === 'ArrowLeft')  shiftLightbox(-1);
        if (e.key === 'ArrowRight') shiftLightbox(1);
        if (e.key === 'Escape')     closeLightbox();
        return;
    }
    if (e.key === 'Escape') {
        ['hs', 'bn', 'pp'].forEach(function (k) {
            var m = document.getElementById('modal-' + k);
            if (m && m.style.display === 'flex') closeModal(k);
        });
    }
});

window.onload = function () {
    buildSlideshow('hs');
    buildSlideshow('bn');
    buildSlideshow('pp');
    startSS('hs');
    startSS('bn');
    startSS('pp');
};