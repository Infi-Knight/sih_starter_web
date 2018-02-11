

$('ul.nav li.dropdown').hover(function() {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
  }, function() {
      $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
});

$('#menu').click(function(){
  $('#navwrapper').toggle();
});


$(".meter > span").each(function() {
  $(this)
    .data("origWidth", $(this).width())
    .width(0)
    .animate({
      width: $(this).data("origWidth") // or + "%" if fluid
    }, 1200);
});

  function initMap(){
  var subhaDam = {lat: 27.5528864, lng: 94.2593899};
    var map = new google.maps.Map(document.getElementById('map'),{
    zoom: 16,
    center: subhaDam
    });
    
    var marker = new google.maps.Marker({
    position: subhaDam,
    map: map
    });
  }

  $('#reply_btn').click(function(){
    $('#reply_box').toggle(500, function(){
      $(this).toggleClass('reply_box_display');
    })
  })

