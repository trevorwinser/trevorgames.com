import { set_previous_verb, output_text, find_component, current_room, inventory, remove_from_inventory, update_enemies } from '../app.js';

export function parse_drop(words) {
    if (words.length < 2) {
        set_previous_verb(words[0]);
        output_text("What do you want to drop?");
        return false;
    }

    const item_name = words[1];
    const item = find_component(inventory, item_name);

    if (!item) {
        output_text(`You do not possess ${item_name}.`);
        return false;
    }

    if (words.length > 2) {
        output_text(`I only understood you as far as drop ${item_name.toLowerCase()}.`);
        return false;
    }

    output_text(`You dropped the ${item_name.toLowerCase()}.`);

    remove_from_inventory(item);

    current_room.add_component(item);
    
    update_enemies();
    return true;
}
