var Minions_ex_DB = {
	0: {
		name: "Silver Hand Recruit",
		attack: 1,
		health: 1,
		cost: 1,
	},
	1: {
		name: "Healing Totem",
		attack: 0,
		health: 2,
		cost: 1,
		type: ["Totem"],
		YourEndTurnTrigger:[
			function(obj){
				var id;
				if (Minions[0].indexOf(obj) != -1) id=0; else id=1;
				for (var i=0;i<Minions[id].length;i++){
					Restore(Minions[id][i], obj, 1);
				}
			}
		]
	},
	2: {
		name: "Searing Totem",
		attack: 1,
		health: 1,
		cost: 1,
		type: ["Totem"],
	},
	3: {
		name: "Stoneclaw Totem",
		attack: 0,
		health: 2,
		cost: 1,
		type: ["Totem"],
		effect: ["Taunt"]
	},
	4: {
		name: "Water Of Air Totem",
		attack: 0,
		health: 2,
		cost: 1,
		type: ["Totem"],
		OngoingEffect: ["Spell Damage +1"]
	},
	5: {
		name: "Spellbender",
		attack: 1,
		health: 3,
		cost: 1,
		rarity: "Epic",
	},
}