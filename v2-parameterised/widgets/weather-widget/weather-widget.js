// Application
// =============================================================================

// Define module and dependencies

var weatherWidget = angular.module( 'weatherWidget', [] ) ;

// Define service to fetch weather data from external API

weatherWidget.factory( 'weatherService', function( $http, $q ) {

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

} ) ;

// Define controller to fetch weather data for required locations

weatherWidget.controller( 'weatherController', function( weatherService ) {

	var self = this ;

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

} ) ;

// Define directives

weatherWidget.directive( 'weatherWidget', function() {

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

} ) ;

weatherWidget.directive( 'weatherLocation', function() {

	return {
		restrict: 'AE',
		replace: true,
		require: '^weatherWidget',
		scope: { name: '@name', location: '@location' },
		link: function( scope, element, attrs, weatherController ) {
			weatherController.addLocation( scope.name, scope.location ) ;
		}
	} ;

} ) ;
