var map;
var nearbyCarts = [];
var carts;
var cartMap = function() {
  var cartIcon = new GIcon();
  cartIcon.image = 'images/carticon/image.png';
  cartIcon.printImage = 'images/carticon/printImage.gif';
  cartIcon.mozPrintImage = 'images/carticon/mozPrintImage.gif';
  cartIcon.iconSize = new GSize(60,58);
  cartIcon.shadow = 'images/carticon/shadow.png';
  cartIcon.transparent = 'images/carticon/transparent.png';
  cartIcon.shadowSize = new GSize(89,58);
  cartIcon.printShadow = 'images/carticon/printShadow.gif';
  cartIcon.iconAnchor = new GPoint(30,58);
  cartIcon.infoWindowAnchor = new GPoint(30,0);
  cartIcon.imageMap = [40,0,42,1,44,2,42,3,47,4,48,5,50,6,52,7,53,8,55,9,53,10,55,11,58,12,58,13,58,14,56,15,55,16,51,17,55,18,53,19,53,20,53,21,53,22,53,23,57,24,51,25,57,26,58,27,59,28,59,29,59,30,58,31,58,32,55,33,57,34,55,35,52,36,52,37,52,38,52,39,52,40,54,41,54,42,54,43,51,44,50,45,46,46,50,47,43,48,38,49,33,50,33,51,33,52,35,53,35,54,35,55,32,56,32,57,28,57,25,56,27,55,27,54,26,53,24,52,24,51,24,50,24,49,24,48,22,47,19,46,16,45,13,44,8,43,5,42,8,41,5,40,4,39,3,38,1,37,1,36,3,35,3,34,3,33,3,32,1,31,0,30,1,29,1,28,0,27,0,26,1,25,2,24,4,23,4,22,3,21,4,20,2,19,1,18,1,17,0,16,1,15,1,14,2,13,4,12,2,11,6,10,5,9,6,8,7,7,12,6,18,5,13,4,18,3,24,2,29,1,37,0];
  
  return { 
    createMap: function(){
      $('#map_canvas').css({height: $(window).height(), width: $(window).width() - 581});
      map = new GMap2($("#map_canvas").get(0));
      map.addMapType({type:G_AERIAL_MAP});
      map.setMapType(G_AERIAL_MAP);
      var portlandOR = new GLatLng(45.525571246250465, -122.66827583312988);
      map.setCenter(portlandOR, 15);
      GEvent.addListener(map, "moveend", function(){
        var center = map.getCenter();
        cartMap.getFoodCarts(center.lat(), center.lng());
      });
    },
    
    showCart: function(cart_info) {
      var point = new GLatLng(cart_info.geometry.coordinates[1], cart_info.geometry.coordinates[0]);
      var marker = new GMarker(point, {icon:cartIcon});
      map.addOverlay(marker);
      map.setZoom(19);
      map.panTo(point);
      // map.openInfoWindowHtml(point, cart_info.name);
      window.location = "#/cart/" + cart_info._id;
    },

    getFoodCarts: function(lat, lon) {
      var one_block = 0.0012;
      $.ajax({
        url: "http://data.pdxapi.com:5984/food_carts/_design/names/_spatial/points?bbox="+ (lon - one_block) + "," + (lat - one_block) + "," + (lon + one_block) + "," + (lat + one_block),        
        dataType: 'jsonp',
        success: function(response) {
          $.each(nearbyCarts, function(i, cart) {
            cart.remove();
          });
          nearbyCarts = [];
          var data = response.rows;
          $.each(data, function(i,point) {
            var loc = new GLatLng(point.bbox[1], point.bbox[0]);
            var marker = new GMarker(loc, {icon:cartIcon});
            GEvent.addListener(marker, "click", function() {
              window.location = "#/cart/" + point.id;
            });
            map.addOverlay(marker);
            nearbyCarts.push(marker);
          });
        }
      });
    }
  };
}();

