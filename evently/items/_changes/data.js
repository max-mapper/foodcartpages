function(data) {
  $.log(data)
  var p;
  var items = {
    items : data.rows.map(function(r) {
      p = r.value
      return p;
    })

  };
  return items;
};
