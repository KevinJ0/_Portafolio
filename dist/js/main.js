// select DOM items



$(document).ready(() => {

    $(function () {
        $('.btn-6')
            .on('mouseenter', function (e) {
                var parentOffset = $(this).offset(),
                    relX = e.pageX - parentOffset.left,
                    relY = e.pageY - parentOffset.top;
                $(this).find('span').css({
                    top: relY,
                    left: relX
                })
            })
            .on('mouseout', function (e) {
                var parentOffset = $(this).offset(),
                    relX = e.pageX - parentOffset.left,
                    relY = e.pageY - parentOffset.top;
                $(this).find('span').css({
                    top: relY,
                    left: relX
                })
            });
    });


    $("body").click(() => {
        if (show) {
            show = openCloseMenu();
        }
    });

    $("header").click((event) => {
        event.stopPropagation();
    });


    $(window).scroll(function () {
        let home = $("#home").height()
        let about = home + $("#about").height();
        let work = about + $("#work").height();
        let reachme = work + $("#reachme").height();

        if ($(this).scrollTop() < home - 400) {
            $(".nav-link").removeClass("current");
            $("#linkHome").addClass("current");
        } else if ($(this).scrollTop() < about - 200) {
            $(".nav-link").removeClass("current");
            $("#linkAbout").addClass("current");
        } else if ($(this).scrollTop() < work - 300) {
            $(".nav-link").removeClass("current");
            $("#linkWork").addClass("current");
        } else if ($(this).scrollTop() < reachme + 100) {
            $(".nav-link").removeClass("current");
            $("#linkReachme").addClass("current");
        }
    });

    $(".nav-link").click((e) => {

            var n = e.target.href.split("#");
            let navLink = "#" + n[n.length - 1];
            console.log(e.target.id)
            // var navList = document.querySelectorAll(".nav-link");
            // console.log(navList)
            $(".nav-link").removeClass("current");
            $("#" + e.target.id).addClass("current");

            // for (var p in navList) {

            //     console.log(p)
            // }


            var offsetTop = $(navLink).offset().top;


            if (offsetTop || offsetTop == 0) {
                $('html,body').animate({
                    scrollTop: offsetTop
                }, 1000);
            }
            show = openCloseMenu()

        }

    );



    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = {
        37: 1,
        38: 1,
        39: 1,
        40: 1
    };

    function preventDefault(e) {
        e.preventDefault();
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    // modern Chrome requires { passive: false } when adding event
    var supportsPassive = false;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassive = true;
            }
        }));
    } catch (e) {}

    var wheelOpt = supportsPassive ? {
        passive: false
    } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    // call this to Disable
    function disableScroll() {
        window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
        window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
        window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
        window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    }

    // call this to Enable
    function enableScroll() {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
        window.removeEventListener('touchmove', preventDefault, wheelOpt);
        window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    }



    const menuBtn = $(".menu-btn");
    const menuNav = $(".menu-nav");
    const menuBranding = $(".menu-Branding");
    var show = false;
    const navItems = $('.nav-item');
    let Scrolling = true;

    navItems.fadeOut();

    menuBtn.click((e) => {
        show = openCloseMenu();
    });

    function openCloseMenu() {

        if (Scrolling) {
            Scrolling = false;
            disableScroll();
        } else {
            enableScroll();
            Scrolling = true;
        }

        menuBtn.toggleClass('close');
        $('.menu-side-right').slideToggle();
        $('.menu-side-left').slideToggle();
        navItems.addClass('nav-item');

        navItems.fadeToggle(400, () => {

        });
        return !show;
    }
    $(".box-descrip-short").each(function (i) {
        var len = $(this).text().trim().length;
        if (len > 100) {
            $(this).text($(this).text().substr(0, 100) + '...');
        }
    });
});