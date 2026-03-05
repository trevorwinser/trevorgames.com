import { set_previous_verb, output_text, audio } from '../app.js';

export function parse_start(words) { 
    const [action, target, subAction] = words;

    if (words.length === 1) {
        set_previous_verb("start");
        output_text(`What would you like to ${action}?`);
    } else if (words.length === 2) {
        if (["sound", "music"].includes(target) && audio != null) {
            output_text("Music has started.");
            audio.play();
        } else if (target === "mirenalt") {
            output_text("You are already playing that game!");
        } else {
            output_text(`I only understood you as far as ${action}.`);
        }
    } else if (words.length === 3) {
        if (target === "mirenalt" && subAction === "nudgeon") {
            output_text("You are already playing that game!");
        } else {
            output_text(`I only understood you as far as ${action} ${target === "mirenalt" ? "mirenalt" : ""}.`);
        }
    } else {
        output_text("I only understood you as far as play.");
    }
}
