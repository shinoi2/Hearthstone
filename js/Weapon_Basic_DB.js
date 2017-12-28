var Weapon_Basic_DB = {
	0: {
		name: "Light's Justice",
		cost: 1,
		attack: 1,
		durability: 4,
		class: "Paladin"
	},
	1: {
		name: "Truesilver Champion",
		cost: 4,
		attack: 4,
		durability: 2,
		class: "Paladin",
		AttackTrigger: function (list) {
			id = GetId(list[0])[0];
			Restore(Heros[id], Heros[id], 2);
		}
	},
	2: {
		name: "Assassin's Blade",
		cost: 5,
		attack: 3,
		durability: 4,
		class: "Rogue"
	},
	3: {
		name: "Fiery War Axe",
		cost: 3,
		attack: 3,
		durability: 2,
		class: "Warrior"
	},
	4: {
		name: "Arcanite Reaper",
		cost: 5,
		attack: 5,
		durability: 2,
		class: "Warrior"
	}
}