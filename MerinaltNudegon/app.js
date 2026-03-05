import { Room, CustomRoom, Component, Enemy, NPC, Item, CustomItem, Consumable, Weapon } from './classes.js';
import { parse_start } from './actions/start.js';
import { parse_stop } from './actions/stop.js';
import { parse_attack } from './actions/attack.js';
import { parse_grab } from './actions/grab.js';
import { parse_drop } from './actions/drop.js';
import { initialize_rooms } from './init.js';

export var current_room = null;
export function set_current_room(room) {
    current_room = room;
}
export var inventory = [];
export function add_to_inventory(item) {
    inventory.push(item);
}

export function remove_from_inventory(item) {
    const index = inventory.indexOf(item);
    if (index > -1) {
        inventory.splice(index, 1);
    }
}
var previous_verb = null;
export function set_previous_verb(verb) {
    previous_verb = verb;
}
var previous_component = null;
export function set_previous_component(component) {
    previous_component = component;
}
export var dictionary = ["fight","attack","hit","swing","slash","slash","stab","punch","dodge","look","grab","pick","drop","inventory","wait","help","info","stop","start","play","eat","drink","consume","block"];
var movement_dictionary = ["go","walk","run","travel","head","move","north","northeast","east","southeast","south","southwest","west","northwest","climb","jump"];
dictionary = dictionary.concat(movement_dictionary);
var health = 10;
var defense = 1;
var block = 0;
export function set_block(amount) {
    block = amount;
}
var luck = 1;
var dodge = false;
var dodge_cooldown = 0;
var actions_performed = [];
var playlist = ["audio/start.mp3","audio/victory.mp3","audio/kingdom.mp3","audio/boss.mp3"];
var playlist_index = 0;
export var audio = null;
var music_played = false;



function separate_command(sentence) {
    sentence = sentence.toLowerCase();
    const words = sentence.split(" ");
    return words;
}

function parse(words) {
    if (words[0] == 'a') words.splice(0,1);
    if (previous_component != null) {
        words.splice(0, 0, previous_component.toLowerCase());
        previous_component = null;
    }
    if (previous_verb != null) {
        words.splice(0, 0, previous_verb);
        previous_verb = null;
    }
    
    check_syntax(words);
}

function check_syntax(words) {
    let verb = words[0];
    if (check_verb(verb)) {
        if (!actions_performed.includes(verb)) actions_performed.push(verb);
        if (movement_dictionary.includes(verb)) {
            if (room_escapable()) {
                if (handle_movement(words)) {
                    if (current_room instanceof CustomRoom) {
                        current_room.check_action(words);
                    }
                }
            }
        } else {
            if (handle_action(words)) {
                if (current_room instanceof CustomRoom) {
                    current_room.check_action(words);
                }
            }

        }
    }
}

function check_verb(verb) { 
    if (dictionary.includes(verb)) {
        if (current_room.dict.includes(verb)) {
            return true;
        }
        output_text("You cannot do that here.");
        return false;
    }
    if (verb != "") {
        output_text("I do not recognize the verb \"" + verb + "\"");
    }
    return false;
}

function handle_movement(words) {
    switch (words[0]) {
        case 'go':
            return parse_move(words);
        case 'walk':
            return parse_move(words);
        case 'run':
            return parse_move(words);
        case 'travel':
            return parse_move(words);
        case 'head':
            return parse_move(words);
        case 'move':
            return parse_move(words);
        case 'north':
            return parse_move(words);
        case 'northeast':
            return parse_move(words);
        case 'east':
            return parse_move(words);
        case 'southeast':
            return parse_move(words);
        case 'south':
            return parse_move(words);
        case 'southwest':
            return parse_move(words);
        case 'west':
            return parse_move(words);
        case 'northwest':
            return parse_move(words);
        case 'climb':
            return parse_climb(words);
        case 'jump':
            return parse_jump(words);
        default:
            output_text("That's not a valid direction.");    //SHOULD NOT HAPPEN.
    }
    return false;
}

