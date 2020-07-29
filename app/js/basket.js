
$(document).ready(function () {
  // Basket show
  $(".header-basket").click(function(){
    $(".header-basket").addClass("active");
    $(".basket, .overlay").addClass("show");
    $("body").addClass("no-scroll");
  })

  // Basket close
  $(".overlay, .js-basket-close, .js-basket-refresh").click(function(){
    $(".header-basket").removeClass("active");
    $(".basket, .overlay").removeClass("show");    
    setTimeout(function(){
      $("body").removeClass("no-scroll");
      // Basket refresh on last step
      if ($(".basket-step.active").data("step") == 5) {
        $(".basket-step").removeClass("prev active").addClass("next");
        $(".basket-step").first().removeClass("next").addClass("active");
        $(".basket-product").remove();
        $(".basket-goto-checkout").hide();
        $(".basket-empty-message").show();
      }
    }, 700)
  })

  // Basket change step
  $(".js-basket-next").click(function(){
    let step = $(this).parents(".basket-step");
    let stepNum = step.data("step");
    let newStep = $(".basket-step[data-step="+ (stepNum + 1) +"]");
    if (newStep.length) {
      if (stepNum == 2) {
        if (!checkContacts()) return;
      }
      if (stepNum == 4) {
        if (!checkPayment()) return;
      }
      newStep.addClass("active").removeClass("next").scrollTop(0);
      step.removeClass("active").addClass("prev");
    }
  })
  $(".js-basket-prev").click(function(){
    let step = $(this).parents(".basket-step");
    let stepNum = step.data("step");
    let newStep = $(".basket-step[data-step="+ (stepNum - 1) +"]");
    if (newStep.length) {
      newStep.addClass("active").removeClass("prev").scrollTop(0);
      step.removeClass("active").addClass("next");
    }
  })

  // Basket product counter
  $(".basket-counter__btn").click(function(){
    let counter = $(this).siblings(".basket-counter__count");
    let count = parseInt(counter.text());
    if ($(this).hasClass("plus")) {
      count ++;
    } else if ($(this).hasClass("minus")) {
      count --;
    }
    if (count >= 0) {
      counter.text(count);
    }
    if (count == 0) {
      $(this).parents(".basket-product").slideUp(500, function(){
        $(this).remove();
      });
      let step = $(".basket-step.active");
      if (step.find(".basket-product").length == 1) {
        $(".basket-goto-checkout").fadeOut(500, function(){
          $(".basket-empty-message").show();
        });
      }
    }
  })

  // Basket contacts tabs
  $(".basket-contacts__tab").click(function(){
    if (!$(this).hasClass("active")) {
      $(".basket-contacts__tab").toggleClass("active");
      $(".basket-contacts__header").toggleClass("active");
      $(".basket-contacts__payment").toggleClass("hidden");
      $(".basket-error").removeClass("show").slideUp();
      let step = $(".basket-step.active");
      step.find(".basket__errors").removeClass("show");
      step.find(".basket-message--ok").show();
      step.find(".basket-message--error").hide();
      $(".basket-contacts input").each(function() {
        if ($(this).hasClass("empty")) {
          $(this).val("");
        }
        $(this).removeClass('empty error');
      });
    }
  })

  // Contacts masks
  $(function() {
    let phone = document.getElementById('phone');
    let index = document.getElementById('index');
    
    let phone_mask = new IMask(phone, {
      mask: '+{7} 000 000 00 00',
    });
    let index_mask = new IMask(index, {
      mask: '000000',
    });
  });

  // Contacts validation
  $(".basket-contacts input").focus(function() {
    if ($(this).hasClass("empty")) {
      $(this).val("");
    }
    $(this).removeClass('empty error');
  });

  function checkContacts() {
    let validation = true;

    $(".basket-contacts input").each(function() {
      if ($(this).parents(".basket-contacts__payment.hidden").length) {
        return;
      }
      
      if ($(this).hasClass("empty") || $(this).hasClass("error")) {
        validation = false;
      }
      else if (!$(this).val().length) {
        $(this).addClass("empty").val("Не заполнено");
        $(this).siblings("label").addClass("active");
        showErrorMessage($(this));
        validation = false;
      } 
      else if (!contactsInputValidate($(this))) {
        $(this).addClass("error");
        showErrorMessage($(this));
        validation = false;
      } else {
        hideErrorMessage($(this));
      }
    });

    return validation ? true : false;
  }

  function contactsInputValidate(input) {
    if (input.is("#phone")) {
      return (input.val().length >= 5);
    } 
    else if (input.is("#index")) {
      return (input.val().length == 6);
    } else if (input.is("#email")) {
      let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return (input.val().match(mailformat));
    } else {
      return true;
    }
  }

  // Payment card masks
  $(function() {
    let cardnumber = document.getElementById('cardnumber');
    let expirationmonth = document.getElementById('expirationmonth');
    let expirationyear = document.getElementById('expirationyear');
    let securitycode = document.getElementById('securitycode');
    
    //Mask the Credit Card Number Input
    let cardnumber_mask = new IMask(cardnumber, {
      mask: '0000 0000 0000 0000',
    });
    //Mask the Expiration Month
    let expirationmonth_mask = new IMask(expirationmonth, {
      mask: 'MM',
      groups: {
        MM: new IMask.MaskedPattern.Group.Range([1, 12]),
      }
    });
    //Mask the Expiration Year
    let expirationyear_mask = new IMask(expirationyear, {
      mask: 'YY',
      groups: {
        YY: new IMask.MaskedPattern.Group.Range([0, 99]),
      }
    });
    //Mask the Security Code
    let securitycode_mask = new IMask(securitycode, {
        mask: '0000',
    });
  });

  // Payment validation
  let cardnumber = $('#cardnumber');
  let visa = $("#visa");
  let mastercard = $("#mastercard");
  let dateYear = parseInt(new Date().getFullYear().toString().substr(-2));
  let dateMonth = new Date().getMonth() + 1;

  $(".basket-card input").keyup(function() {
    $(this).removeClass('empty error');
  });

  cardnumber.keyup(function() {
    if ($(this).val().length) {
      visa.addClass('transparent');
      mastercard.addClass('transparent');
      if ($.payform.parseCardType(cardnumber.val()) == 'visa') {
        visa.removeClass('transparent');
      } else if ($.payform.parseCardType(cardnumber.val()) == 'mastercard') {
        mastercard.removeClass('transparent');
      }
    } else {
      visa.removeClass('transparent');
      mastercard.removeClass('transparent');
    }
  });

  function checkPayment() {
    let validation = true;

    $(".basket-card input").each(function() {
      if ($(this).hasClass("empty") || $(this).hasClass("error")) {
        validation = false;
      }
      else if (!$(this).val().length) {
        $(this).addClass("empty");
        showErrorMessage($(this));
        validation = false;
      } 
      else if (!cardInputValidate($(this))) {
        $(this).addClass("error");
        showErrorMessage($(this));
        validation = false;
      } else {
        hideErrorMessage($(this));
      }
    });

    return validation ? true : false;
  }

  function cardInputValidate(input) {
    if (input.is("#cardowner")) {
      return (input.val().length >= 5);
    } 
    else if (input.is("#cardnumber")) {
      return ($.payform.validateCardNumber(input.val()));
    }
    else if (input.is("#securitycode")) {
      return ($.payform.validateCardCVC(input.val()));
    }
    else if (input.is("#expirationyear")) {
      let inputYear = parseInt(input.val());
      return (inputYear >= dateYear);
    }
    else if (input.is("#expirationmonth")) {
      let inputYear = parseInt($('#expirationyear').val());
      let inputMonth = parseInt(input.val());
      if (inputYear == dateYear && inputMonth < dateMonth)
        return false;
      else
        return true;
    }
  }

  function showErrorMessage(input) {
    let id = input.attr('id');
    $(".basket-error[data-error='"+id+"']").addClass("show").slideDown();

    let errorsCount = $(".basket-error.show").length;
    if (errorsCount > 0) {
      let step = input.parents(".basket-step");
      step.find(".basket__errors").addClass("show");
      step.find(".basket-message--ok").hide();
      step.find(".basket-message--error").show();
    }
  }

  function hideErrorMessage(input) {
    let id = input.attr('id');
    $(".basket-error[data-error='"+id+"']").removeClass("show").slideUp();

    let errorsCount = $(".basket-error.show").length;
    if (errorsCount == 0) {
      let step = $(".basket-step.active");
      step.find(".basket__errors").removeClass("show");
      step.find(".basket-message--ok").show();
      step.find(".basket-message--error").hide();
    }
  }
});