(function($) {
  var app = $.sammy(function() {
    this.element_selector = '#inner_content';
    this.use(Sammy.Template);
    
    this.get('#/browse', function(context) {
      $.couch.app(function(app) {
        app.db.view('webapp/cart', {success: function(cart_results) {
        carts = cart_results;
        $("#autocomplete").autocomplete(cart_results.rows, {
          matchContains: true,
          formatItem: function(row, i, max) {
            return row.key;
          },
          formatMatch: function(row, i, max) {
            return row.key;
          },
          formatResult: function(row) {
            return row.key;
          }
        });
        $("#autocomplete").result(function(event, data, formatted) {
                  app.db.openDoc(data.id, {success: function(cart_info) {
                    cartMap.showCart(cart_info);
                  }});
                
                  $('#autocomplete').val('').blur().focus();
               });
      }});
      $('#autocomplete').placeholder();
      $('#autocomplete').focus().blur();
        cartMap.createMap();
      }, {db : "food_carts", design : "webapp"});
    });
    
    this.get('#/cart/:id', function(context) {
      var id = this.params['id'];
      $.couch.app(function(app) {
        app.db.openDoc(id, {success: function(cart_doc) {
          context.partial('cart.template', {cart: cart_doc}, function(rendered) {
            context.$element().html(rendered);
            cartMap.showCart(cart_doc);
          });
        }});
      }, {db : "food_carts", design : "webapp"});
    });
    
    this.get('#/carts', function(context) {
      context.partial('carts.template', {id: 1}, function(rendered) {
          context.$element().html(rendered);
          $('#cartcount').html('loading cart data <img src="images/spinner.gif">');
          $.couch.app(function(app) {
            app.db.view('webapp/cart', {success: function(cart_results) {
                                          $('#cartcount').html(cart_results.total_rows+" food carts listed.");
                                          $.each(cart_results.rows, function(index,element) {
                                            var carts_element = $('#carts ul#carts');
                                            context.partial('cart.template', {cart: element.value}, function(rendered) {
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
          var carts_element = $('#carts ul#carts');
          context.partial('cart.template', {cart: {_id: res.id, _rev: res.rev, geometry:{coordinates:[0,0]}}}, function(rendered) {
             carts_element.append(rendered);
          });
          window.location = "#/carts/edit/"+res.id;
        }});
      }, {db : "food_carts", design : "webapp"});
    });

    this.get('#/carts/edit/:id', function(context) {
      var id = this.params['id'];
      $.couch.app(function(app) {
        app.db.openDoc(id, {success: function(cart_doc) {
          context.partial('cartedit.template', {cart: cart_doc}, function(rendered) {
            $('#'+id).replace(rendered);
            $('#cartform').submit(function() {
              var newCart = {  _id: cart_doc._id,
                               _rev: cart_doc._rev,
                               name: $('#cartform #name').val(), 
                               hours: $('#cartform #hours').val(), 
                               description: $('#cartform #description').val(), 
                               geometry: {coordinates: [0,0],"type":"Point"}};
              app.db.saveDoc(newCart, {success: function(res) {
                                    context.partial('cart.template', {cart: newCart}, function(rendered) {
                                      $('#'+id).replace(rendered);
                                    });
              }});
              return false;
            });
          });
        }});
      }, {db : "food_carts", design : "webapp"});
    });

    this.get('#/credits', function(context) {
      context.partial('credits.template', function(rendered) {
        context.$element().html(rendered)
      });
    });
    
    var justResized = false;
    $(window).bind('resize', function() {
      if (justResized == false) {
        map.checkResize();
        $('#map_canvas').css({height: $(window).height(), width: $(window).width() - 581});
        justResized = true;
        setTimeout(function(){
          justResized = false;
        }, 100);
      }
    });

    $(function() {
      app.run("#/browse");
    });
  });
})(jQuery);
