$.fn.placeholder = function(){

// quit if there's support for html5 placeholder
if (this[0] && 'placeholder' in document.createElement('input')) return; 

return this
  .live('focusin',function(){

    if ($(this).val() === $(this).attr('placeholder')) {
      $(this).val('');
    }

  }).live('focusout',function(){

    if ($(this).val() === ''){
      $(this).val( $(this).attr('placeholder') );
    }
  });
}