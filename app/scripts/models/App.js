angular.module('ngArchitecture')
  .factory('App', function() {

    function App(name, deps) {
      this.name = name;
      this.deps = deps;
    }

    return App;

  });
