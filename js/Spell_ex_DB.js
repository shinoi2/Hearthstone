var Spell_ex_DB = {
	0: {
		name: "Excess Mana",
		cost: 0,
		effect: function (tar, src) {
			Drawcard(GetId(src)[0]);
		}
	},
	1: {
		name : "The coin",
		cost : 0,
		class : "Druid",
		effect : function (tar, src) {
			var id = GetId(src)[0];
			Mana[id] += 1;
			if (Mana[id]>10) Mana[id] = 10;
		}		
	}
}