function parse_move(words) {
    if (words.length == 1) {
        if (words[0] == "go" || words[0] == "walk" || words[0] == "run" || words[0] == "travel" || words[0] == "head" || words[0] == "move") {
            output_text("Which direction do you want to go?");
            previous_verb = "go";
        } else {
            return handle_direction(words[0]);
        }
    } else if (words.length == 2) {
        if (words[0] == "go" || words[0] == "walk" || words[0] == "run" || words[0] == "travel" || words[0] == "head" || words[0] == "move") {
            return handle_direction(words[1]);
        } else {
            output_text("I only understood you as far as " + words[0] + ".");
        }
    }
    return false;
}

function parse_climb(words) {
    if (words.length == 1) {
        return handle_direction("up");  //Defaults climb to go up
    } else {
        if (words[1] == 'up' || words[1] == 'down') {
            if (words.length > 2) {
                output_text("I only understood you as far as climb " + words[1] + ".");
            }
            else {
                return handle_direction(words[1]);
            }
        } else {
            output_text("I only understood you as far as climb.");
        }
    } 
    return false;
}

function parse_jump(words) {
    if (words.length == 1) {
        if (handle_direction("down")) {
            output_text("Wheeeeee!");
            return true;
        }
    } else if (words.length == 2) {
        if (words[1] == "down") {
            if (handle_direction("down")) {
                output_text("Wheeeeee!");
                return true;
            }
        } else {
            output_text("I only understood you as far as jump.");
        }
    } else {
        output_text("I only understood you as far as jump.");
    }
    return false;
}

function handle_direction(direction) {
    if(!current_room.directions.some(dir => {
        if (dir == direction) {
            let index = current_room.directions.indexOf(direction);
            change_room(index); return true;
        }
        })) {
            output_text("You cannot go that direction.");
            return false;
        }
}

function change_room(index) {
    current_room = current_room.connected_rooms[index];
    output_text(" ");
    output_text(current_room.location);
    if (!current_room.entered) {
        output_text(current_room.description);
        current_room.entered = true;
    }
    for (let component of current_room.components) {
        output_text(component.description);
    }
    top_right_element.textContent = current_room.location;
}

function room_escapable() {
    for (let component of current_room.components) {
        if (component instanceof Enemy) {
            if (!component.escapable) {
                output_text("You cannot run away!");
                return false;
            }
        }
    }
    return true;
}

export function update_enemies() {
    for (let enemy of current_room.components) {
        if (enemy instanceof Enemy) {
            enemy.turns_interacted++;
            // console.log("Attack Time:" + enemy.attack_time);
            // console.log("Turns Interacted: " + enemy.turns_interacted);
            if (enemy.attack_time - enemy.turns_interacted == 1) {
                output_text("The " + get_name(enemy) + " is preparing its attack.");
            }
            if (enemy.turns_interacted >= enemy.attack_time && enemy.attack_time != -1) {   //-1 represents an enemy that does not attack. Too lazy to do a different way for now.
                attack_player(enemy);
                enemy.turns_interacted = 0;
                
            }
        }
    }
    dodge_cooldown--;
    dodge = false;  //Disables dodge after attack process finishes to ensure dodge lasts for only one turn
}

//Don't forget to update_enemies after each successful command (if necessary).
function handle_action(words) {
    let verb = words[0];
    switch (verb) {
        case 'fight':
            parse_attack(words);
            break;
        case 'attack':
            parse_attack(words);
            break;
        case 'hit':
            parse_attack(words);
            break;
        case 'slash':
            parse_attack(words);
            break;
        case 'slice':
            parse_attack(words);
            break;
        case 'stab':
            parse_attack(words);
            break;
        case 'swing':
            parse_attack(words);
            break;
        case 'punch':
            parse_attack(words);
            break;
        case 'dodge':
            parse_dodge(words);
            break;
        case 'look':
            parse_look(words);
            break;
        case 'grab':
            return parse_grab(words);
        case 'pick':
            return parse_grab(words);
        case 'drop':
            return parse_drop(words);
        case 'wait':
            return parse_wait(words);
        case 'inventory':
            parse_inventory(words);
            break;
        case 'help':
            parse_help(words);
            break;
        case 'info':
            parse_info(words);
            break;
        case 'stop':
            parse_stop(words);
            break;
        case 'start':
            parse_start(words);
            break;
        case 'play':
            parse_start(words);
            break;
        case 'eat':
            return parse_consume(words);
        case 'consume':
            return parse_consume(words);
        case 'drink':
            return parse_consume(words);
        case 'block':
            parse_block(words);
            break;
        default:
            console.log("Something went wrong. Verb not processed.");
            break;
    }
    return false;
}


 
function parse_look(words) {
    if (words.length > 1) {
        if (words[1] == "around") {
            words.splice(1,1);
            parse_look(words);
        } else {
            output_text("I only understood you as far as look.");
        }
    } else {
        output_text(current_room.location);
        output_text(current_room.description);
        for (let component of current_room.components) {
            output_text(component.description);
        }
    }
}

