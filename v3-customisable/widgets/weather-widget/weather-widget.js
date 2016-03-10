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

	self.editMode = true ; // Change back to false when finished writing edit form
	self.locations = [] ;

	// TODO - refactor as pure function, accept array as additional input parameter, return extended array
	// TODO - add error handling e.g. name must be string, location must be object with relevant properties
	// TODO - move weather service call to separate function e.g. findLocation
	self.addLocation = function( name, location ) {
		return new Promise( function( resolve, reject ) {
			weatherService.getWeather( location )
			.then( function( data ) {
				data.city = name ;
				self.locations.push( data ) ;
				resolve() ;
			} )
			.catch( function( error ) {
				console.log( 'Controller error ' + error ) ;
				reject() ;
			} ) ;
		} ) ;
	} ;

	// TODO - refactor as pure function, accept array as additional input parameter, return shortened array
	// TODO - add error handling e.g. non-numeric id, attempt to remove element beyond end of array
	self.removeLocation = function( id ) {
		self.locations.splice( id, 1 ) ;
	} ;

	self.createLocation = function() {
		console.log( 'Adding location ' + self.newLocation + '...' ) ;
		// TODO - need to work out how to get name and location data separately
		self.addLocation( self.newLocation, self.newLocation )
		.then( function( result ) {
			self.newLocation = '' ;
		} )
		.catch( function( error ) {
			console.log( 'Ooh gosh something gone wrong' ) ;
		} ) ;
	} ;

	self.moveLocationUp = function( id ) {
		if ( id === 0 ) return ;
		self.locations = swapArrayElements( self.locations, id, id - 1 ) ;
	} ;

	self.moveLocationDown = function( id ) {
		if ( id === self.locations.length -1 ) return ;
		self.locations = swapArrayElements( self.locations, id, id + 1 ) ;
	} ;

	var swapArrayElements = function( arr, x, y ) {
		// Clone original array to avoid this function having side-effects
		var res = arr.slice( 0 ) ;
		// Swap the two specified elements
		var tmp = res[ x ] ;
		res[ x ] = res[ y ] ;
		res[ y ] = tmp ;
		// Return the updated array WITHOUT touching the original
		return res ;
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
