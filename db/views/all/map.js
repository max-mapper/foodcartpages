function(doc) {
  emit((typeof(doc.name) == 'undefined') ? 'Unnamed Cart' : doc.name, doc);
}