import { output_text, audio } from '../app.js';

export function parse_stop(words) {
    const [action, target] = words;

    if (words.length === 1) {
        set_previous_verb("stop");
        output_text("What would you like to stop?");
    } else if (words.length === 2) {
        if (["sound", "music"].includes(target) && audio != null) {
            output_text("Music has stopped.");
            audio.pause();
        } else if (target === "time") {
            output_text("Time has successfully stopped until your next action.");
        } else if (target === "attack") {
            parse_block("block");
        } else {
            output_text(`I only understood you as far as stop ${target}.`);
        }
    } else {
        output_text(`I only understood you as far as stop ${target || ""}.`);
    }
}
