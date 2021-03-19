

//  ------------------------------- Attribute Panel  ------------------------------
class AttributePanel {
    attributes = {};       //  {name: value}      *required
    colorChange = false;
    colorChangeTime = 3;      
    colorChangeColor = "red";
    nameColor = "black";
    valueColor = "black";

    constructor(ID, modules) {
        // setting up the modules
        this.ID = ID;
        for (const module in modules) {
            if(module == "attributes") {
                for (const attr in modules["attributes"]) {
                    this.attributes[attr] = modules["attributes"][attr];
                }
            }
            else {
                this[module] = modules[module];
            }
        }
        this.container = document.getElementById(this.ID);
        this.container.classList.add("TRPG-aPanel-container");
        // DOM
        this.update();
    }

    set(attr, value) {
        const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
        this.attributes[attr] = value;
        // DOM
        if(document.getElementById(dest_ID) != null) {
            document.getElementById(dest_ID+"-value").innerHTML = value;
        } else this.addDOM(attr);
        // color
        if(this.colorChange) {
            timed_color_change(dest_ID + "-value", this.colorChangeColor, this.colorChangeTime);
        }       
    }

    delete(attr) {
        if(this.attributes[attr] == undefined) {
            console.log("Delete error: Cannot find attribute " + attr);
        }
        else {
            // DOM
            const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
            if(document.getElementById(dest_ID) != null) {
                document.getElementById(dest_ID).remove();
            }
            delete this.attributes[attr];
        }
    }

    update() {
        for (const attr in this.attributes) {
            const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
            if(document.getElementById(dest_ID) != null) {
                document.getElementById(dest_ID).remove();
            }
            this.addDOM(attr);
        }
        change_class_css("TRPG-aPanel-attr-name","color", this.nameColor);
        change_class_css("TRPG-aPanel-attr-value","color", this.valueColor);
    }

    addDOM(attr) {
        const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
        let attr_div = document.createElement("div");
        this.container.appendChild(attr_div);
        attr_div.className = "TRPG-aPanel-attr";
        attr_div.id = dest_ID;
        attr_div.innerHTML = `  <span class='TRPG-aPanel-attr-name'> ${attr}: </span> 
                                <span class='TRPG-aPanel-attr-value' id='${dest_ID}-value'> ${this.attributes[attr]} </span>`;
    }

    //for debug
    print() {
        console.log(this);
    }
}


//  ------------------------------- Attribute Bar  ------------------------------

class AttributeBars {
    attributes = {};      //  {name: value}      *required
    attributesMax = {};   //  {name: maxValue}   *required
    barColor = {};        //  {name: barColor}   *required
    labelColor = {};      //  {name: labelColor}
    
    colorChange = false;
    colorChangeTime = 3;      
    colorChangeColor = "red";
    containerColor = 'rgb(216, 216, 216)';
    showLabel = true;
    labelPosition = "center";   //or "left", "right"
    labelStyle = "value/max";   //or "value", "%"
    allowExceedMax = false;

    constructor(ID, modules) {  // modules = {name: [value, maxValue, barColor]}
        // setting up the modules
        this.ID = ID;
        for (const module in modules) {
            if(module == "attributes") {
                for (const attr in modules["attributes"]) {
                    this.attributes[attr] = modules["attributes"][attr][0];
                    this.attributesMax[attr] = modules["attributes"][attr][1];
                    this.barColor[attr] = modules["attributes"][attr][2];
                }
            } 
            else if (module == "attributesMax"||module =="barColor"||module =="labelColor") {
                for (const attr in modules[module]) {
                    this[module][attr] = modules[module][attr];
                }
            }
            else {
                this[module] = modules[module];
            }
        }
        this.container = document.getElementById(this.ID);
        this.container.classList.add("TRPG-aBar-container");
        // DOM
        this.update();
    }

    set(attr, value, maxValue, barColor) {
        const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
        this.attributes[attr] = value;
        this.attributesMax[attr] = maxValue;
        this.barColor[attr] = barColor;
        // DOM
        if(document.getElementById(dest_ID) != null) {
            this.setLabelByStyle(attr); 
            const bar_element = document.getElementById(dest_ID+"-bar");
            const a_value = this.attributes[attr];
            const a_max = this.attributesMax[attr];
            bar_element.style.width = (lock_to_max(false,a_value, a_max)/a_max)*100  + "%";
            bar_element.style.backgroundColor = this.barColor[attr];
        } else this.addDOM(attr);
        // color
        if(this.colorChange) {
            timed_color_change(dest_ID + "-value", this.colorChangeColor, this.colorChangeTime);
        }
    }

    setValue(attr, value) {
        const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
        this.attributes[attr] = value;
        // DOM
        if(document.getElementById(dest_ID) != null) {
            this.setLabelByStyle(attr);
            const bar_element = document.getElementById(dest_ID+"-bar");
            const a_value = this.attributes[attr];
            const a_max = this.attributesMax[attr];
            bar_element.style.width = (lock_to_max(false,a_value, a_max)/a_max)*100  + "%";
            // color
            if(this.colorChange) {
                timed_color_change(dest_ID + "-value", this.colorChangeColor, this.colorChangeTime);
            }  
        }  else console.log("SetValue error: Cannot find attribute " + attr);
    }
    
