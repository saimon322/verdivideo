var winWidth = $(window).width();
var winHeight = $(window).height();
var isDesktop = false;

$(document).ready(function () {
  // IE fixes
  objectFitImages();

  if (winWidth >= 1200) isDesktop = true;
  else isDesktop = false;
  $(window).resize(function () {
    winWidth = $(window).width();
    winHeight = $(window).height();
    if (winWidth >= 1200) isDesktop = true;
    else isDesktop = false;
  });

  // Hamburger
  $('.hamburger').click(function (e) {
    $('.hamburger').toggleClass('active');
    $('body').toggleClass('no-scroll');
    $('.hamburger-content').toggleClass('active').stop().slideToggle();
  });

  $(document).click(function (event) {
    if (!$(event.target).closest('.hamburger-content, .hamburger, .header__inner, .basket').length) {
      $('.hamburger-content').removeClass('active').slideUp();
      $('body').removeClass('no-scroll');
      $('.hamburger').removeClass('active');
    }

    // Close Tarrif Descritpion Outside
    if (
      !$(event.target).closest('.plan-feature.bordered, .plan-feature.bordered .plan-feature__btn')
        .length
    ) {
      $('.plan-feature').removeClass('bordered');
      $('.plan-feature__description').fadeOut('fast');
    }
  });

  // Tarrifs Description
  $('.plan-feature__text').each(function (index, item) {
    $(item).css('paddingTop', $(this).prev().outerHeight());
  });

  $('.plan-feature').each(function (index, item) {
    var $this = $(item);
    $this.on('click', '.plan-feature__btn', function (e) {
      e.preventDefault();
      $this.find('.plan-feature__description').fadeToggle();
      $this.toggleClass('bordered');
      $('.plan-feature')
        .not($this)
        .removeClass('bordered')
        .find('.plan-feature__description')
        .fadeOut('fast');
    });
  });

  // Header phones dropdown
  $('.header-phones__arrow').click(function () {
    $(this).parent('.header-phones').toggleClass('show');
  });

  // Header phones dropdown close
  $(document).mouseup(function (e) {
    if ($('.header-phones').hasClass('show')) {
      if (!$('.header-phones').is(e.target) && $('.header-phones').has(e.target).length === 0) {
        $('.header-phones').removeClass('show');
      }
    }
  });

  // Fixed scroll header
  window.addEventListener('scroll', function () {
    if (winWidth <= 767) {
      if (window.pageYOffset > 200) {
        $('header').addClass('is-fixed');
        $('.hamburger-content').addClass('is-fixed');
      } else {
        $('header').removeClass('is-fixed');
        $('.hamburger-content').removeClass('is-fixed');
      }
    } else {
      if (window.pageYOffset > 174) {
        $('header').addClass('is-fixed');
        $('.hamburger-content').addClass('is-fixed');
      } else {
        $('header').removeClass('is-fixed');
        $('.hamburger-content').removeClass('is-fixed');
      }
    }
  });

  // Modal
  $('.modal-btn').click(function (e) {
    e.preventDefault();
    let id = $(this).attr('href');
    $(id).addClass('active').fadeIn();
    $('.modal-bg').fadeIn();
    $('.hamburger, .h-logo').removeClass('active');
    $('html').addClass('overflow');
    $('.m-panel').removeClass('active').stop().slideUp();
    $('.m-dropdown').removeClass('active');
    $('.m-dropdown .dropdown-menu').stop().slideUp();
  });
  $(document).mouseup(function (e) {
    if ($('.modal.active').length) {
      if (
        !$('.modal').is(e.target) &&
        $('.modal').has(e.target).length === 0 &&
        !$('.modal-btn').is(e.target) &&
        $('.modal-btn').has(e.target).length === 0
      ) {
        $('.modal, .modal-bg').removeClass('active').fadeOut();
        $('html').removeClass('overflow');
      }
    }
  });

  // Inputs labels
  $('input, textarea').on('keyup', function () {
    if ($(this).val() != '') $(this).siblings('label').addClass('active');
    else $(this).siblings('label').removeClass('active');
  });

  // wow-js
  new WOW({
    offset: 200,
  }).init();

  // Fancybox
  $('[data-fancybox]').fancybox({
    loop: true,
  });
  $('.video').fancybox({
    openEffect: 'none',
    closeEffect: 'none',
    helpers: {
      media: {},
    },
  });

  // 100 vh fix
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  });

  // Replace all SVG images with inline SVG
  $('img.svg').each(function () {
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');
    jQuery.get(
      imgURL,
      function (data) {
        var $svg = jQuery(data).find('svg');
        if (typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
        }
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }
        $svg = $svg.removeAttr('xmlns:a');
        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
          $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
        }
        $img.replaceWith($svg);
      },
      'xml',
    );
  });

  // Main page scripts
  if ($('.main-page').length || $('.article-page').length) {
    // Main page section slider
    var sectionOwl = $('.m-section__slider');
    sectionOwl.owlCarousel({
      items: 1,
      loop: true,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
    });

    // Main page articles slider
    var articlesOwl = $('.m-articles__slider');
    articlesOwl.owlCarousel({
      loop: true,
      nav: false,
      dots: true,
      autoWidth: true,
      smartSpeed: 350,
      center: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      responsive: {
        768: {
          dots: false,
        },
      },
    });
    changeMainSlides();
    articlesOwl.on('changed.owl.carousel', function () {
      setTimeout(function () {
        changeMainSlides();
      });
    });
    function changeMainSlides() {
      let centerSlide = $('.m-articles__slider .owl-item.center');
      $('.m-articles .owl-item').removeClass('active');
      centerSlide.addClass('active');
      if (winWidth >= 1200) {
        centerSlide.next().addClass('active');
      }
    }
    $('.m-articles__slider').on('click', '.owl-item', function () {
      if (!$(this).hasClass('active')) {
        n = $(this).index();
        c = $(this).siblings('.center').index();
        if (n < c) {
          articlesOwl.trigger('prev.owl.carousel');
        } else {
          articlesOwl.trigger('next.owl.carousel');
        }
      }
    });
  }

  // Product page scripts
  if ($('.product-page').length) {
    // Product page section slider
    var sectionOwl = $('.p-section__slider');
    sectionOwl.owlCarousel({
      items: 1,
      loop: true,
      nav: true,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
    });

    $('.p-header__nav .current-menu-item').click(function (e) {
      $('.p-header__nav').toggleClass('show');
      e.preventDefault();
    });

    $(window).on('load resize scroll', function (e) {
      if (winWidth < 768) {
        let footerT = $('.footer').offset().top;
        if (window.pageYOffset + window.innerHeight > footerT) {
          $('.p-header__info').css({ position: 'absolute' });
        } else {
          $('.p-header__info').css({ position: 'fixed' });
        }
      } else {
        $('.p-header__info').css({ position: 'relative' });
      }
    });
  }

  // Product family slider
  if ($('.p-family').length) {
    var familyOwl = $('.p-family__slider');
    familyOwl.owlCarousel({
      loop: true,
      nav: false,
      dots: true,
      autoWidth: true,
      smartSpeed: 350,
      center: true,
      // autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      responsive: {
        768: {
          dots: false,
        },
      },
    });
    changeFamilySlides();
    familyOwl.on('changed.owl.carousel', function () {
      setTimeout(function () {
        changeFamilySlides();
      });
    });
    function changeFamilySlides() {
      let centerSlide = $('.p-family__slider .owl-item.center');
      $('.p-family__slider .owl-item').removeClass('active');
      centerSlide.addClass('active');
      if (winWidth >= 768) {
        centerSlide.next().addClass('active');
        if (winWidth >= 1050) {
          centerSlide.prev().addClass('active');
          centerSlide.next().next().addClass('active');
        }
      }
    }
    $('.p-family__slider').on('click', '.owl-item', function () {
      if (!$(this).hasClass('active')) {
        n = $(this).index();
        c = $(this).siblings('.center').index();
        if (n < c) {
          familyOwl.trigger('prev.owl.carousel');
        } else {
          familyOwl.trigger('next.owl.carousel');
        }
      }
    });
  }

  // Specification accordion
  if ($('.spec').length) {
    $('.accordion__title').click(function () {
      let accordion = $(this).parent();
      $('.accordion').not(accordion).removeClass('show').find('.accordion__content').slideUp();
      accordion.toggleClass('show').find('.accordion__content').slideToggle();
    });
  }

  // Form
  $('textarea').on('input', function (e) {
    this.style.height = '1px';
    this.style.height = this.scrollHeight + 1 + 'px';
  });

  // ----------------------------------- END OF $(document).ready -------------------------------------
});
