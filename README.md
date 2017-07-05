# Eat That Truck
README
======

Problem and Solution
-----
The user wants to locate food trucks nearby a specific location. With this
application, the user will be able to identify food trucks in a specific
location on displayed on a Google map.

Problems:
- data contains trucks with unqualified status (expired license, pending approval, inactive ...etc)
- correctly parse business hours and daily schedule from string into structured data to apply filters
- will need to enable user to use their current location or build location search function as an alternative option for better UX.

Options:
default location: "San Francisco"
All Locations: set radius to 20 miles.
Filter Radius: reduce radius to filter trucks.
Open Now: filter only business that's currently open and within radius setting.
Filter by Business Hour: filter business that's open at a specific hour

***Solution***
-----
- geolocation from browser: to detect user location
- google map API: to search an address to be used as desired location
- google map API: to display search results
- flexible filters: to allow users to choose any location and any time of the day for ease of planning
- adding Yelp to provide ratings for search results for better UX (in progress) 

***Application's Technologies***
-----
- Javascript, ES6
- React: for modular component design
- Redux: using redux and localStorage to organize application state and DOM updates 
- Sass
- Node for dev server and plan on using Node to build API to consume Yelp's API
- Webpack for modular design 
- Webpack

Reasoning behind your technical choices, including architectural. Trade-offs you might have made, anything you left out, or what you might do differently if you were to spend additional time on the project.

- I choose React because I like how it allows me to handle events by using application state. I can apply OO design with React much easier than other framework I've used before like Angular and Ruby.
- I would make the Redux Store immutable because one mistake of mutating the state cause the application failed to re-render.  
- I would consider using the library 'react-google-maps' as it allows me to connect google map elements to application state for better event handling and DOM updates. 
- Reconfigure Webpack to bundle css into separate file instead of compiling them as inline styles
- use Mocha to write test to test search results/ filter algorithms/ and events more throughly.
- breakup map.js file into smaller files
- cross browser testing, css does not look right on IPhone and Firefox. 

***Link to other code you're particularly proud of:***
-----
- http://www.midnightapplepie.com/
- github: https://github.com/Midnightapplepie/midnightapplepie.com
- I really enjoy building that animated character with html and css

Link to your resume or public profile:
-----
- resume: http://www.midnightapplepie.com/resume
- github: https://github.com/Midnightapplepie
- hackerrank: https://www.hackerrank.com/midnightapplepie

Link to to the hosted application where applicable:
-----
- https://midnightapplepie.github.io/EatThatTruck/
- http://www.midnightapplepie.com/
- http://www.xiaoloong.com/
- http://midnightapplepie.github.io/projects/canvas.html
