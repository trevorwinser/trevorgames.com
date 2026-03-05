import { set_previous_verb, add_to_inventory, output_text, find_component, current_room, update_enemies } from '../app.js';
import { Item } from '../classes.js';

export function parse_grab(words) {
    words = words.filter((word, i) => !(word === "up" && words[i - 1] === "pick"));

    if (words.length < 2) {
        set_previous_verb(words[0]);
        output_text("What do you want to pick up?");
        return false;
    }

    const item_name = words[1];
    const item = find_component(current_room.components, item_name);

    if (!item) {
        output_text(`I don't see a ${item_name} here.`);
        return false;
    }

    if (!(item instanceof Item)) {
        output_text("You cannot pick that up.");
        return false;
    }

    output_text(`You picked up the ${item_name}.`);
    
    add_to_inventory(item);

    current_room.remove_component(item);

    update_enemies();
    return true;
}
