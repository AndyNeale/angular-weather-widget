# AngularJS Weather Widget

A sample project illustrating how to use AngularJS directives to add a self-contained weather widget to an existing web page.

## Running the examples

You'll need to run a basic local web server to run the examples.

If you're running Node.js locally, this is as simple as:

```
npm install http-server -g
cd v1-basic
http-server
```

Then browse to http://127.0.0.1:8080 and watch the magic unfold!

Note that http-server uses port 8080 by default, if this is already in use then you can simply specify another port:

```
http-server -p 8081
```

## Version 1: Basic

The first attempt shows how we can add a widget to a page with a minimum of impact. Adding the widget involves three changes:

### 1. Stylesheet

The widget comes with its own self-contained stylesheet, as we have no way of knowing what styles the parent page might be using. This is included in the page's **head** tag:

```
<link href="widgets/weather-widget/weather-widget.css" rel="stylesheet" media="screen" />
```

### 2. Widget

Next comes the widget itself, which is the minimal block of HTML needed to bootstrap the corresponding AngularJS application:

```
<div class="weatherWidget" ng-app="weatherWidget" ng-controller="weatherController">
	<div weather-widget>Loading...</div>
</div>
```

(In a real-life scenario, we might need to namespace the widget to avoid conflicts with other components.)

### 3. Scripts

Finally, we need to include the core AngularJS library, and our own custom widget code - this goes at the bottom of the page, just before the closing **body** tag:

```
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js"></script>
<script src="widgets/weather-widget/weather-widget.js"></script>
```

## Version 2: Parameterised

In the second iteration, we want to get rid of the hard-coded locations embedded in the widget controller, and instead write our template HTML something like this:

```
<weather-widget class="weatherWidget" ng-app="weatherWidget">
	<weather-location name="Sheffield" location="Sheffield,United+Kingdom"></weather-location>
	<weather-location name="Mumbai" location="Mumbai,India"></weather-location>
	<weather-location name="San Francisco" location="San+Francisco"></weather-location>
</weather-widget>
```

### 1. Controller

In the controller, we will use **this** (and **bindToController** and **controllerAs** in the directive, as we'll see later) to bind directly to the controller object, removing the dependency on the **$scope** service, which makes for cleaner code.

Instead of manually requesting data from the corresponding service for a hard-coded list of locations, we will instead provide an **addLocation** method which can be called from the **location** directive to add weather data for whatever locations we want later.

### 2. Widget directive

The widget directive now includes some important changes:

```
transclude: true
```
This pushes the output from the directive into the right place in the template.

```
bindToController: true
```
This allows us to directly reference the controller object.

```
controllerAs: 'weatherWidget'
```
This is the reference to the controller object that will be passed to the template.

```
controller: 'weatherController'
```
Finally, this associates the directive with the relevant controller.

### 3. Location directive

We also need a location directive, which allows us to specify the locations we want to see weather data for.

This has some key properties:

```
require: '^weatherWidget'
```
This specifies that the location directive must appear as a child of the widget directive.

```
scope: { name: '@name', location: '@location' }
```
This passes **name** and **location** attributes from our HTML (in this case, giving them the same names when they are passed into the directive's scope).

```
link: function( scope, element, attrs, weatherController ) {
  weatherController.addLocation( scope.name, scope.location ) ;
}
```
The link function declares a dependency on **weatherController**, which is made available to us via the **require** parameter which says that this directive must occur inside the widget directive where the weather controller is defined.

It then calls the **addLocation** method on that controller to add the specified location.

### 4. Template

The directive template is largely unchanged from before. It includes

```
<div ng-transclude></div>
```

which allows the rendering process to inject content into the relevant location, and the **ng-repeat** loop references **weatherWidget.locations** because we have exposed this data to the template via the **controllerAs** setting in the widget directive definition.
