

const aPanel = new AttributePanel('attribute-panel', {
                                attributes : {
                                    hp: 1000,
                                    mp: 500
                                  },
                                colorChange : true,
                                colorChangeTime: 2,  // "inf" for change it forever
                                });




const aBar = new AttributeBars('attribute-bar', {
                                attributes : {  //{name: [value, maxValue, barColor]}
                                    hp: [1000,2000,'pink'],
                                    mp: [500,800,'rgb(155, 198, 255)']
                                  },
                                colorChange : true,
                                colorChangeTime: 2,
                                colorChangeColor : "blue",
                                labelColor: {
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
    showName: true,
    showDescription: true,
    onclickMenuOption: ['use','destroy', 'gift'] 
});
