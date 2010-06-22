function(data) {
  var p;
  
  $.each(data.rows, function(index, item){
    item.value.lat = item.value.geometry.coordinates[1];
    item.value.lon = item.value.geometry.coordinates[0];
  });
  var items = {
    items : data.rows.map(function(r) {
      p = r.value
      return p;
    })
  };

  return items;
};
