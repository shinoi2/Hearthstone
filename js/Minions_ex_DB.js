var Minions_ex_DB = {
	0: {
		name: "Silver Hand Recruit",
		attack: 1,
		health: 1,
		cost: 1,
		class: "Paladin"
	},
	1: {
		name: "Healing Totem",
		attack: 0,
		health: 2,
		cost: 1,
		type: ["Totem"],
		class: "Shaman",
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
		class: "Shaman",
	},
	3: {
		name: "Stoneclaw Totem",
		attack: 0,
		health: 2,
		cost: 1,
		type: ["Totem"],
		effect: ["Taunt"],
		class: "Shaman",
	},
	4: {
		name: "Water Of Air Totem",
		attack: 0,
		health: 2,
		cost: 1,
		type: ["Totem"],
		OngoingEffect: ["Spell Damage +1"],
		class: "Shaman",
	},
	5: {
		name: "Spellbender",
		attack: 1,
		health: 3,
		cost: 1,
		rarity: "Epic",
		class: "Mage"
	},
	6: {
		name: "Murloc Scount",
		attack : 1,
		health : 1,
		cost : 1,
		type : ["Murloc"],
	},
	7: {
		name: "Boar",
		attack : 1,
		health : 1,
		cost : 1,
		type : ["Beast"],
	},
	8: {
		name: "Mechanical Dragonling",
		attack : 2,
		health : 1,
		cost : 1,
		type : ["Mech"]
	},
	9: {
		name: "Huffer",
		attack : 4,
		health : 2,
		cost : 3,
		effect : ["Charge"],
		type: ["Beast"],
		class : "Hunter"
	},
	10: {
		name: "Leokk",
		attack : 2,
		health : 4,
		cost : 3,
		type: ["Beast"],
		class : "Hunter",
		Ongoing : [
			function(src){
				var id=-1;
				if (Minions[0].indexOf(src)!=-1) id = 0;
				if (Minions[1].indexOf(src)!=-1) id = 1;
				for (var i=0;i<Minions[id].length;i++){
					if (Minions[id][i]!=src){
						var OngoingEffect = ["Attack_Ongoing", src, 
							function(obj, effect){
								var src = effect[1];
								var src_id = -1, obj_id = -1;
								if (Minions[0].indexOf(src)!=-1) src_id = 0;
								if (Minions[1].indexOf(src)!=-1) src_id = 1;
								if (Minions[0].indexOf(obj)!=-1) obj_id = 0;
								if (Minions[1].indexOf(obj)!=-1) obj_id = 1;
								if (src.Ongoing.length == 0 || src_id!=obj_id){
									obj.attack-=1;
									obj.effect.splice(obj.effect.indexOf(effect), 1);
								}
							}];
						if (Minions[id][i].effect.indexOf(OngoingEffect)==-1){
							Minions[id][i].effect.push(OngoingEffect);
							Minions[id][i].attack += 1;
						}
					}
				}
			}
		]		
	},
	11: {
		name: "Misha",
		attack: 4,
		health: 4,
		cost: 3,
		class: "Hunter",
		type: ["Beast"],
		effect: ["Taunt"]
	},
	12: {
		name: "Mirror Image",
		cost: 0,
		class: "Mage",
		attack: 0,
		health: 2,
		effect: ["Taunt"]
	},
	13: {
		name: "Sheep",
		cost: 1,
		health: 1,
		attack: 1,
		type: ["Beast"]
	},
	14: {
		name: "Frog",
		cost: 0,
		health: 1,
		attack: 0,
		type: ["Beast"],
		effect: ["Taunt"]
	},

}