function parse_dodge(words) {
    if (words.length > 1) {
        output_text("I only understood you as far as dodge.");
    } else {
        if (dodge_cooldown > 0) {
            output_text("You cannot dodge right now.");
        } else {
            let dodge_check = Math.ceil(Math.random() * 10)
            let dodge_value = Math.ceil(Math.random() * 5 + luck);   //Luck affects how likely you are to dodge
            if (dodge_value > dodge_check) {
                dodge = true;
            } else {
                output_text("You failed to dodge!")
            }
            dodge_cooldown = 3;
            update_enemies();
        }
    }
}

function parse_wait(words) {
    if (words.length > 1) {
        output_text("I only understood you as far as wait.");
    } else {
        let result = Math.ceil(Math.random() * 100);
        if (result > 90)
            output_text("Time passes. You ponder your existence and the existence of the universe. You are not sure what to do with yourself.");
        else if (result > 50)
            output_text("You wait. Silently.");
        else
            output_text("Time passes.");
        update_enemies();
    }
}

function parse_inventory(words) {
    if (words.length > 1) {
        output_text("I only understood you as far as wait.");
    } else {
        if (inventory.length == 0) {
            output_text("Your inventory is currently empty.");
        } else {
            for (let i = 0; i < inventory.length; i++) {
                output_text(inventory[i].name);
            }
        }
    }
}



function parse_help(words) {
    if (words.length > 1) {
        output_text("I only understood you as far as help.");
    } else {
        if (!(actions_performed.includes("grab") || actions_performed.includes("pick") )) {
            output_text("Try picking something up.")
        } else if (!(actions_performed.includes("attack") || actions_performed.includes("stab") || actions_performed.includes("hit") || actions_performed.includes("swing") || actions_performed.includes("slash") || actions_performed.includes("fight"))) {
            output_text("You should try attacking something.");
        } else if (!actions_performed.includes("dodge")) {
            output_text("Have you tried dodging? Man it is awesome. It does take some luck, but it is totally worth trying.");
        } else if (!(actions_performed.includes("north") || actions_performed.includes("northeast") || actions_performed.includes("east") || actions_performed.includes("southeast") || actions_performed.includes("south") || actions_performed.includes("southwest") || actions_performed.includes("west") || actions_performed.includes("northwest") || actions_performed.includes("west") || actions_performed.includes("go") || actions_performed.includes("walk") || actions_performed.includes("run") || actions_performed.includes("travel") || actions_performed.includes("head") || actions_performed.includes("move"))) {
            output_text("If you are still having trouble traversing, try using cardinal and ordinal directions.");
        } else {
            output_text("You should try exploring a bit more.");
        }
    }
}

function parse_info(words) {
    if (words.length > 1) {
        output_text("I only understood you as far as info.");
    } else {
        output_text("Mirenalt Nudgeon is a terminal dungeon where the player must learn by playing and win by learning. A wonderful and confusing land awaits you in the world of Merinalt.");
    }
}

