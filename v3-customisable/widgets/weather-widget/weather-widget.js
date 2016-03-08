// Application
// =============================================================================

// Define service to fetch weather data from external API

var weatherService = function( $http, $q ) {

	return {
		getWeather: function( location ) {

			var deferred = $q.defer() ;

			$http.get( 'http://api.worldweatheronline.com/free/v1/weather.ashx?query=' + location + '&num_of_results=1&format=json&key=0c88abb019f82e1564f2248f0c4eee0a41fdae1a' )
			.success( function( data ) {
				deferred.resolve( {
					temperature: data.data.current_condition[ 0 ].temp_C,
					summary: data.data.current_condition[ 0 ].weatherDesc[ 0 ].value,
					icon: data.data.current_condition[ 0 ].weatherIconUrl[ 0 ].value
				} ) ;
			} )
			.error( function( error ) {
				deferred.reject( error ) ;
			} ) ;

			return deferred.promise ;
		}
	} ;

} ;

// Define controller that allows locations to be managed

var weatherController = function( weatherService ) {

	var self = this ;

	self.editMode = false ;
	self.locations = [] ;

	self.addLocation = function( name, location ) {
		weatherService.getWeather( location )
		.then( function( data ) {
			data.city = name ;
			self.locations.push( data ) ;
		} )
		.catch( function( error ) {
			console.log( 'Controller error ' + error ) ;
		} ) ;
	} ;

	self.removeLocation = function( location ) {
		self.locations.splice( location, 1 ) ;
	} ;

} ;

// Define directives

var weatherDirective = function() {

	return {
		restrict: 'AE',
		replace: true,
		transclude: true,
		scope: {},
		templateUrl: 'widgets/weather-widget/weather-widget.html',
		bindToController: true,
		controllerAs: 'weatherWidget',
		controller: 'weatherController',
	} ;

} ;

var weatherLocation = function() {

	return {
		restrict: 'AE',
		replace: true,
		require: '^weatherWidget',
		scope: { name: '@name', location: '@location' },
		link: function( scope, element, attrs, weatherController ) {
			weatherController.addLocation( scope.name, scope.location ) ;
		}
	} ;

} ;


// Define Angular module and components

var weatherWidget = angular.module( 'weatherWidget', [] ) ;
weatherWidget.factory( 'weatherService', weatherService ) ;
weatherWidget.controller( 'weatherController', weatherController ) ;
weatherWidget.directive( 'weatherWidget', weatherDirective ) ;
weatherWidget.directive( 'weatherLocation', weatherLocation ) ;
