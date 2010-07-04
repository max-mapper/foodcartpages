(function($) {
  
  var app = $.sammy(function() {
    this.element_selector = '#content';
    this.use(Sammy.Template);

    this.before(function() {
    });

    this.get('#/map', function(context) {
      context.partial('cartmap.template', {id: 1}, function(rendered) {
        context.$element().html(rendered);
        var latlng = new google.maps.LatLng(45.597, -122.644);

        var myOptions = {
          zoom: 12,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
      });
    });
    
    this.get('#/carts', function(context) {
      context.partial('carts.template', {id: 1}, function(rendered) {
          context.$element().html(rendered);
          $.couch.app(function(app) {
            app.db.view('webapp/cart', {success: function(cart_results) {
                                          $('#cartcount').html(cart_results.total_rows);
                                          $.each(cart_results.rows, function(index,element) {
                                            var carts_element = $('#carts ul');
                                            context.partial('cart.template', {cart: element}, function(rendered) {
                                               carts_element.append(rendered);
                                            });
                                          });
                                       }});
          });
      });
    });

    $(function() {
      app.run('#/map');
    });
  });
})(jQuery);
