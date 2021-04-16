# TRPG.JS


TRPG.JS is a library that can be used to build web-based TRPG (Tabletop Role-Playing Game, where multiple players need to follow a set of rules, role-play their characters, and go through a story together). 

Web developers can use TRPG.JS library to display the information panel for each player, such as attributes, skills and inventory, as well as to display events and the possible options to the events. It can be used to build online gaming applications or present the replays of past games, including those that happened in real life. 


## Examples

Landing Page: https://trpg-demo.herokuapp.com/

API Documentation: https://trpg-demo.herokuapp.com/docs.html

## Getting Started
This library is built by vanilla JavaScript, no external module is required.

Simply include the following two lines in the HTML `<head>` tag.
```html
<link rel="stylesheet" href="TRPG.css">
<script src="TRPG.js"> </script>
```

## Attribute Panel
A simple panel shows the attributes names and values.
* customize each attribute’s value and description
* hover on any attribute to see its description
* customize the display style of the entire object

<img src="/readme/panel.jpg" width="300px">


## Attribute Bars
Displays the attributes in a graphical way.
* customize each attribute’s current value, maximum value, bar color and description
* hover on any attribute to see its description
* customize the display style of the entire object

<img src="/readme/bar.jpg" width="300px">



## Inventory
A table-like container which displays the items and allows users to interact with the items.
* customize each item’s description, icon image, options and each option’s onclick function
* hover on any item to see its description
* click on any item to see available options
* customize the style of the inventory

<img src="/readme/inventory.jpg" width="300px">


## Event List
A window displays an event and its options.
* customize each event’s description, options, each option’s onclick function
* show a specific event by its name
* show a random event

<img src="/readme/event.jpg" width="300px">


## Skill Panel
A panel displays the skills.

* customize each skill’s description, cooldown, onclick function and icon image
* show description when hover on any skill
* show cooldown countdown after click on any skill
* disable a skill when it’s in cooldown
* enable a skill when the cooldown ends

<img src="/readme/skill.jpg" width="300px">




