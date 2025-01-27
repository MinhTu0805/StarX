const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const navbg = document.querySelector('.nav-bg');

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x'); // Đổi icon thành dấu "X" khi mở menu
    navbar.classList.toggle('active');
    navbg.classList.toggle('active');
});
