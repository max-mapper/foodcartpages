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
          $('#cartcount').html('loading cart data <img src="images/spinner.gif">');
          $.couch.app(function(app) {
            app.db.view('webapp/cart', {success: function(cart_results) {
                                          $('#cartcount').html(cart_results.total_rows+" food carts listed.");
                                          $.each(cart_results.rows, function(index,element) {
                                            var carts_element = $('#carts ul');
                                            context.partial('cart.template', {cart: element}, function(rendered) {
                                               carts_element.append(rendered);
                                            });
                                          });
                                       }});
          }, {db : "food_carts", design : "webapp"});
      });
    });

    this.get('#/carts/new', function(context) {
      $.couch.app(function(app) {
        app.db.saveDoc({}, {success: function(res) {
          window.location = "#/carts/edit/"+res.id;
        }});
      }, {db : "food_carts", design : "webapp"});
    });

    this.get('#/carts/edit/:id', function(context) {
      var id = this.params['id'];
      $.couch.app(function(app) {
        app.db.openDoc(id, {success: function(cart_doc) {
          context.partial('cartedit.template', {cart: cart_doc}, function(rendered) {
            context.$element().html(rendered);
            var cartform = $('#cartform');
            $('#cartform').submit(function() {
              app.db.saveDoc({
                               _id: cart_doc._id,
                               _rev: cart_doc._rev,
                               name: $('#cartform #name').val(), 
                               hours: $('#cartform #hours').val(), 
                               description: $('#cartform #description').val(), 
                               geometry: {coordinates: [0,0],"type":"Point"}
                             }, {success: function(res) {
                                  window.location = "#/carts";
              }});
              return false;
            });
          });
        }});
      }, {db : "food_carts", design : "webapp"});
    });

    $(function() {
      app.run('#/map');
    });
  });
})(jQuery);
