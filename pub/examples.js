

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

