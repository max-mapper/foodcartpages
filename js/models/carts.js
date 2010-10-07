Carts = Sammy('#container').createModel('carts');
Carts.extend({
  nearby: [],
  cartIcon: new GIcon(),
  createMap: function(){
    Carts.cartIcon.image = 'images/carticon/image.png';
    Carts.cartIcon.printImage = 'images/carticon/printImage.gif';
    Carts.cartIcon.mozPrintImage = 'images/carticon/mozPrintImage.gif';
    Carts.cartIcon.iconSize = new GSize(60,58);
    Carts.cartIcon.shadow = 'images/carticon/shadow.png';
    Carts.cartIcon.transparent = 'images/carticon/transparent.png';
    Carts.cartIcon.shadowSize = new GSize(89,58);
    Carts.cartIcon.printShadow = 'images/carticon/printShadow.gif';
    Carts.cartIcon.iconAnchor = new GPoint(30,58);
    Carts.cartIcon.infoWindowAnchor = new GPoint(30,0);
    Carts.cartIcon.imageMap = [40,0,42,1,44,2,42,3,47,4,48,5,50,6,52,7,53,8,55,9,53,10,55,11,58,12,58,13,58,14,56,15,55,16,51,17,55,18,53,19,53,20,53,21,53,22,53,23,57,24,51,25,57,26,58,27,59,28,59,29,59,30,58,31,58,32,55,33,57,34,55,35,52,36,52,37,52,38,52,39,52,40,54,41,54,42,54,43,51,44,50,45,46,46,50,47,43,48,38,49,33,50,33,51,33,52,35,53,35,54,35,55,32,56,32,57,28,57,25,56,27,55,27,54,26,53,24,52,24,51,24,50,24,49,24,48,22,47,19,46,16,45,13,44,8,43,5,42,8,41,5,40,4,39,3,38,1,37,1,36,3,35,3,34,3,33,3,32,1,31,0,30,1,29,1,28,0,27,0,26,1,25,2,24,4,23,4,22,3,21,4,20,2,19,1,18,1,17,0,16,1,15,1,14,2,13,4,12,2,11,6,10,5,9,6,8,7,7,12,6,18,5,13,4,18,3,24,2,29,1,37,0];
    $('#map_canvas').css({height: $(window).height(), width: $(window).width() - 581});
    Carts.map = new GMap2($("#map_canvas").get(0));
    Carts.map.addMapType({type:G_AERIAL_MAP});
    Carts.map.setMapType(G_AERIAL_MAP);
    var portlandOR = new GLatLng(45.525571246250465, -122.66827583312988);
    Carts.map.setCenter(portlandOR, 15);
    Carts.getFoodCarts();
  },

  showCart: function(cart_info) {
    var point = new GLatLng(cart_info.geometry.coordinates[1], cart_info.geometry.coordinates[0]);
    var marker = new GMarker(point, {icon:Carts.cartIcon});
    map.addOverlay(marker);
    map.setZoom(19);
    map.panTo(point);
    app.setLocation("#/cart/" + cart_info._id);
  },

  getFoodCarts: function() {
    $.ajax({
      url: "http://maxogden.couchone.com/food_carts/_design/names/_spatial/points?bbox=-180,180,-90,90",
      dataType: 'jsonp',
      success: function(response) {
        $.each(Carts.nearby, function(i, cart) {
          cart.remove();
        });
        Carts.nearby = [];
        $.each(response.rows, function(i,point) {
          var loc = new GLatLng(point.bbox[1], point.bbox[0]);
          var marker = new GMarker(loc, {icon: Carts.cartIcon});
          GEvent.addListener(marker, "click", function() {
            window.location = "#/cart/" + point.id;
          });
          Carts.map.addOverlay(marker);
          Carts.nearby.push(marker);
        });
      }
    });
  },
  
  bindAutoComplete: function(carts) {
    $("#autocomplete").autocomplete(carts, {
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
      $('#autocomplete').val('').blur().focus();
    });
  },
  
  beforeSave: function(doc) {
    Sammy.log('doc', doc);
    return doc;
  }
});
