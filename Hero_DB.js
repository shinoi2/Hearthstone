var Hero_DB = {
	0: {
		name: "Malfurion Stormarage",
		health: 30, 
		class: "Druid", 
		heropower: function() {
			this.name="Shapeshift";
			GainArmor(Hero[playerid], 1);
			Hero[id].attack += 1;
			Hero[id].reflash.push(function(){this.Attack -= 1;})
		}
	},
	1: {
		name: "Rexxar", 
		health: 30, 
		class: "Hunter",
		heropower: function() {
			this.name = "Steady Shoot";
			DealDamage(Hero[1-playerid], Hero[playerid], 2);
		}
	},
	2: {
		name: "Jaina", 
		health: 30, 
		class: "Mage"
		heropower: function() {
			this.name = "Fireblast";
			DealDamage(Choose(), Hero[playerid], 1);
		}
	},
	3: {
		name: "Uther Lightbringer", 
		health: 30, 
		class: "Paladin"
		heropower: function() {
			this.name = "reinforce";
			Summon(new Minions(Minions_ex_DB[0]));
		}
	},
	4: {
		name: "Anduin Wrynn", 
		health: 30, 
		class: "Priest",
		heropower: function() {
			this.name = "lesser heal";
			Restore(Choose(), Hero[playerid], 2);
		}
	},
	5: {
		name: "Valeera Sanguinar", 
		health: 30, 
		class: "Rogue",
		heropower: function() {
			this.name = "dagger mastery";
			EquippingWeapon(new Weapon(Weapon_ex_DB[0]));
		}
	},
	6: {
		name: "Thrall", 
		health: 30, 
		class: "Shaman"
		heropower: function() {
			this.name = "Totemic Call";
			var Base_Totem = new Array([Minions_ex_DB[1], Minions_ex_DB[2], Minions_ex_DB[3], Minions_ex_DB[4]])
			if (Minions[playerid].length == 7){
				return false;
			}
			for (var i=0; i<Minions[playerid].length; i++) {
				for (var j=0; j<Base_Totem.length; j++){
					if (Base_Totem[j] != undefined && i.name == Base_Totem[j].name){
						Base_Totem[j] = undefined;
					}
				}
			}
			var Summmon_Totem = new Array();
			for (var i=0;i<4;i++){
				if (Base_Totem[i] != undefined){
					Summmon_Totem.push(Base_Totem[i])
				}
			}
			if (Summmon_Totem.length == 0){
				return false;
			}
			Summon(new Minions(Summmon_Totem[Math.floor(Math.random()*Summmon_Totem.length)]));
		}
	},
	7: {
		name: "Gul\'dan", 
		health: 30, 
		class: "Warlock",
		heropower: function() {
			this.name = "Life Tap";
			Drawcard();
			DealDamage(Hero[playerid], 2);
		}
	},
	8: {
		name: "Garrosh Hellscream", 
		health: 30, 
		class: "Warrior",
		heropower: function() {
			this.name = "Armor Up!";
			GainArmor(Hero[playerid], 2);
		}
	},
}
