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




const aBar = new AttributeBars('attribute-bar', {
    attributes : {  
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