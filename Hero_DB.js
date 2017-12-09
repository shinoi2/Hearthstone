var Hero_DB = {
	0: {
		name: "Malfurion Stormarage",
		health: 30, 
		class: "Druid",
		heropower: function() {
			this.heropowername="Shapeshift";
			GainArmor(Heros[playid], 1);
			this.attack += 1;
			this.reflash.push(function(obj){obj.attack -= 1;})
		}
	},
	1: {
		name: "Rexxar", 
		health: 30, 
		class: "Hunter",
		heropower: function() {
			this.heropowername = "Steady Shoot";
			DealDamage(Heros[1-playid], Heros[playid], 2);
		}
	},
	2: {
		name: "Jaina", 
		health: 30, 
		class: "Mage",
		HeropowerCheck: function(tar){
			if (tar == null) return false;
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) return false;
			if (tar.effect.indexOf("Stealth") != -1) return false;
			return true;
		},
		heropower: function(tar) {
			this.heropowername = "Fireblast";
			DealDamage(tar, Heros[playid], 1);
		}
	},
	3: {
		name: "Uther Lightbringer", 
		health: 30, 
		class: "Paladin",
		heropower: function() {
			this.heropowername = "reinforce";
			Summon(new Minion(Minions_ex_DB[0], "Minions_ex_DB", 0));
		}
	},
	4: {
		name: "Anduin Wrynn", 
		health: 30, 
		class: "Priest",
		HeropowerCheck: function(tar){
			if (tar == null) return false;
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1)
				return false;
			if (tar.effect.indexOf("Stealth") != -1)
				return false;
			return true;
		},
		heropower: function(tar) {
			this.heropowername = "Lesser heal";
			Restore(tar, Heros[playid], 2);
		}
	},
	5: {
		name: "Valeera Sanguinar", 
		health: 30, 
		class: "Rogue",
		heropower: function() {
			this.heropowername = "dagger mastery";
			EquippingWeapon(new Weapon(Weapon_ex_DB[0], "Weapon_ex_DB", 0));
		}
	},
	6: {
		name: "Thrall", 
		health: 30, 
		class: "Shaman",
		HeropowerCheck: function(){
			if (Minions[playid].length == 7) return false;
			var Base_Totem = [1, 2, 3, 4]
			for (var i=0; i<Minions[playid].length; i++) {
				for (var j=0; j<Base_Totem.length; j++){
					if (Minions[playid][i].name == Minions_ex_DB[Base_Totem[j]].name){
						Base_Totem.splice(j,1);
						break;
					}
				}
			}
			if (Base_Totem.length==0) return false;
			return true;
		},
		heropower: function() {
			this.heropowername = "Totemic Call";
			var Base_Totem = [1, 2, 3, 4]
			if (Minions[playid].length == 7){
				return false;
			}
			for (var i=0; i<Minions[playid].length; i++) {
				for (var j=0; j<Base_Totem.length; j++){
					if (Minions[playid][i].name == Minions_ex_DB[Base_Totem[j]].name){
						Base_Totem.splice(j,1);
						break;
					}
				}
			}
			var id = Math.floor(Math.random()*Base_Totem.length);
			Summon(new Minion(Minions_ex_DB[Base_Totem[id]], "Minions_ex_DB", Base_Totem[id]));
		}
	},
	7: {
		name: "Gul\'dan", 
		health: 30, 
		class: "Warlock",
		heropower: function() {
			this.heropowername = "Life Tap";
			Drawcard();
			DealDamage(Heros[playid], Heros[playid], 2);
		}
	},
	8: {
		name: "Garrosh Hellscream", 
		health: 30, 
		class: "Warrior",
		heropower: function() {
			this.heropowername = "Armor Up!";
			GainArmor(Heros[playid], 2);
		}
	},
}
