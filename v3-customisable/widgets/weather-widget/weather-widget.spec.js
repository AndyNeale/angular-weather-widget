describe( 'weatherWidget', function() {

	var controller ;

	// Make the AngularJS app available to each test
	beforeEach( module( 'weatherWidget' ) ) ;

	// Make the widget controller available to each test
	// In a normal app we wouldn't do this, but because we only have one controller it's OK
	beforeEach( inject( function( _$controller_ ) {
		controller = _$controller_( 'weatherController' ) ;
	} ) ) ;

	describe( 'array functions in weather widget controller', function() {

		var mockLocation = { name: 'Paradise', data: { temperature: 40, summary: 'Bloody hot', icon: '' } } ;

		it( 'locations array should initially be empty', function() {
			expect( controller.locations.length ).toBe( 0 ) ;
		} ) ;

		it( 'addLocation should extend the locations array', function() {
			controller.addLocation( mockLocation.name, mockLocation.data )
			.then( function( result ) {
				expect( controller.locations.length ).toBe( 1 ) ;
			} )
			.catch( function( error ) {
				fail( 'Error adding location ' + error ) ;
			} ) ;
		} ) ;

	} ) ;

} ) ;
