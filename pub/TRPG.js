// TRPG.JS
// Created by Echo Yuwen Zheng  2021
// GitHub: echoztoronto
// Email: ywzhengtoronto@gmail.com

"use strict";

(function(window) { 
        
    const default_img_path = "img/default.jpg";

    //  ------------------------------- Attribute Panel  ------------------------------
    class AttributePanel {
        attributes = {};       //  {name: value}      *required
        description = {};      //  {name: description}
        showDescription = true;
        showDescriptionWhenHoverOn = "name";  //"name", "value", "both"
        colorChange = false;
        colorChangeTime = 3;      
        colorChangeColor = "red";
        nameColor = "black";
        valueColor = "black";
        nameTextAlign = "left";
        valueTextAlign = "left";

        timers = {};
        nameColorList = {};        //  {name: nameColor}
        valueColorList = {};       //  {name: valueColor}
        nameMaxWidth = 0;
        valueMaxWidth = 0;

        constructor(ID, modules) {
            // setting up the modules
            this.ID = ID;
            for (const module in modules) {
                this[module] = modules[module];
            }
            this.container = document.getElementById(this.ID);
            this.container.classList.add("TRPG-aPanel-container");
            // description div
            this.description_div = document.createElement("div");
            this.description_div.className = "TRPG-description-container";
            this.description_div.id = this.ID + "-description-container";
            this.description_div.style.visibility = "hidden";
            this.description_div.innerHTML = ' ';
            this.container.appendChild(this.description_div);
            // DOM
            this.update();
        }

        get(attr) {
            return this.attributes[attr];
        }

        set(attr, value) {
            const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
            this.attributes[attr] = value;
            // DOM
            if(document.getElementById(dest_ID) != null) {
                document.getElementById(dest_ID+"-value").innerHTML = value;
            } else this.addDOM(attr);
            // color
            if(this.colorChange) {
                _stop_timeout(this.timers[attr]);
                let original_color = this.valueColor;
                if(this.valueColorList[attr] != undefined) original_color = this.valueColorList[attr];
                this.timers[attr] = this.timers[attr] = _timed_color_change(dest_ID + "-value", original_color, this.colorChangeColor, this.colorChangeTime);
            }       
        }

        setNameColor(attr, color) {
            if(this.attributes[attr] == undefined) return;
            this.nameColorList[attr] = color;
            this.update();
        }

        setValueColor(attr, color) {
            if(this.attributes[attr] == undefined) return;
            this.valueColorList[attr] = color;
            this.update();
        }

        setDescription(attr, description){
            if(this.attributes[attr] == undefined) return;
            this.description[attr] = description;
            this.update();
        }

        delete(attr) {
            if(this.attributes[attr] == undefined) return;
            else {
                // DOM
                const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
                if(document.getElementById(dest_ID) != null) {
                    document.getElementById(dest_ID).remove();
                }
                delete this.attributes[attr];
            }
        }

        update() {
            for (const attr in this.attributes) {
                const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
                if(document.getElementById(dest_ID) != null) {
                    document.getElementById(dest_ID).remove();
                }
                this.addDOM(attr);
            }
            _change_class_css("TRPG-aPanel-attr-name","color", this.nameColor);
            _change_class_css("TRPG-aPanel-attr-value","color", this.valueColor);
            this.nameMaxWidth = _make_all_same_width("TRPG-aPanel-attr-name");
            this.nameMaxWidth = _make_all_same_width("TRPG-aPanel-attr-value");
            _change_class_css("TRPG-aPanel-attr-name","text-align", this.nameTextAlign);
            _change_class_css("TRPG-aPanel-attr-value","text-align", this.valueTextAlign);
            // name color and value color
            for (const attr in this.nameColorList) {
                if(attr == 0) return;
                const dest_ID = this.ID + "-" + _replace_space_with_dash(attr) + "-name";
                if(document.getElementById(dest_ID) == undefined) return;
                document.getElementById(dest_ID).style.color = this.nameColorList[attr];
            }
            for (const attr in this.valueColorList) {
                if(attr == 0) return;
                const dest_ID = this.ID + "-" + _replace_space_with_dash(attr) + "-value";
                if(document.getElementById(dest_ID) == undefined) return;
                document.getElementById(dest_ID).style.color = this.valueColorList[attr];
            }
        }

        addDOM(attr) {
            const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
            let attr_div = document.createElement("div");
            this.container.appendChild(attr_div);
            attr_div.className = "TRPG-aPanel-attr";
            attr_div.id = dest_ID;
            attr_div.innerHTML = `  <div class='TRPG-aPanel-attr-name' id='${dest_ID}-name'> <b>${attr}</b> </div> 
                                    <div class='TRPG-aPanel-attr-value' id='${dest_ID}-value'> ${this.attributes[attr]} </div>`;
            this.nameMaxWidth = _make_all_same_width("TRPG-aPanel-attr-name");
            this.nameMaxWidth = _make_all_same_width("TRPG-aPanel-attr-value");
            _change_class_css("TRPG-aPanel-attr-name","text-align", this.nameTextAlign);
            _change_class_css("TRPG-aPanel-attr-value","text-align", this.valueTextAlign);
            if(this.showDescription) {
                let showDescriptionOnWhich = '';
                switch(this.showDescriptionWhenHoverOn) {
                    case 'name':
                        showDescriptionOnWhich = dest_ID + '-name';
                        break;
                    case 'value':
                        showDescriptionOnWhich = dest_ID + '-value';
                        break;
                    case 'both':
                        showDescriptionOnWhich = dest_ID;
                        break;
                    default:
                        showDescriptionOnWhich = dest_ID + '-name';
                }
                const name_element = document.getElementById(showDescriptionOnWhich);
                const description_element = this.description_div;
                const desction_list = this.description;
                const overall_position = getComputedStyle(this.container).position;
                name_element.addEventListener("mouseover", function(){
                    if(desction_list[attr] == undefined) description_element.innerHTML = `<i>&#60;no description></i>`;
                    else description_element.innerHTML = `${desction_list[attr]}`;
                    _set_element_to_bottom_right_of_another_element(description_element, document.getElementById(dest_ID + '-value'), overall_position);
                    description_element.style.visibility = "visible";
                });
                name_element.addEventListener("mouseout", function(){
                    description_element.style.visibility = "hidden";
                });
            }
        }
    }


    //  ------------------------------- Attribute Bar  ------------------------------
    class AttributeBars {
        attributes = {};      //  {name: value}      *required
        attributesMax = {};   //  {name: maxValue}   *required
        barColor = {};        //  {name: barColor}   *required
        labelColors = {};     //  {name: labelColor}
        description = {};     //  {name: description}
        showDescription = true;
        descriptionPosition = "center";  // "left", "center", "right"
        colorChange = false;
        colorChangeTime = 3;      
        colorChangeColor = "red";
        containerColor = 'rgb(216, 216, 216)';
        labelColor = 'black';
        showLabel = true;
        labelPosition = "center";   //or "left", "right"
        labelStyle = "value/max";   //or "value", "%"
        allowExceedMax = false;

        timers = {};

        constructor(ID, modules) {  // modules = {name: [value, maxValue, barColor]}
            // setting up the modules
            this.ID = ID;
            for (const module in modules) {
                if(module == "preset_attributes") {
                    for (const attr in modules[module]) {
                        this.attributes[attr] = modules[module][attr][0];
                        this.attributesMax[attr] = modules[module][attr][1];
                        this.barColor[attr] = modules[module][attr][2];
                    }
                } 
                else if (module == "attributesMax"||module =="barColor"||module =="labelColors") {
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
            // description div
            this.description_div = document.createElement("div");
            this.description_div.className = "TRPG-description-container";
            this.description_div.id = this.ID + "-description-container";
            this.description_div.style.visibility = "hidden";
            this.description_div.innerHTML = ' ';
            this.container.appendChild(this.description_div);
            // DOM
            this.update();
        }

        get(attr) {
            return this.attributes[attr];
        }

        getMax(attr) {
            return this.attributesMax[attr];
        }

        set(attr, value, maxValue, barColor) {
            const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
            this.attributes[attr] = value;
            this.attributesMax[attr] = maxValue;
            this.barColor[attr] = barColor;
            // DOM
            if(document.getElementById(dest_ID) != null) {
                this.setLabelByStyle(attr); 
                const bar_element = document.getElementById(dest_ID+"-bar");
                const a_value = this.attributes[attr];
                const a_max = this.attributesMax[attr];
                bar_element.style.width = (_lock_to_max(false,a_value, a_max)/a_max)*100  + "%";
                bar_element.style.backgroundColor = this.barColor[attr];
            } else this.addDOM(attr);
            // color
            if(this.colorChange) {
                _stop_timeout(this.timers[attr]);
                let original_color = this.labelColor;
                if(this.labelColors[attr] != undefined) original_color = this.labelColors[attr];
                this.timers[attr] = _timed_color_change(dest_ID + "-value",original_color, this.colorChangeColor, this.colorChangeTime);
            }
        }

        setValue(attr, value) {
            const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
            this.attributes[attr] = value;
            // DOM
            if(document.getElementById(dest_ID) != null) {
                this.setLabelByStyle(attr);
                const bar_element = document.getElementById(dest_ID+"-bar");
                const a_value = this.attributes[attr];
                const a_max = this.attributesMax[attr];
                bar_element.style.width = (_lock_to_max(false,a_value, a_max)/a_max)*100  + "%";
                // color
                if(this.colorChange) {
                    _stop_timeout(this.timers[attr]);
                    let original_color = this.labelColor;
                    if(this.labelColors[attr] != undefined) original_color = this.labelColors[attr];
                    this.timers[attr] = _timed_color_change(dest_ID + "-value", original_color, this.colorChangeColor, this.colorChangeTime);
                }  
            }  
        }
        
        setMaxValue(attr, maxValue) {
            const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
            this.attributesMax[attr] = maxValue;
            // DOM
            if(document.getElementById(dest_ID) != null) {
                this.setLabelByStyle(attr);
                const bar_element = document.getElementById(dest_ID+"-bar");
                const a_value = this.attributes[attr];
                const a_max = this.attributesMax[attr];
                bar_element.style.width = (_lock_to_max(false,a_value, a_max)/a_max)*100  + "%";
                // color
                if(this.colorChange) {
                    _stop_timeout(this.timers[attr]);
                    let original_color = this.labelColor;
                    if(this.labelColors[attr] != undefined) original_color = this.labelColors[attr];
                    this.timers[attr] = _timed_color_change(dest_ID + "-value", original_color, this.colorChangeColor, this.colorChangeTime);
                }  
            }  
        }

        setBarColor(attr, color) {
            const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
            this.barColor[attr] = color;
            // DOM
            if(document.getElementById(dest_ID) != null) {
                document.getElementById(dest_ID+"-bar").style.backgroundColor = this.barColor[attr];
            } 
        }

        setLabelColor(attr, color) {
            const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
            if(document.getElementById(dest_ID) != null) {
                this.labelColors[attr] = color;
                const value_element = document.getElementById(dest_ID + "-value");
                value_element.style.color = this.labelColors[attr];
            }
        }

        setDescription(attr, description){
            if(this.attributes[attr] == undefined) return;
            this.description[attr] = description;
            this.update();
        }

        delete(attr) {
            if(this.attributes[attr] == undefined) return;
            else {
                // DOM
                const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
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
            const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
            const a_value = this.attributes[attr];
            const a_max = this.attributesMax[attr];
            if(document.getElementById(dest_ID) != null) {
                document.getElementById(dest_ID).remove();
            }
            let attr_div = document.createElement("div");
            this.container.appendChild(attr_div);
            attr_div.className = "TRPG-aBar-attr";
            attr_div.id = dest_ID;
            attr_div.innerHTML = `  <div class='TRPG-aBar-attr-name' id='${dest_ID}-name'> ${attr} </div> 
                                    <div class='TRPG-aBar-attr-bar-container' style='background: ${this.containerColor}' > 
                                        <div class='TRPG-aBar-attr-bar'>  
                                            <div class='TRPG-aBar-attr-bar-content' id='${dest_ID}-bar'>  </div>
                                        </div>
                                        <div class='TRPG-aBar-attr-value' id='${dest_ID}-value'>   </div> 
                                    </div>`;
            const bar_element = document.getElementById(dest_ID + "-bar");
            bar_element.style.width = (_lock_to_max(false,a_value, a_max)/a_max)*100  + "%";
            bar_element.style.backgroundColor = this.barColor[attr];
            const value_element = document.getElementById(dest_ID + "-value");
            // label
            this.setLabelByStyle(attr); 
            if(this.showLabel) {
                value_element.style.visibility = "visible";
            } else {
                value_element.style.visibility = "hidden";
            }
            // description
            if(this.showDescription) {
                const name_element = document.getElementById(dest_ID)
                const description_element = this.description_div;
                const description_list = this.description;
                const description_position = this.descriptionPosition;
                const overall_position = getComputedStyle(this.container).position;
                name_element.addEventListener("mouseover", function(){
                    if(description_list[attr] == undefined) description_element.innerHTML = `<i>&#60;no description></i>`;
                    else description_element.innerHTML = `${description_list[attr]}`;
                    switch(description_position) {
                        case "left":
                            _set_element_to_bottom_left_of_another_element(description_element, name_element, overall_position);
                            break;
                        case "center":
                            _set_element_to_bottom_center_of_another_element(description_element, name_element, overall_position);
                            break;
                        case "right":
                            _set_element_to_bottom_right_of_another_element(description_element, name_element, overall_position);
                            break;
                        default:
                            _set_element_to_bottom_center_of_another_element(description_element, name_element, overall_position);
                    }
                    description_element.style.visibility = "visible";
                });
                name_element.addEventListener("mouseout", function(){
                    description_element.style.visibility = "hidden";
                });
            }
        }

        setLabelByStyle(attr) {
            const dest_ID = this.ID + "-" + _replace_space_with_dash(attr);
            let element = document.getElementById(dest_ID + "-value");
            let a_value = this.attributes[attr]; 
            let a_max = this.attributesMax[attr]; 
            let actual_value = _lock_to_max(this.allowExceedMax,a_value, a_max);

            if(this.labelColors[attr] != undefined) {
                element.style.color = this.labelColors[attr];
            }   else  element.style.color = this.labelColor;
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

        constructor (ID, modules) {  
            // setting up the modules
            this.ID = ID;
            for (const module in modules) {
                    this[module] = modules[module];
            }
            this.container = document.getElementById(this.ID);
            this.container.classList.add("TRPG-inventory-container");
            // DOM
            this.update();
        }

        getQuantity(item) {
            return this.quantity[item];
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
            if(this.quantity[item] == undefined) return;
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
            if(this.menuOption.length != 0) {
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
                    const overall_position = getComputedStyle(this.container).position;
                    // left click event - show options
                    if(this.showOnclickMenu){
                        cell_element.addEventListener("click",function(event){
                            menu.style.visibility = "hidden";
                            _move_element_to_mouse_postion(event, menu, overall_position);
                            menu.style.visibility = "visible";
                            menu.setAttribute("data-item", item);
                        });
                    }
                    // hover event - show name/description 
                    cell_element.addEventListener("mouseover",function(){
                        cell_element.style.cursor = "pointer";
                        if(menu.style.visibility == 'visible') {
                            info.style.visibility = "hidden";
                            name_element.style.visibility = 'hidden';
                            description_element.style.visibility = 'hidden';
                            return;
                        }
                        _set_element_to_bottom_right_of_another_element(info, cell_element, overall_position);
                        info.setAttribute("data-item", item);
                        if(display_name) {
                            name_element.innerHTML = item;
                            name_element.style.visibility = 'visible';
                        } 
                        if(display_description) {
                            description_element.style.visibility = 'visible';
                            if(description == undefined) {
                                description_element.innerHTML = `&#60;no description>`;
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
            _change_class_css("TRPG-inventory-cell", "width", this.itemSize + 'px');
            _change_class_css("TRPG-inventory-cell", "height", this.itemSize + 'px');

            // quantity style
            _change_class_css('TRPG-inventory-quantity', 'font-size', this.quantityFontSize + 'px');
            this.set_quantity_position();
            if(this.showQuantity) _change_class_css('TRPG-inventory-quantity', 'visibility', 'visible');
            else _change_class_css('TRPG-inventory-quantity', 'visibility', 'hidden');

            // option style
            _change_class_css('TRPG-inventory-option', 'font-size', this.optionFontSize + 'px');

        }

        set_quantity_position() {
            _change_class_css('TRPG-inventory-quantity', 'text-align', this.quantityXPosition);
            let offset = this.quantityFontSize;
            switch(this.quantityYPosition) {
                case "top":
                    _change_class_css('TRPG-inventory-quantity', 'padding-top', '0px');
                    break;
                case "center":
                    _change_class_css('TRPG-inventory-quantity', 'padding-top', 'calc(50% - ' + offset/2 + 'px)');
                    break;
                case "bottom":
                    _change_class_css('TRPG-inventory-quantity', 'padding-top', 'calc(85% - ' + offset + 'px)');
                    break;
                default:
                    _change_class_css('TRPG-inventory-quantity', 'padding-top', 'calc(80% - ' + offset + 'px)');
            }
        }

    }


    //  ------------------------------- EventList  ------------------------------
    class EventList {
        events = {};              // {name: [options]}       
        eventDescription = {};    // {name: description}
        options = {};             // {name: onclick_function}
        optionDescription = {};   // {name: description}

        constructor(ID, modules) {
            // setting up the modules
            this.ID = ID;
            for (const module in modules) {
                    this[module] = modules[module];
            }
            this.container = document.getElementById(this.ID);
            this.container.classList.add("TRPG-eventlist-container");
            // descriptionid
            const description_container = document.createElement("div");
            description_container.id = this.ID + "-description";
            description_container.classList.add("TRPG-eventlist-description");
            this.container.appendChild(description_container);
            // DOM
            this.current_event = Object.keys(this.events)[0];
            this.show(this.current_event);
        }

        setEvent(name, options, description) {
            this.events[name] = options;
            if(description != '' && description != null) {
                this.eventDescription[name] = description;
            }
            this.show(name);
            this.current_event = name;
        }

        setOption(name, click, description) {
            this.options[name] = click;
            if(description != '' && description != null) {
                this.optionDescription[name] = description;
            }
            this.show(this.current_event);
        }

        deleteEvent(name) {
            if(this.events[name] != null) delete this.events[name];
            if(this.current_event == name) this.show(Object.keys(this.events)[0]);
            else this.show(this.current_event);
        }

        addEventOption(name, option) {
            if(this.events[name].includes(option)) return;
            this.events[name].push(option);
            this.show(this.current_event);
        }

        deleteEventOption(name, option) {
            const index = this.events[name].indexOf(option);
            if (index > -1) {
                this.events[name].splice(index, 1);
            }
            this.show(this.current_event);
        }

        setOptionOnclick(op, click) {
            this.options[op] = click;
            this.show(this.current_event);
        }

        setOptionDescription(op, description) {
            this.optionDescription[op] = description;
            this.show(this.current_event);
        }

        show(event_name) {
            this.container.setAttribute("data-event-name", event_name);
            this.current_event = event_name;
            // description 
            const description_container = document.getElementById(this.ID + "-description");
            if(this.eventDescription[event_name] == undefined) {
                description_container.innerHTML = `<b>${event_name}</b>`;
            } else description_container.innerHTML = `<b>${this.eventDescription[event_name]}</b>`;

            // options
            // remove old ones
            const previous = document.getElementById(this.ID + "-options");
            if(previous != null) previous.remove();
            // don't add if there is no option
            if(this.events[event_name] == undefined || this.events[event_name] == []) return;
            // add new container
            const options_container = document.createElement("div");
            options_container.id = this.ID + "-options";
            options_container.classList.add("TRPG-eventlist-options");
            this.container.appendChild(options_container);
            // add new options
            for(let i=0; i<this.events[event_name].length; i++) {
                const option_name = this.events[event_name][i];
                const option_btn = document.createElement("div");
                option_btn.id = this.ID + "-options-" + i;
                option_btn.classList.add("TRPG-eventlist-option");
                if(this.optionDescription[option_name] == undefined) {
                    option_btn.innerHTML = option_name;
                }  else option_btn.innerHTML = this.optionDescription[option_name];
                options_container.appendChild(option_btn);
                // onclick functions
                const onclick_f = this.options[option_name];
                const main_container = this.container;
                if(onclick_f != undefined) {
                    option_btn.addEventListener("click",function(){
                        onclick_f(main_container.getAttribute('data-event-name'));
                    });
                }
            }
        }

        showRandom() {
            const random_event = _random_inside_object(this.events);
            this.show(random_event);
            this.current_event = random_event;
        }

        showRandomWithoutRepeat() {
            let random_event = this.current_event;
            while(random_event == this.current_event) {
                random_event = _random_inside_object(this.events);
            }
            this.show(random_event);
            this.current_event = random_event;
        }
    }


    //  ------------------------------- Skill Panel  ------------------------------
    class SkillPanel {
        skills = [];              // [skill names]      
        icon = {};                // {name: image path}
        description = {};         // {name: description}
        onclick = {};             // {name: click function}
        cooldown = {};            // {name: cooldown}
        disabled = {};            // {name: true/false}
        iconSize = 80;
        showDescription = true;
        timerColor = "black";
        descriptionPosition = "bottom";

        skill_index = {};

        constructor(ID, modules) {
            // setting up the modules
            this.ID = ID;
            for (const module in modules) {
                    this[module] = modules[module];
            }
            this.container = document.getElementById(this.ID);
            this.container.classList.add("TRPG-spanel-container");

            // description div
            this.description_div = document.createElement("div");
            this.description_div.className = "TRPG-spanel-description-container";
            this.description_div.id = this.ID + "-description-container";
            this.description_div.style.visibility = "hidden";
            this.description_div.innerHTML = ' ';
            this.container.appendChild(this.description_div);

            this.update();
        }

        setSkill(name, description, cd, img, click) {
            if(!this.skills.includes(name)) this.skills.push(name);
            this.description[name] = description;
            this.cooldown[name] = cd;
            this.icon[name] = img;
            this.onclick[name] = click;   
            this.update();
        }

        addSkill(name) {
            if(!this.skills.includes(name)) {
                this.skills.push(name);
                this.update();
            }
        }

        deleteSkill(name) {
            const index = this.skills.indexOf(name);
            if (index > -1) {
                this.skills.splice(index, 1);
            }
            this.update();
        }

        enableSkill(name) {
            if(this.disabled[name] == false) return;
            this.disabled[name] == false;
            const i = this.skill_index[name];
            if(i == undefined) return;
            const icon_element = document.getElementById(`${this.ID}-skill-icon-${i}`);
            icon_element.style.opacity =  '100%';
            const skill_element = document.getElementById(`${this.ID}-skill-${i}`);
            skill_element.style.pointerEvents = 'auto';
        }

        disableSkill(name) {
            this.disabled[name] == true;
            const i = this.skill_index[name];
            if(i == undefined) return;
            const icon_element = document.getElementById(`${this.ID}-skill-icon-${i}`);
            icon_element.style.opacity =  '20%';
            const skill_element = document.getElementById(`${this.ID}-skill-${i}`);
            skill_element.style.pointerEvents = 'none';
        }

        update() {
            // remove old warpper
            const previous = document.getElementById(this.ID + "-skills");
            if(previous != null) previous.remove();
            // don't add if there is no option
            if(this.skills == undefined || this.skills == []) return;
            // add new warpper
            const skills_warpper = document.createElement("div");
            skills_warpper.id = this.ID + "-skills";
            skills_warpper.classList.add("TRPG-spanel-skills");
            this.container.appendChild(skills_warpper);

            this.skill_index = {};
            // add each skill
            for(let i=0; i<this.skills.length; i++) {
                const name = this.skills[i];
                this.skill_index[name] = i;
                const skill_element = document.createElement("div");
                skill_element.id = this.ID + "-skill-" + i;
                skill_element.classList.add("TRPG-spanel-skill");
                skills_warpper.appendChild(skill_element);
                // icon
                let icon_path = this.icon[name];
                if(icon_path == undefined) icon_path = default_img_path;
                skill_element.innerHTML = 
                    `<img class='TRPG-spanel-skill-icon' id='${this.ID}-skill-icon-${i}' src='${icon_path}'>
                    <div class='TRPG-spanel-skill-timer' id='${this.ID}-skill-timer-${i}'> </div> 
                    `;
                const icon_element = document.getElementById(`${this.ID}-skill-icon-${i}`);
                const timer_element = document.getElementById(`${this.ID}-skill-timer-${i}`);
                timer_element.style.visibility = "hidden";
                // onclick function
                const onclick_f = this.onclick[name];
                let cd = this.cooldown[name];
                let actual_cd = this.cooldown[name];
                if(cd == 0 || cd == undefined) cd = 0.1;
                if(actual_cd == undefined) actual_cd = 0;
                if(onclick_f != undefined && this.disabled[name] != true) {
                    skill_element.addEventListener("click",function(){
                        onclick_f();
                        icon_element.style.opacity =  '20%';
                        skill_element.style.pointerEvents = 'none';
                        // timer
                        timer_element.style.visibility = "visible";
                        timer_element.style.opacity =  '100%';
                        let passed_time = 1;
                        if(actual_cd != 0 && actual_cd != undefined) {
                            timer_element.innerHTML = actual_cd;
                            let timer = setInterval(function() {
                                let remain_time = Number(actual_cd) - Number(passed_time);
                                timer_element.innerHTML = remain_time;
                                if (remain_time <= 0) {
                                  clearInterval(timer);
                                  timer_element.style.visibility = "hidden";
                                }
                                passed_time += 1;
                              }, 1000);
                        }
                        window.setTimeout(function() {
                            icon_element.style.opacity =  '100%';
                            skill_element.style.pointerEvents = 'auto';
                            timer_element.style.visibility = "hidden";
                        } , Number(cd) * 1000);
                    });
                }
                // disable
                if(this.disabled[name] == true) {
                    icon_element.style.opacity =  '20%';
                    skill_element.style.pointerEvents = 'none';
                }

                // description
                if(this.showDescription) {
                    const description_element = this.description_div;
                    const overall_position = getComputedStyle(this.container).position;
                    const d_position = this.descriptionPosition;
                    let description  = this.description[name];
                    skill_element.addEventListener("mouseover", function(){
                        if(description == undefined) description = ``;
                        description_element.innerHTML = 
                            `
                                <div class="TRPG-spanel-description-name">${name}  </div>
                                <div class="TRPG-spanel-description-text"> ${description}</div>
                                <div class="TRPG-spanel-description-cd">cooldown: ${actual_cd} sec</div>
                            `;
                            if(d_position == 'top') _set_element_to_top_of_another_element(description_element, skill_element, overall_position);
                            else _set_element_to_bottom_center_of_another_element(description_element, skill_element, overall_position);
                        description_element.style.visibility = "visible";
                    });
                    skill_element.addEventListener("mouseout", function(){
                        description_element.style.visibility = "hidden";
                    });
                }
            }

            // style
            _change_class_css("TRPG-spanel-skill", "width", this.iconSize + 'px');
            _change_class_css("TRPG-spanel-skill", "height", this.iconSize + 'px');
            _change_class_css("TRPG-spanel-skill-timer", "font-size", (Number(this.iconSize)-20) + 'px');
            _change_class_css("TRPG-spanel-skill-timer", "margin-top", (5-Number(this.iconSize)) + 'px');
            _change_class_css("TRPG-spanel-skill-timer", "color", this.timerColor);
        }
    }


    //  ------------------------------- Wrapping  -------------------------------
    window.AttributePanel = window.AttributePanel || AttributePanel;
    window.AttributeBars = window.AttributeBars || AttributeBars;
    window.Inventory = window.Inventory || Inventory;
    window.EventList = window.EventList || EventList;
    window.SkillPanel = window.SkillPanel || SkillPanel;

    //  ------------------------------- Helper Functions  ------------------------------
    function _timed_color_change(ID, original, dest, sec) {
        const element = document.getElementById(ID);
        let timer = 0;
        element.style.color = dest;
        if (sec != "inf") {
            timer = setTimeout(function(){ 
                element.style.color = original;
            }, 1000*sec);
        }
        return timer;
    }

    function _stop_timeout(timer) {
        if (timer) {
            clearTimeout(timer);
            timer = 0;
        }
    }

    function _change_class_css(className, cssName, value) {
        const all = document.getElementsByClassName(className);
        for (let i = 0; i < all.length; i++) {
            all[i].style[cssName] = value;
        }
    }

    function _make_all_same_width(className) {
        let max_width = 0;
        const all = document.getElementsByClassName(className);
        for (let i = 0; i < all.length; i++) {
            if(all[i].clientWidth > max_width) {
                max_width = all[i].clientWidth;
            }
        }
        for (let i = 0; i < all.length; i++) {
            all[i].style.width = max_width + 'px';
        }
        return max_width;
    }

    function _replace_space_with_dash(str) {
        return str.replace(/\s+/g, '-').toLowerCase();
    }

    function _lock_to_max(allowExceedMax, value, max) {
        if(!allowExceedMax && value > max) {
            return max;
        }
        return value;
    }

    function _move_element_to_mouse_postion(event, div, position) {
        const x = event.clientX;    
        const y = event.clientY; 
        div.style.left = window.scrollX + x + 'px';
        div.style.top  = window.scrollY + y + 'px';
        if(position == 'fixed' || position == 'absolute') div.style.position = 'fixed';
    }

    function _set_element_to_bottom_right_of_another_element(front, back, position) {
        const rect = back.getBoundingClientRect();
        front.style.left = window.scrollX + rect.right - 5  + 'px';
        front.style.top =  window.scrollY + rect.bottom - 5 + 'px';
        if(position == 'fixed' || position == 'absolute') front.style.position = 'fixed';
    }

    function _set_element_to_bottom_center_of_another_element(front, back, position) {
        const rect = back.getBoundingClientRect();
        front.style.left = window.scrollX + (rect.left + rect.right)/2  + 'px';
        front.style.top =  window.scrollY + rect.bottom - 5 + 'px';
        if(position == 'fixed' || position == 'absolute') front.style.position = 'fixed';
    }

    function _set_element_to_bottom_left_of_another_element(front, back, position) {
        const rect = back.getBoundingClientRect();
        front.style.left = window.scrollX + rect.left - 5  + 'px';
        front.style.top =  window.scrollY + rect.bottom - 5 + 'px';
        if(position == 'fixed' || position == 'absolute') front.style.position = 'fixed';
    }

    function _set_element_to_top_of_another_element(front, back, position) {
        const rect = back.getBoundingClientRect();
        const rect2 = front.getBoundingClientRect();
        front.style.left = window.scrollX + (rect.left+rect.right)/2 - 5  + 'px';
        front.style.top =  window.scrollY + rect.top - rect2.height - 5 + 'px';
        if(position == 'fixed' || position == 'absolute') front.style.position = 'fixed';
    }

    function _random_inside_object(obj) {
        let keys = Object.keys(obj);
        return keys[keys.length * Math.random() << 0];
    };

})(window);