function parse_consume(words) {
    if (words.length == 1) {
        output_text("What do you want to consume?");
        previous_verb = "consume";
    } else {
        let food = find_component(inventory, words[1]);
        if (food != null) {
            if (food instanceof Consumable) {
                if (food.type == "eat") {
                    if (words[0] == "drink") {
                        output_text("You cannot drink that.");
                    } else {
                        if (words.length > 2) {
                            output_text("I only understood you as far as " + words[0] + " " + words[1] + ".");
                        } else {
                            update_enemies();
                            return consume(food);
                        }
                    }
                } else {
                    if (words[0] == "eat") {
                        output_text("You cannot eat that.");
                    } else {
                        if (words.length > 2) {
                            output_text("I only understood you as far as " + words[0] + " " + words[1] + ".");
                        } else {
                            update_enemies();
                            return consume(food);
                        }
                    }
                }
            } else {
                output_text("You cannot consume that!");
            }
        } else {
            output_text("You do not have that!");
        }
    }
    return false;
}

export function get_name(component) {
    return (typeof component.names === 'string') ? component.name.toLowerCase() : component.names[0].toLowerCase();
}

function has_enemies() {
    return current_room.components.some((component) => component instanceof Enemy);
}

function consume(item) {
    health += item.health;
    inventory.splice(inventory.indexOf(item),1);
    output_text("You successfully consumed the " + item.name.toLowerCase() + ".");
    if (item.health > 0) {
        output_text("It had a positive effect on your health!");
    } else if (item.health < 0) {
        output_text("It had a negative effect on your health!");
    }
    return true;
}



function attack_player(enemy) {
    if (!dodge) {
        output_text("The " + enemy.name.toLowerCase() + " attacked you!");
        if (block > 0) {
            if (enemy.strength > (block + defense)) {
                health -= enemy.strength;
                output_text("The block was ineffective.");
            } else {
                output_text("The block was successful.");
            }
            block = block + defense - enemy.strength;
        } else {
            if (enemy.strength > defense) {
                health = health + (defense - enemy.strength);
            } else {
                output_text("It had no effect.");
            }
        }
        if (health <= 0) {
            output_text("You died. Game over.");
            var input = document.getElementById("terminal-input");
            if (input) {
                input.remove();
            } else {
                console.log("Element not found.");
            }
        }
    } else {
        output_text("You successfully dodged the attack!");
    }
}

export function find_component(components, name) {
    for (let component of components) {
        if (component.names) {
            if (typeof component.names === 'string') {
                if (component.names.toLowerCase() == name) {
                    return component;
                }
            } else if (Array.isArray(component.names)) {
                for (let component_name of component.names) {
                    if (component_name.toLowerCase() == name) {
                        return component;
                    }
                }
            }
        }
    }
    return null;
}


export function detect_component(components, name) {
    for (let component of components) {
        if (typeof component.names === 'string') {
            if (component.names.toLowerCase() == name) return true;
        } else {
            for (let component_name of component.names) {
                if (component_name.toLowerCase() == name) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function output_text(txt) {
    const p = document.createElement("p");
    p.innerHTML = txt;
    terminal_output.appendChild(p);
    window.scrollTo(0, document.body.scrollHeight);
    terminal_command.value = "";
}


// TODO: Make music room, enemy, and event based. Properly.
function handle_music() {
    music_played = true;
    var song = new Audio(playlist[playlist_index]);
    song.volume = 0.1;
    audio = song;
    play_music(song);
    playlist_index++;
    if (playlist_index > playlist.length-1) playlist_index = 0;
}

function play_music(song) {
    if (music_played) {
        song.play();
        song.addEventListener('ended', handle_music);
        document.removeEventListener('click', handle_music);
    }
}

window.onload = (event) => {
    initialize_rooms();
    output_text(current_room.location);
    output_text(current_room.description);
    for (let component of current_room.components) {
        output_text(component.description);
    }
    current_room.entered = true;
    document.addEventListener('click', handle_music);
}

const terminal_output = document.getElementById("terminal-output");
const terminal_command = document.getElementById("terminal-command");
const top_right_element = document.getElementById("location");

top_right_element.textContent = "Brooke Road";

terminal_command.addEventListener("keydown", e => checkEnter(e));

function checkEnter(k) {
    if (k.keyCode==13) {
        const command = terminal_command.value;
        output_text(command);
        terminal_command.value = "";
        if (command.length > 164) {
            output_text("I am sorry, but that command is too long.")
        } else {
            parse(separate_command(command)); 
        }
    }
}