    setMaxValue(attr, maxValue) {
        const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
        this.attributesMax[attr] = maxValue;
        // DOM
        if(document.getElementById(dest_ID) != null) {
            this.setLabelByStyle(attr);
            const bar_element = document.getElementById(dest_ID+"-bar");
            const a_value = this.attributes[attr];
            const a_max = this.attributesMax[attr];
            bar_element.style.width = (lock_to_max(false,a_value, a_max)/a_max)*100  + "%";
            // color
            if(this.colorChange) {
                timed_color_change(dest_ID + "-value", this.colorChangeColor, this.colorChangeTime);
            }  
        }  else console.log("SetMaxValue error: Cannot find attribute " + attr);  
    }

    setBarColor(attr, color) {
        const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
        this.barColor[attr] = color;
        // DOM
        if(document.getElementById(dest_ID) != null) {
            document.getElementById(dest_ID+"-bar").style.backgroundColor = this.barColor[attr];
        }  else console.log("SetBarColor error: Cannot find attribute " + attr);
    }

    setLabelColor(attr, color) {
        const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
        if(document.getElementById(dest_ID) != null) {
            this.labelColor[attr] = color;
            const value_element = document.getElementById(dest_ID + "-value");
            value_element.style.color = this.labelColor[attr];
        } else console.log("SetLabelColor error: Cannot find attribute " + attr);
    }

    delete(attr) {
        if(this.attributes[attr] == undefined) {
            console.log("Delete error: Cannot find attribute " + attr);
        }
        else {
            // DOM
            const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
            if(document.getElementById(dest_ID) != null) {
                document.getElementById(dest_ID).remove();
            }
            delete this.attributes[attr];
        }
    }

    update() {
        for (const attr in this.attributes) {   
            this.addDOM(attr);
        }
    }

    addDOM(attr) {
        const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
        const a_value = this.attributes[attr];
        const a_max = this.attributesMax[attr];
        if(document.getElementById(dest_ID) != null) {
            document.getElementById(dest_ID).remove();
        }
        let attr_div = document.createElement("div");
        this.container.appendChild(attr_div);
        attr_div.className = "TRPG-aBar-attr";
        attr_div.id = dest_ID;
        attr_div.innerHTML = `  <div class='TRPG-aBar-attr-name'> ${attr} </div> 
                                <div class='TRPG-aBar-attr-bar-container' style='background: ${this.containerColor}' > 
                                    <div class='TRPG-aBar-attr-bar'>  
                                        <div class='TRPG-aBar-attr-bar-content' id='${dest_ID}-bar'>  </div>
                                    </div>
                                    <div class='TRPG-aBar-attr-value' id='${dest_ID}-value'>   </div> 
                                </div>`;
        const bar_element = document.getElementById(dest_ID + "-bar");
        bar_element.style.width = (lock_to_max(false,a_value, a_max)/a_max)*100  + "%";
        bar_element.style.backgroundColor = this.barColor[attr];
        const value_element = document.getElementById(dest_ID + "-value");
        this.setLabelByStyle(attr); 
        if(this.showLabel) {
            value_element.style.visibility = "visible";
        } else {
            value_element.style.visibility = "hidden";
        }
    }

    setLabelByStyle(attr) {
        const dest_ID = this.ID + "-" + replace_space_with_dash(attr);
        let element = document.getElementById(dest_ID + "-value");
        let a_value = this.attributes[attr]; 
        let a_max = this.attributesMax[attr]; 
        let actual_value = lock_to_max(this.allowExceedMax,a_value, a_max);

        if(this.labelColor[attr] != undefined) {
            element.style.color = this.labelColor[attr];
        }   
        element.style.textAlign = this.labelPosition;

        switch(this.labelStyle) {
            case "value/max":
                element.innerHTML = `${actual_value} / ${a_max}`;
                break;
            case "%":
                element.innerHTML = ((actual_value/a_max)*100).toFixed(2)  + "%";
                break;
            case "value":
                element.innerHTML = `${actual_value}`;
                break;
            default:
                element.innerHTML = `${actual_value} / ${a_max}`;
        }
    }

    //for debug
    print() {
        console.log(this);
    }

}


//  ------------------------------- Inventory  ------------------------------

class Inventory {
    quantity = {};    // {name: quantity}      *required
    description = {};  // {name: description}
    image = {};        // {name: path}
    
    numRow = 5;
    numColumn = 5;
    showDescription = true;
    showQuantity = true;
    showOnclickMenu = true;
    onclickMenuOption = []; 


    constructor (ID, modules) {  // modules = {name: {description: x, image: x, ...} }
        // setting up the modules
        this.ID = ID;
        for (const module in modules) {
            if (module in ["quantity","description","image"]) {
                for (const attr in attrs) {
                    this[module][attr] = modules[module][attr];
                }
            }
            else {
                this[module] = modules[module];
            }
        }
        this.container = document.getElementById(this.ID);
        this.container.classList.add("TRPG-inventory-container");
        // DOM
        this.update();
    }

}





//  ------------------------------- Helper Functions  ------------------------------
function timed_color_change(ID, color, sec) {
    const element = document.getElementById(ID);
    const original_color = element.style.color;
    element.style.color = color;
    if (sec != "inf") {
        setTimeout(function(){ 
            element.style.color = original_color;
        }, 1000*sec);
    }
}


function change_class_css(className, cssName, value) {
    const all = document.getElementsByClassName(className);
    for (let i = 0; i < all.length; i++) {
        all[i].style[cssName] = value;
    }
}

function replace_space_with_dash(str) {
    return str.replace(/\s+/g, '-').toLowerCase();
}

function lock_to_max(allowExceedMax, value, max) {
    if(!allowExceedMax && value > max) {
        return max;
    }
    return value;
}