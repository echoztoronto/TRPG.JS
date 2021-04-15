
///////////////  Attribute Panel /////////////////
const aPanel = new AttributePanel('attribute-panel', {
    attributes : {
        hp: 1000,
        mp: 500,
        sanity: 'healthy',
        career: 'web-developer'
      },
    description : {
        hp: 'heath point, you will lose health when you eat a rotten apple :)'
    },
    showDescription : true,
    showDescriptionWhenHoverOn : "both",
    colorChange : true,
    colorChangeTime: 2, 
  });

///////////////  Attribute Bars /////////////////
const aBar = new AttributeBars('attribute-bar', {
    preset_attributes : {  
        hp: [1000,2000,'pink'],
        mp: [500,800,'rgb(155, 198, 255)']
      },
    description : {
        hp: 'heath point, you will lose health when you eat a rotten apple :)',
        mp: 'the thing we all need to cast a spell'
    },
    showDescription : true,
    descriptionPosition : "center",
    colorChange : true,
    colorChangeTime: 2,
    colorChangeColor : "red",
    labelColors: {
        hp: "white"
    },
  });

///////////////  Inventory /////////////////
const myBag = new Inventory('inventory', {
  quantity : {  
      apple: 20,
      banana: 5,
      orange: 0,
      strawberry: 100
    },
  description: {
      apple: 'rotted',
      banana: 'it tastes like a banana'
    }, 
    image: {
      banana: 'img/banana.jpg',
      apple: 'img/apple.jpg',
      strawberry: 'img/strawberry.jpg',
      orange: 'img/orange.jpg'
    },
    numRow: 4,
    numColumn: 6,
    menuOption: ['use','destroy'],
    menuOptionOnclick: {
      'use': use_item,
      'destroy':  destroy_item,
    }
});

function use_item(item) {
  myBag.removeItem(item, 1);
}

function destroy_item(item) {
  myBag.clearItem(item);
}

function gift_item(item) {
  myBag.removeItem(item, 1);
  document.getElementById("inventory-message").innerHTML="thank you!";
  setTimeout(() => {
    document.getElementById("inventory-message").innerHTML= '';
  }, 2000);
}

///////////////  Event List /////////////////
const eList = new EventList('event-list', {
  events : {  
    'golden apple': ['pick up','cancel'],
    'pikachu': ['fight', 'run'],
    'an event without description':
          ['an option without description','cancel']
  },
  eventDescription: {
    'golden apple': `There is a golden apple on the ground,
           and no creatures is guarding it nearby. When you 
           approach, you smell a scent that you can't resist.`,
    'pikachu': "A wild Pikachu appears!"
  },
  options: {
    'cancel': cancel,
    'run': run,
    'fight': fight
  },
  optionDescription: {
    'run': "I'm not strong enough, it's time to escape!",
    'fight': "Escape is for coward, I'd fight till death!",
    'pick up': "It's mine now! [Pick Up]"
  }
});

function cancel(event_name) {
  document.getElementById("event-list-message").innerHTML = 
    `event name: ${event_name} <br> function name: cancel`;
}

function run(event_name) {
  document.getElementById("event-list-message").innerHTML = 
    `event name: ${event_name} <br> function name: run`;
}

function fight(event_name) {
  document.getElementById("event-list-message").innerHTML = 
  `event name: ${event_name} <br> function name: fight`;
}

function pet(event_name) {
  document.getElementById("event-list-message").innerHTML = 
  `event name: ${event_name} <br> function name: pet`;
}

function revive(event_name) {
  document.getElementById("event-list-message").innerHTML = 
  `event name: ${event_name} <br> function name: revive`;
}

function play(event_name) {
  document.getElementById("event-list-message").innerHTML = 
  `event name: ${event_name} <br> function name: play`;
}

function give_food(event_name) {
  document.getElementById("event-list-message").innerHTML = 
  `event name: ${event_name} <br> function name: give_food`;
}