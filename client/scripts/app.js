var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    this.set('like', !this.get('like'));

  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // your code here
    // create an event listener for the collection
    // listen for a 'change' on any of the attributes in any of the Movie models
    // when it registers a change
    // call sort
    this.on('change', this.sort);

  },

  comparator: 'title',

  sortByField: function(field) {
    console.log('sorting.....');
    // your code here
    // set comparator equal to field
    this.comparator = field;
    //call the sort function on the collection
    console.log('this before sort', this);
    this.sort();
    console.log('this after sort', this);
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    console.log('click', e);
    var field = $(e.target).val();
    console.log(field);
    this.collection.sortByField(field);
    console.log('...........handle click context, this: ', this);
    this.render();
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    //create a listener that listens for changes to the movie model
    //and calls render on this view when it is triggered
    //console.log('initialize', this); <--- the movie view
    this.model.on('change', this.render, this); //within listener .. this refers to the movie

  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    // your code here
    // call toggleLike on model
    this.model.toggleLike();
  },

  render: function() {
    //console.log('render', this);
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
