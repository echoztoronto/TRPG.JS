
const event_msg = document.getElementById('event-msg');

///////////////  Attribute Panel /////////////////
const aPanel = new AttributePanel('attribute-panel', {
    attributes : {
        strength: 100,
        agility: 100,
        sanity: 'healthy'
      },
    description : {
        strength: `For each point of strength, you gain the following bonuses:<br>
        20 health <br>
        0.1 health regeneration`,
        agility: `For each point of agility, you gain the following bonuses:<br>
        0.17 armor <br>
        1 attack speed`,
        sanity: 'your mental health'
    },
    showDescription : true,
    showDescriptionWhenHoverOn : "both",
    colorChange : true,
    colorChangeTime: 1, 
  });

///////////////  Attribute Bars /////////////////
const aBar = new AttributeBars('attribute-bar', {
    preset_attributes : {  
        hp: [100,100,'pink'],
        mp: [80,100,'rgb(155, 198, 255)']
      },
    description : {
        hp: 'heath point, you will lose health when you eat a rotten apple :)',
        mp: 'the thing we all need to cast a spell'
    },
    showDescription : true,
    descriptionPosition : "center",
    colorChange : false,
  });

///////////////  Inventory /////////////////
const myBag = new Inventory('inventory', {
  quantity : {  
      apple: 20,
      banana: 5,
      strawberry: 100
    },
  description: {
      apple: 'rotted <br> -5 hp ',
      banana: 'it tastes like a banana <br> +5 strength',
      strawberry: '+2 strengh, +1 agility',
      orange: '+ 100 max hp'
    }, 
    image: {
      banana: 'img/banana.jpg',
      apple: 'img/apple.jpg',
      strawberry: 'img/strawberry.jpg',
      orange: 'img/orange.jpg'
    },
    numRow: 3,
    numColumn: 4,
    itemSize:60,
    menuOption: ['use','destroy','gift'],
    menuOptionOnclick: {
      'use': use_item,
      'destroy':  destroy_item,
      'gift': gift_item
    }
});

function use_item(item) {
  myBag.removeItem(item, 1);
  if(item == 'banana')  aPanel.set('strength',aPanel.get('strength') + 5);
  if(item == 'apple')   aBar.setValue('hp',aBar.get('hp') - 5);
  if(item == 'strawberry')  {
      aPanel.set('strength',aPanel.get('strength') + 2);
      aPanel.set('agility',aPanel.get('agility') + 1);
  }
  if(item == 'orange')  aBar.setMaxValue('hp',aBar.getMax('hp') + 100);
}

function destroy_item(item) {
  myBag.clearItem(item);
}

function gift_item(item) {
  myBag.removeItem(item, 1);
  if(item == 'banana')  aPanel.set('strength',aPanel.get('strength') + 1);
} 

///////////////  Event List /////////////////
const eList = new EventList('event-list', {
  events : {  
    'golden apple': ['pick up','cancel'],
    'pikachu': ['fight', 'run'],
    'cat': ['pet', 'run', 'fight', 'give it an apple'],
    'die': ['revive']
  },
  eventDescription: {
    'golden apple': `There is a golden orange on the ground,
           and no creatures is guarding it nearby. When you 
           approach, you smell a scent that you can't resist.`,
    'pikachu': "A wild Pikachu appears!",
    'die': "Something just happened, and for some reasons you just died! <br> SORRY :(",
    'cat': 'You see a cat in your bathroom'
  },
  options: {
    'pick up': pick_up,
    'cancel': cancel,
    'run': run,
    'fight': fight,
    'pet': pet,
    'revive': revive,
    'give it an apple': give_food
  },
  optionDescription: {
    'run': "I'm not strong enough, it's time to escape!",
    'fight': "Escape is for coward, I'd fight till death!",
    'pick up': "It's mine now! [Pick Up]"
  }
});



function pick_up(event_name) {
    myBag.addItem("orange", 1);
    event_msg.innerHTML += 'orange + 1 <br><br>';
    event_msg.scrollTop = event_msg.scrollHeight;
    eList.showRandomWithoutRepeat();
}

function cancel(event_name) {
    document.getElementById("event-list").style.visibility = 'hidden';
}

function run(event_name) {
    aBar.setValue('hp',aBar.get('hp') - 10);
    aBar.setValue('mp',aBar.get('mp') - 5);
    event_msg.innerHTML += 'escaped, hp - 10, mp - 5 <br><br>';
    event_msg.scrollTop = event_msg.scrollHeight;
    eList.showRandomWithoutRepeat();
}

function fight(event_name) {
    myBag.addItem("orange", 5);
    event_msg.innerHTML += 'obtained 5 oranges from the battle <br><br>';
    event_msg.scrollTop = event_msg.scrollHeight;
    eList.showRandomWithoutRepeat();
}

function pet(event_name) {
    aBar.setValue('hp',aBar.get('hp') + 10);
    event_msg.innerHTML += 'hp + 10 <br><br>';
    event_msg.scrollTop = event_msg.scrollHeight;
    eList.showRandomWithoutRepeat();
}

function revive(event_name) {
    aBar.setValue('hp',aBar.get('hp') + 100);
    event_msg.innerHTML += 'revived , hp + 100 <br><br>';
    event_msg.scrollTop = event_msg.scrollHeight;
    eList.showRandomWithoutRepeat();
}

function give_food(event_name) {
    myBag.addItem("apple", -1);
    event_msg.innerHTML += 'apple - 1 <br><br>';
    event_msg.scrollTop = event_msg.scrollHeight;
    eList.showRandomWithoutRepeat();
}


///////////////  Skill Panel /////////////////
const sPanel = new SkillPanel('skill-panel', {
  skills: ['attack','fire ball','retreat'],
  icon: {
    'attack': "img/stick.png",
    'fire ball': 'img/fire.jpg',
    'retreat': "img/escape.jpg",
  },
  description: {
    attack:'normal attack  <br> mana cost: 1 <br> <i> better than escape</i>',
    'fire ball': 'maginal attack <br> super strong  <br> mana cost: 20',
    retreat: "it's a situational retreat, lose some hp and mp  <br> mana cost: 5"
  },
  onclick: {
    attack: attack,
    'fire ball': fire_ball,
    retreat: retreat,
  },
  cooldown: {
    retreat: 5,
    'fire ball': 10,
  },
  descriptionPosition : 'top'
});


function attack() {
    aBar.setValue('mp',aBar.get('mp') - 1);
}

function retreat() {
    aBar.setValue('hp',aBar.get('hp') - 10);
    aBar.setValue('mp',aBar.get('mp') - 5);
}

function fire_ball() {
    aBar.setValue('mp',aBar.get('mp') - 20);
}



const timer = setInterval(function(){ 
    let hp = aBar.get('hp');
    const max_h = aBar.getMax('hp');
    if(hp == max_h) return;
    hp += 1;
    aBar.setValue('hp',hp);

    let mp = aBar.get('mp');
    const max = aBar.getMax('mp');
    if(mp == max) return;
    mp += 1;
    aBar.setValue('mp',mp);
}, 1000);

function draw() {
    document.getElementById("event-list").style.visibility = 'visible';
    eList.showRandomWithoutRepeat();
}