import { set_current_room } from './app.js';
import { Room, Weapon, Enemy, CustomRoom, Consumable } from './classes.js';

function add_component(room, component) {
    room.components.push(component);
}

/**
* x -> First room |
* y -> Second room |
* xdir -> Direction to y relative to x |
* ydir -> Direction to x relative to y
*/
export function connect_rooms(x, y, xdir, ydir) {
    x.connected_rooms.push(y);
    x.directions.push(xdir)
    y.connected_rooms.push(x);
    y.directions.push(ydir)
}

function remove_room(door_room) {
    const room1 = door_room.connected_rooms[0];
    const room2 = door_room.connected_rooms[1];
    if (room2 !== undefined) {
        room1.connected_rooms[room1.connected_rooms.indexOf(door_room)] = room2;
        room2.connected_rooms[room2.connected_rooms.indexOf(door_room)] = room1;
        change_room(1);
    } else {
        room1.connected_rooms.splice(room1.connected_rooms.indexOf(door_room),1);
        room1.directions.splice(room1.connected_rooms.indexOf(door_room),1);
        change_room(0);
    }
}

export function initialize_rooms() {
    const starter_road_1 = new Room("Brooke Road");
    starter_road_1.description = "The road to the east looks promising, but there's nothing to the west.";
    
    const sword = new Weapon("Sword", 3, 1);
    sword.description = "A steel sword lays on the ground here."
    add_component(starter_road_1, sword);

    const goblin = new Enemy("Goblin", 10, 0, 4, 3, "hostile");
    goblin.description = "A goblin stands in your way.";
    goblin.escapable = false;
    add_component(starter_road_1,goblin);

    set_current_room(starter_road_1);

    const nothing = new Room("Nothing");
    nothing.description = "You see nothing beyond this point. You should probably head back.";
    connect_rooms(starter_road_1, nothing, "west", "east");

    const fork_in_the_road = new Room("Fork in the Road");
    fork_in_the_road.description = "A fork in the road has two trails. One heads northeast, and the other heads east.";
    connect_rooms(fork_in_the_road, starter_road_1, "west", "east");

    const goblin_door = new Room("Goblin Door");
    goblin_door.description = "A large door stands in your way. There is a strange symbol branded across it with a small opening just below it.";
    connect_rooms(fork_in_the_road, goblin_door, "northeast", "southwest");

    const starter_road_2 = new Room("Brooke Road");
    starter_road_2.description = "To the east, vast plains stretch out, and a tree so tall that it is visible from where you stand.";
    connect_rooms(fork_in_the_road, starter_road_2, "east", "west");

    const wild_field_1 = new Room("Wild Fields");
    const wild_field_2 = new Room("Wild Fields");
    const wild_field_3 = new Room("Wild Fields");
    wild_field_3.description = "A trail that leads towards the mountains is northeast from here.";
    const wild_field_4 = new Room("Wild Fields");
    const wild_field_5 = new Room("Wild Fields");
    wild_field_5.description = "This vast meadow goes on for a while. It may be hard to know where you're going from here, so mapping it out might help.";
    const wild_field_6 = new Room("Wild Fields");
    const wild_field_7 = new Room("Wild Fields");
    wild_field_7.description = "The field spreads far in every direction.";
    const wild_field_8 = new Room("Wild Fields");
    const wild_field_9 = new Room("Wild Fields");
    const wild_field_10 = new Room("Wild Fields");
    const wild_field_11 = new Room("Wild Fields");
    const wild_field_12 = new Room("Wild Fields");

    const grand_tree = new Room("Grand Tree");
    grand_tree.description = "The grand tree soars to towering heights, its branches reaching outward, while its mighty trunk radiates a mesmerizing glow.";
    const large_branch = new Room("Large Branch");
    large_branch.description = "This branch is sturdy. From here, you can see the entire field from here. Going up might allow you to see further.";
    connect_rooms(grand_tree, large_branch, "up", "down");

    // Literal psychopath coding.
    // Find a new way, I BEG OF YOU
    const apple_branch = new CustomRoom("Small Branch", [() => output_text("Oh no! The branch broke as you grabbed the apple. You also were a little hurt by the fall."), remove_room, () => health--], [() => words[0] === "grab" || words[0] === "pick", () => conditions[0], () => conditions[0]]);
    apple_branch.description = "You can see a kingdom southwest from here. It seems this branch will break from too much movement.";
    connect_rooms(large_branch, apple_branch, "up", "down");

    const apple = new Consumable("Apple", 3);
    apple.description = "A shimmering apple can be seen.";
    apple_branch.components.push(apple);

    const wild_field_13 = new Room("Wild Fields");
    const wild_field_14 = new Room("Wild Fields");
    const wild_field_15 = new Room("Wild Fields");
    const wild_field_16 = new Room("Wild Fields");
    const wild_field_17 = new Room("Wild Fields");

    const wild_field_18 = new CustomRoom("Wild Fields");
    const TMK = new Enemy(["Knight","Armor"], 10, 5, 5, 2);
    TMK.description = "A knight with seemingly no one inside stands tall and still here.";
    wild_field_18.components.push(TMK);
    
    const wild_field_19 = new Room("Wild Fields");
    const wild_field_20 = new Room("Wild Fields");
    const wild_field_21 = new Room("Wild Fields");

    const beach_1 = new Room("Beach");
    beach_1.description = "This coast consists of various shells and colorful rocks.";
    const beach_2 = new Room("Beach");
    const beach_3 = new Room("Beach");
    const beach_4 = new Room("Beach");
    const beach_5 = new Room("Beach");
    const beach_6 = new Room("Beach");

    const lowestoft_trail_1 = new Room("Lowestoft Trail");
    lowestoft_trail_1.description = "A trail towards the Lowestoft Kingdom spans southwest from here. To the northeast is a vast field.";
    const lowestoft_trail_2 = new Room("Lowestoft Trail");
    lowestoft_trail_2.description = "The Lowestoft Kingdom can be seen directly south from here.";

    connect_rooms(wild_field_1,wild_field_2,"east","west");
    connect_rooms(wild_field_2,wild_field_3,"east","west");
    connect_rooms(wild_field_3,wild_field_4,"east","west");
    connect_rooms(starter_road_2,wild_field_5,"east","west");
    connect_rooms(wild_field_5,wild_field_6,"east","west");
    connect_rooms(wild_field_6,wild_field_7,"east","west");
    connect_rooms(wild_field_7,wild_field_8,"east","west");
    connect_rooms(wild_field_8,wild_field_9,"east","west");
    connect_rooms(wild_field_9,wild_field_10,"east","west");
    connect_rooms(wild_field_10,beach_1,"east","west");
    connect_rooms(wild_field_11,wild_field_12,"east","west");
    connect_rooms(wild_field_12,grand_tree,"east","west");
    connect_rooms(grand_tree,wild_field_13,"east","west");
    connect_rooms(wild_field_13,wild_field_14,"east","west");
    connect_rooms(wild_field_14,beach_2,"east","west");
    connect_rooms(wild_field_15,wild_field_16,"east","west");
    connect_rooms(wild_field_16,wild_field_17,"east","west");
    connect_rooms(wild_field_17,wild_field_18,"east","west");
    connect_rooms(wild_field_18,beach_3,"east","west");
    connect_rooms(wild_field_19,wild_field_20,"east","west");
    connect_rooms(wild_field_20,wild_field_21,"east","west");
    connect_rooms(wild_field_21,beach_4,"east","west");
    connect_rooms(lowestoft_trail_1,beach_5,"east","west");
    connect_rooms(beach_5,beach_6,"east","west");

    connect_rooms(wild_field_1,wild_field_6,"south","north");
    connect_rooms(wild_field_2,wild_field_7,"south","north");
    connect_rooms(wild_field_3,wild_field_8,"south","north");
    connect_rooms(wild_field_4,wild_field_9,"south","north");
    connect_rooms(wild_field_6,wild_field_11,"south","north");
    connect_rooms(wild_field_7,wild_field_12,"south","north");
    connect_rooms(wild_field_8,grand_tree,"south","north");
    connect_rooms(wild_field_9,wild_field_13,"south","north");
    connect_rooms(wild_field_10,wild_field_14,"south","north");
    connect_rooms(beach_1,beach_2,"south","north");
    connect_rooms(wild_field_11,wild_field_15,"south","north");
    connect_rooms(wild_field_12,wild_field_16,"south","north");
    connect_rooms(grand_tree,wild_field_17,"south","north");
    connect_rooms(wild_field_13,wild_field_18,"south","north");
    connect_rooms(wild_field_14,beach_3,"south","north");
    connect_rooms(wild_field_15,wild_field_19,"south","north");
    connect_rooms(wild_field_16,wild_field_20,"south","north");
    connect_rooms(wild_field_17,wild_field_21,"south","north");
    connect_rooms(wild_field_18,beach_4,"south","north");
    connect_rooms(wild_field_19,lowestoft_trail_1,"south","north");
    connect_rooms(wild_field_20,beach_5,"south","north");
    connect_rooms(wild_field_21,beach_6,"south","north");

    connect_rooms(wild_field_1,wild_field_5,"southwest","northeast");
    connect_rooms(wild_field_2,wild_field_6,"southwest","northeast");
    connect_rooms(wild_field_3,wild_field_7,"southwest","northeast");
    connect_rooms(wild_field_4,wild_field_8,"southwest","northeast");
    connect_rooms(wild_field_7,wild_field_11,"southwest","northeast");
    connect_rooms(wild_field_8,wild_field_12,"southwest","northeast");
    connect_rooms(wild_field_9,grand_tree,"southwest","northeast");
    connect_rooms(wild_field_10,wild_field_13,"southwest","northeast");
    connect_rooms(beach_1,wild_field_14,"southwest","northeast");
    connect_rooms(wild_field_12,wild_field_15,"southwest","northeast");
    connect_rooms(grand_tree,wild_field_16,"southwest","northeast");
    connect_rooms(wild_field_13,wild_field_17,"southwest","northeast");
    connect_rooms(wild_field_14,wild_field_18,"southwest","northeast");
    connect_rooms(beach_2,beach_3,"southwest","northeast");
    connect_rooms(wild_field_16,wild_field_19,"southwest","northeast");
    connect_rooms(wild_field_17,wild_field_20,"southwest","northeast");
    connect_rooms(wild_field_18,wild_field_21,"southwest","northeast");
    connect_rooms(wild_field_20,lowestoft_trail_1,"southwest","northeast");
    connect_rooms(wild_field_21,beach_5,"southwest","northeast");
    connect_rooms(beach_4,beach_6,"southwest","northeast");
    connect_rooms(lowestoft_trail_1,lowestoft_trail_2,"southwest","northeast");

    connect_rooms(wild_field_1,wild_field_7,"southeast","northwest");
    connect_rooms(wild_field_2,wild_field_8,"southeast","northwest");
    connect_rooms(wild_field_3,wild_field_9,"southeast","northwest");
    connect_rooms(wild_field_4,wild_field_10,"southeast","northwest");
    connect_rooms(wild_field_5,wild_field_11,"southeast","northwest");
    connect_rooms(wild_field_6,wild_field_12,"southeast","northwest");
    connect_rooms(wild_field_7,grand_tree,"southeast","northwest");
    connect_rooms(wild_field_8,wild_field_13,"southeast","northwest");
    connect_rooms(wild_field_9,wild_field_14,"southeast","northwest");
    connect_rooms(wild_field_10,beach_2,"southeast","northwest");
    connect_rooms(wild_field_11,wild_field_16,"southeast","northwest");
    connect_rooms(wild_field_12,wild_field_17,"southeast","northwest");
    connect_rooms(grand_tree,wild_field_18,"southeast","northwest");
    connect_rooms(wild_field_13,beach_3,"southeast","northwest");
    connect_rooms(wild_field_15,wild_field_20,"southeast","northwest");
    connect_rooms(wild_field_16,wild_field_21,"southeast","northwest");
    connect_rooms(wild_field_17,beach_4,"southeast","northwest");
    connect_rooms(wild_field_19,beach_5,"southeast","northwest");
    connect_rooms(wild_field_20,beach_6,"southeast","northwest");

    const townGate1 = new Room("Gate Entrance");
    townGate1.description = "The gate entrance, adorned with intricate wrought-iron designs, opens to reveal a captivating view of a bustling town square is visible to the southeast.";

    connect_rooms(lowestoft_trail_2, townGate1, "south", "north");

    const townSquare = new Room("Town Square");
    townSquare.description = "The town square displays a large fountain with a statue of an unknown lady. The townsfolk are bustling with joy.";

    connect_rooms(townGate1, townSquare, "southeast", "northwest");
}