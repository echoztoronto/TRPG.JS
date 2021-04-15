# TRPG.JS


TRPG.JS is a library that can be used to build web-based TRPG (Tabletop Role-Playing Game, where multiple players need to follow a set of rules, role-play their characters, and go through a story together). 

Web developers can use TRPG.JS library to display the information panel for each player, such as attributes, skills, talent tree, inventory, as well as to display events (and possible options/reactions to events) and build a chat window. It can be used to build online gaming applications or present the replays of past games (including those that happened in real life). 


## Examples

Playground with examples: https://trpg-demo.herokuapp.com/examples.html
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

<img src="/readme/panel.jpg" width="100px">

HTML: 
```html
<div id="attribute-panel"> </div>
```

JavaScript: 
```js
const aPanel = new AttributePanel(
    // first parameter: element ID
    'attribute-panel', {
    // second parameter: configurations
        // required configuration: attribute names and values
        attributes : {
            hp: 1000,
            mp: 500,
            sanity: 'healthy',
            career: 'web developer'
          },
        // optional configurations: description
        description : {
            hp: 'heath point, you will lose health when 
                you eat a rotten apple :)'
        },
        showDescription : true
  });
```

## Attribute Bars
Displays the attributes in a graphical way.

<img src="/readme/bar.jpg" width="300px">

HTML: 
```html
<div id="attribute-bar"> </div>
```

JavaScript: 
```sh
const aBar = new AttributeBars(
    // first parameter: element ID
    'attribute-bar', {
    // second parameter: configurations
        // required configuration: attribute names, values and bar colors
        preset_attributes : {  
            hp: [1000,2000,'pink'],
            mp: [500,800,'rgb(155, 198, 255)']
          },
        // optional configurations: description
        description : {
            hp: 'heath point, you will lose health when 
                you eat a rotten apple :)',
            mp: 'the thing we all need to cast a spell'
        },
        showDescription : true
  });
```

## Inventory
A table-like container which displays the items and allows users to interact with the items.

<img src="/readme/inventory.jpg" width="300px">

HTML: 
```html
<div id="inventory"> </div>
```

JavaScript: 
```js
const myBag = new Inventory(
    // first parameter: element ID
    'inventory', {
    // second parameter: configurations
        // required configuration: item names and quantities
        quantity : { apple: 20,banana: 5,
                   orange: 0,strawberry: 100},
        // optional configurations: description
        description: { apple: 'rotted',
               banana: 'it tastes like a banana' }, 
        // optional configurations: image path
        image: { apple: //path to image here},
        // optional configurations: row number and column number
        numRow: 4,
        numColumn: 6,
        // optional configurations: left click menu options and their onclick event functions
        menuOption: ['use','destroy'],
        menuOptionOnclick: { 'use': use_item,
         'destroy':  destroy_item,}  
});
```


## Event List
A window displays an event and its options.

HTML: 
```html
<div id="event-list"> </div>
```
JavaScript: 
```js
const eList = new EventList(
    // first parameter: element ID
   'event-list', {
    // second parameter: configurations
      // events and their options
      events : {  
        'golden apple': ['pick up','cancel'],
        'pikachu': ['fight', 'run'],
        'an event without description':
              ['an option without description','cancel']
      },
      // events and their descriptions
      eventDescription: {
        'golden apple': `There is a golden apple on the ground,
               and no creatures is guarding it nearby. When you 
               approach, you smell a scent that you can't resist.`,
        'pikachu': "A wild Pikachu appears!"
      },
      // options and their onclick functions
      options: {
        'cancel': cancel,
        'run': run,
        'fight': fight
      },
      // options and their descriptions
      optionDescription: {
        'run': "I'm not strong enough, it's time to escape!",
        'fight': "Escape is for coward, I'd fight till death!",
        'pick up': "It's mine now! [Pick Up]"
      }
});
```

