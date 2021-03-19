
const default_img_path = "img/default.jpg";



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
    quantity = {};     // {name: quantity}      *required
    description = {};  // {name: description}
    image = {};        // {name: path}
    
    numRow = 5;
    numColumn = 5;
    showName = true;
    showDescription = true;
    showQuantity = true;
    showOnclickMenu = true;
    menuOption = []; 
    menuOptionOnclick = {};
    optionFontSize = 20;
    itemSize = 50;
    quantityFontSize = 18;
    quantityXPosition = 'right';  // left, center, right
    quantityYPosition = 'bottom';  // top, center, bottm

    index = {};   // {name: cell number}   for develop only
    validItemCount = 0;

    constructor (ID, modules) {  // modules = {name: {description: x, image: x, ...} }
        // setting up the modules
        this.ID = ID;
        for (const module in modules) {
            if (module=="quantity"||module=="description"||module=="image"||module=="menuOptionOnclick") {
                for (const item in modules[module]) {
                    this[module][item] = modules[module][item];
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

    set(item, quantity, description, img){
        this.quantity[item] = quantity;
        this.description[item] = description;
        this.image[item] = img;
        this.update();
    }

    setQuantity(item, quantity) {
        this.quantity[item] = quantity;
        this.update();
    }

    setDescription(item, description){
        if(this.quantity[item] == undefined) this.quantity[item] = 0;
        this.description[item] = description;
        this.update();
    }

    setImage(item, img){
        if(this.quantity[item] == undefined) this.quantity[item] = 0;
        this.image[item] = img;
        this.update();
    }

    addItem(item, quantity) {
        let need_update = false;
        if(this.quantity[item] == undefined) this.quantity[item] = 0;
        if(this.quantity[item] == 0)  need_update = true;
        this.quantity[item] += quantity;
        if(need_update) {
            this.validItemCount ++;
            this.index[item] = this.validItemCount;
            this.update();
        }
        // DOM 
        const quantity_id = this.ID + '-quantity-' + this.index[item];
        const quantity_element = document.getElementById(quantity_id);
        quantity_element.innerHTML = this.quantity[item];
    }

    removeItem(item, quantity) {
        if(this.quantity[item] == undefined) {
            console.log("undefined quantity");
            return;
        }
        this.quantity[item] -= quantity;
        // we don't support negative quantity
        if(this.quantity[item] < 0) this.quantity[item] = 0;
        // DOM 
        if(this.quantity[item] == 0) {
            const i = this.index[item];
            for(const item_name in this.index) {
                if(this.index[item_name] > i) {
                    this.index[item] -= 1;
                }
            }
            this.index[item] = 0;
            this.update();
            return;
        }
        const quantity_id = this.ID + '-quantity-' + this.index[item];
        const quantity_element = document.getElementById(quantity_id);
        quantity_element.innerHTML = this.quantity[item];
    }

    clearItem(item) {
        delete this.quantity[item];
        const i = this.index[item];
        for(const item_name in this.index) {
            if(this.index[item_name] > i) {
                this.index[item] -= 1;
            }
        }
        this.index[item] = 0;
        this.update();
    }

    setOption(op) {
        this.menuOption = op;
        this.update();
    }

    addOption(op){
        let repeated = false;
        for(let i = 0; i < this.menuOption.length; i++) {
            if(this.menuOption[i] == op) repeated = true;
        }
        if(!repeated) this.menuOption.push(op);
        this.update();
    }

    addOptionClick(op, func) {
        this.menuOptionOnclick[op] = func;
        this.update();
    }

    removeOptionClick(op) {
        this.menuOptionOnclick[op] = undefined;
        this.update();
    }

    update() {
        // delete exist table object
        if(document.getElementById(this.ID + "-table") != null) {
            document.getElementById(this.ID + "-table").remove();
        }

        // create table object 
        const table = document.createElement("table");
        table.classList.add("TRPG-inventory-table");
        table.id = this.ID + "-table";
        this.container.appendChild(table);
        
        // add tr based on numRow 
        let item_count = 1;
        this.validItemCount = 0;
        for(let row_count = 1; row_count < this.numRow+1; row_count++) {
            const row = document.createElement("tr");
            row.classList.add("TRPG-inventory-row");
            table.appendChild(row);
            // add th based on numColumn
            for(let col_count = 1; col_count < this.numColumn+1; col_count++) {
                const cell = document.createElement("th");
                cell.classList.add("TRPG-inventory-cell");
                cell.id = this.ID + '-' + item_count;
                row.appendChild(cell);
                item_count++;
            }
        }

        // add left click menu
        const menu = document.createElement("div");
        menu.classList.add("TRPG-inventory-option-menu");
        menu.id = this.ID + "-option-menu";
        menu.style.visibility = 'hidden';
        this.container.appendChild(menu);
        if(this.menuOption.length == 0) {
            console.log("menuOption is empty!");
        } else {
            let option_count = 1;
            for(let i = 0; i < this.menuOption.length; i++){
                const op_text = this.menuOption[i];
                const op = document.createElement("div");
                const onclick_f = this.menuOptionOnclick[op_text];
                op.classList.add("TRPG-inventory-option");
                op.id = this.ID + "-option-" + option_count;
                op.setAttribute("data-option", op_text);
                op.innerHTML = op_text;
                menu.appendChild(op);
                op.addEventListener("click",function(){
                    menu.setAttribute("data-option-clicked", op_text);
                    // add option onclick function
                    if(onclick_f != undefined) {
                        onclick_f(menu.getAttribute('data-item'));
                    }
                });
            }
        }

        // add hover window for name and description
        const info = document.createElement("div");
        info.classList.add("TRPG-inventory-info");
        info.id = this.ID + "-info";
        info.style.visibility = 'hidden';
        this.container.appendChild(info);
        // item name
        const name_element = document.createElement("div");
        if(this.showName) {
            name_element.classList.add("TRPG-inventory-item-name");
            info.appendChild(name_element);
            name_element.style.visibility = 'hidden';
        } 
        // item descrition
        const description_element = document.createElement("div");
        if(this.showDescription) {
            description_element.classList.add("TRPG-inventory-item-description");
            info.appendChild(description_element);
            description_element.style.visibility = 'hidden';
        }
        
        // add items and update index
        item_count = 1;
        let valid_cell_id = [];
        for (const item in this.quantity) {
            if(this.quantity[item] > 0) {
                this.index[item] = item_count;
                this.validItemCount++;
                //cell content
                let image_path = this.image[item];
                const description = this.description[item];
                const display_name = this.showName;
                const display_description = this.showDescription;
                if(image_path == undefined) image_path = default_img_path;
                const cell_element = document.getElementById(this.ID + '-' + item_count);
                cell_element.innerHTML = 
                    `<div class='TRPG-inventory-cell-container'> 
                        <img src='${image_path}' id='${this.ID}-img-${item_count}'>
                        <div class='TRPG-inventory-quantity' id='${this.ID}-quantity-${item_count}'> ${this.quantity[item]} </div>
                    </div>`;
                valid_cell_id.push(cell_element);
                // left click event - show options
                if(this.showOnclickMenu){
                    cell_element.addEventListener("click",function(event){
                        menu.style.visibility = "hidden";
                        move_element_to_mouse_postion(event, menu);
                        menu.style.visibility = "visible";
                        menu.setAttribute("data-item", item);
                    });
                }
                // hover event - show name/description 
                cell_element.addEventListener("mouseover",function(){
                    if(menu.style.visibility == 'visible') {
                        info.style.visibility = "hidden";
                        name_element.style.visibility = 'hidden';
                        description_element.style.visibility = 'hidden';
                        return;
                    }
                    set_element_to_bottom_right_of_another_element(info, cell_element);
                    info.setAttribute("data-item", item);
                    if(display_name) {
                        name_element.innerHTML = item;
                        name_element.style.visibility = 'visible';
                    } 
                    if(display_description) {
                        description_element.style.visibility = 'visible';
                        if(description == undefined) {
                            description_element.innerHTML = `no description for this item`;
                        } else description_element.innerHTML = description;
                    } 
                    if(!display_name && !display_description) {
                        info.style.visibility = "hidden";
                    } else info.style.visibility = "visible";
                });

                item_count ++;
            }
        }

        // remove click event
        document.addEventListener('click', function(event){
            if(info.style.visibility == 'visible') {
                info.style.visibility = "hidden";
                name_element.style.visibility = 'hidden';
                description_element.style.visibility = 'hidden';
            }
            let should_hide = true;
            for(let i =0; i < valid_cell_id.length; i++) {
                if(valid_cell_id[i].contains(event.target)) should_hide = false;
            }
            if(should_hide) menu.style.visibility = 'hidden';
        });
        document.addEventListener('mousemove', function(){
            if(menu.style.visibility == 'visible') {
                info.style.visibility = "hidden";
                name_element.style.visibility = 'hidden';
                description_element.style.visibility = 'hidden';
            }
        });

        // cell width and height 
        change_class_css("TRPG-inventory-cell", "width", this.itemSize + 'px');
        change_class_css("TRPG-inventory-cell", "height", this.itemSize + 'px');

        // quantity style
        change_class_css('TRPG-inventory-quantity', 'font-size', this.quantityFontSize + 'px');
        this.set_quantity_position();
        if(this.showQuantity) change_class_css('TRPG-inventory-quantity', 'visibility', 'visible');
        else change_class_css('TRPG-inventory-quantity', 'visibility', 'hidden');

        // option style
        change_class_css('TRPG-inventory-option', 'font-size', this.optionFontSize + 'px');

    }

    set_quantity_position() {
        change_class_css('TRPG-inventory-quantity', 'text-align', this.quantityXPosition);
        let offset = this.quantityFontSize;
        switch(this.quantityYPosition) {
            case "top":
                change_class_css('TRPG-inventory-quantity', 'padding-top', '0px');
                break;
            case "center":
                change_class_css('TRPG-inventory-quantity', 'padding-top', 'calc(50% - ' + offset/2 + 'px)');
                break;
            case "bottom":
                change_class_css('TRPG-inventory-quantity', 'padding-top', 'calc(85% - ' + offset + 'px)');
                break;
            default:
                change_class_css('TRPG-inventory-quantity', 'padding-top', 'calc(80% - ' + offset + 'px)');
        }
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

function move_element_to_mouse_postion(event, div) {
    const x = event.clientX;    
    const y = event.clientY; 
    div.style.left = window.scrollX + x + 'px';
    div.style.top  = window.scrollY + y + 'px';
}

function set_element_to_bottom_right_of_another_element(front, back) {
    const rect = back.getBoundingClientRect();
    front.style.left = window.scrollX + rect.right - 5  + 'px';
    front.style.top =  window.scrollY + rect.bottom - 5 + 'px';
}