import { has_enemies, output_text, set_previous_verb, find_component, set_block } from '../app.js';

export function parse_block(words) {
    if (has_enemies()) {
        if (words.length == 1) {
            output_text("What do you want to block with?");
            set_previous_verb("block");
        } else if (words.length == 2) {
            let item = find_component(inventory, words[1]);
            if (item != null) {
                if (item instanceof Weapon) {
                    set_block(item.block);
                    update_enemies();
                    return true;
                } else {
                    output_text("You cannot block with that.");
                }
            } else {
                output_text("You do not have that!");
            }
        } else {
            if (words[1] == "with") {
                words.splice(1,1);
                parse_block(words);
            } else {
                output_text("I only understood you as far as block.");
            }
        }
    } else {
        output_text("There are no enemies to block!");
    }
}