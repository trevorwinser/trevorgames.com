import { dictionary } from './app.js'

export class Room {
    location;
    description = "";
    components = [];
    dict = dictionary;
    connected_rooms = [];
    directions = []; // corresponds to the direction of connected rooms.
    entered = false;
    
    constructor(location) {
        this.location = location;
    }
    remove_component(component) {
        this.components.splice(this.components.indexOf(component), 1);
    }
    add_component(component) {
        if (component instanceof Component) {
            this.components.push(component);
        }
    }
}

export class CustomRoom extends Room {
    conditions = [];
    f;
    
    constructor(location, f, conditions) {
        super(location);
        this.f = f;
        this.conditions = conditions;
    }

    check_action(words) {
        for (let i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i]) {
                this.f[i](this);
            }
        }
    }
}

export class Component {
    name = null;
    names = [];
    description;
    
    constructor(names) {
        if (typeof names === 'string') {
            this.name = names;
            this.names[0] = names;
        } else {
            this.name = names[0];
            this.names = names;
        }
    }
}

export class Enemy extends Component {
    health = 1;
    defense = 0;
    strength = 0;
    attack_time = 9999999;
    turns_interacted = 0;
    dialogue;
    escapable = true;
    type = "hostile";
    
    constructor(names, health, defense, strength, attack_time, type) {
        super(names);
        this.health = health;
        this.defense = defense;
        this.strength = strength;
        this.attack_time = attack_time;
        this.type = type;
    }
}

export class NPC extends Component {
    dialogue = [];
    
    constructor(names, dialogue) {
        super(names);
        this.dialogue = dialogue;
    }
}

export class Item extends Component {
    constructor(names) {
        super(names);
    }
}

export class CustomItem extends Item {
    id = null;
    
    constructor(names, id) {
        super(names);
        this.id = id;
    }
}

export class Consumable extends Item {
    health = 0;
    type = "eat";
    
    constructor(names, health) {
        super(names);
        this.health = health;
    }
}

export class Weapon extends Item {
    damage = 0;
    block = 0;
    
    constructor(names, damage, block) {
        super(names);
        this.damage = damage;
        this.block = block;
    }
}
