(function($) {
  var app = $.sammy('#container', function() {
    this.use('JSON')
        .use('Mustache')
        .use('Storage')
        .use('NestedParams')
        .use('Couch');

    var showLoading = function() {
      $('#loading').show();
    };

    var hideLoading = function() {
      $('#loading').hide();
    };

    this.bind('run', function() {
      showLoading();
      $('#autocomplete').placeholder();
      $('#autocomplete').focus().blur();
      var ctx = this;
    });

    this.get('#/', function(ctx) {
      showLoading();
      this.load($('#templates .carts-map'))
          .replace('#right_content')
          .send(Carts.viewDocs, 'all', {
            descending: true
          })
          .then(Carts.createMap)
          .then(hideLoading);
    });

    // this.post('#/action', function(ctx) {
    //    this.send(Action.create, this.params['action'])
    //        .then(function(response) {
    //          this.event_context.trigger('add-action', {id: response['id']});
    //        })
    //        .send(clearForm);
    //  });
    // 
    //  this.get('#/action/:type/:token', function(ctx) {
    //    showLoading();
    //    this.buildTokenCSS();
    //    this.setSearchHeader(this.params);
    //    this.load($('#templates .action-index'))
    //        .replace('#main')
    //        .send(Action.viewDocs, 'by_token', {
    //          startkey: [this.params.type, this.params.token + "a"],
    //          endkey: [this.params.type, this.params.token],
    //          descending: true
    //        })
    //        .renderEach($('#action-template'))
    //        .appendTo('#main .actions')
    //        .then('formatTimes')
    //        .then(hideLoading);
    //  });
    // 
    //  this.get('#/replicate', function(ctx) {
    //    this.partial($('#replicator')).then(hideLoading);
    //  })
    // 
    //  this.bind('add-action', function(e, data) {
    //    this.log('add-action', 'params', this.params, 'data', data);
    //    this.buildTokenCSS();
    //    this.send(Action.get, data['id'])
    //        .render($('#action-template'))
    //        .prependTo('#main .actions')
    //        .then('formatTimes');
    //  });
    // 
    //  this.bind('toggle-action', function(e, data) {
    //    this.log('toggle-action', 'params', this.params, 'data', data);
    //    var update = {};
    //    if (data.complete) {
    //      update = {completed: true, completed_at: Action.timestamp()};
    //    } else {
    //      update = {completed: false, completed_at: null};
    //    }
    //    this.send(Action.update, data.id, update)
    //        .then(function() {
    //          data.$action.toggleClass('complete');
    //        });
    //  });

  });

  $(function() {
    app.run('#/');
  });

})(jQuery);