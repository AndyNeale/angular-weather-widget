describe( 'weatherWidget', function() {

	beforeEach( module( 'weatherWidget' ) ) ;

	var $controller ;

	beforeEach( inject( function( _$controller_ ) {
		$controller = _$controller_ ;
	} ) ) ;

	describe( 'my first test', function() {
		it( 'something something', function() {
			var controller = $controller( 'weatherController' ) ;
			expect( controller.locations.length ).toBe( 0 ) ;
		} ) ;
	} ) ;

} ) ;
