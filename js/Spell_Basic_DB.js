 var Spell_Basic_DB = {
	0:{
		name : "Innervate",
		cost : 0,
		class : "Druid",
		effect : function (tar, src) {
			var id = GetId(src)[0];
			Mana[id] += 1;
			if (Mana[id]>10) Mana[id] = 10;
		}
	},
	1:{
		name : "Moonfire",
		cost : 0,
		class : "Druid",
		effect : function (tar, src) {
			var id = GetId(src)[0];
			DealDamage(tar, src, (1 + SpellDamage[id])*Velen[id]);
		},
		check : function (tar, src) {
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	2: {
		name : "Claw",
		cost : 1,
		class : "Druid",
		effect : function(tar, src) {
			GainArmor(Heros[GetId(src)[0]], 1);
			Heros[GetId(src)[0]].attack += 1;
			Heros[GetId(src)[0]].reflash.push(function(obj){obj.attack -= 1;});
		}
	},
	3: {
		name : "Mark of the Wild",
		cost : 2,
		class : "Druid",
		effect : function(tar, src) {
			if (tar==null) return;
			if (tar.Attack_Buff == undefined) tar.Attack_Buff = [];
			if (tar.Health_Buff == undefined) tar.Health_Buff = [];
			if (tar.Buff == undefined) tar.Buff = [];
			var add1 = function(obj) { obj.attack += 2; }
			var remove1 = function(obj){ obj.attack -= 2; }
			var add2 = function(obj) { obj.maxhealth += 2; obj.health += 2; }
			var remove2 = function(obj){ obj.maxhealth -= 2; obj.health = Math.max(obj.health, obj.maxhealth); }
			var add3 = function(obj) { obj.effect.push("Taunt"); }
			var remove3 = function(obj){ obj.effect.splice(obj.indexOf("Taunt"), 1); }
			tar.Attack_Buff.push([src, add1, remove1]);
			tar.Health_Buff.push([src, add2, remove2]);
			tar.Buff.push([src, add3, remove3]);
			add1(tar); add2(tar); add3(tar);
		},
		check : function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	4: {
		name : "Wild Growth",
		cost : 2,
		class : "Druid",
		effect : function(tar, src){
			var id = GetId(src)[0];
			if (MaxMana[id] == 10){
				if (Hands[id].length < 10){
					Hands[id].push(new Spell(Spell_ex_DB[0], "Spell_ex_DB", 0));
				}
			} else
				MaxMana[id] += 1;
		}
	},
	5: {
		name: "Healing Touch",
		cost : 3,
		class : "Druid",
		effect : function(tar, src){
			var id = GetId(src)[0];
			Restore(tar, src,  8*Velen[id]);
		},
		check : function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	6: {
		name : "Savage Roar",
		cost : 3,
		class : "Druid",
		effect : function(tar, src){
			var id = GetId(src)[0];
			Heros[id].attack += 2;
			Heros[id].reflash.push(function(obj){obj.attack -= 2;});
			for (var i=0;i<Minions[id].length;i++){
				var src = Minions[id][i];
				src.attack += 2;
				src.reflash.push(function(obj){obj.attack -= 2;});
			}	
		}
	},
	7: {
		name : "Swipe",
		cost : 4,
		class : "Druid",
		effect : function(tar, src){
			var id = GetId(src)[0], tar_id = GetId(tar)[0];
			DealDamage(tar, src, (4 + SpellDamage[id])*Velen[id]);
			for (var i=0;i<Minions[tar_id].length;i++){
				if (Minions[tar_id][i] != tar)
					DealDamage(Minions[tar_id][i], src, (1 + SpellDamage[id])*Velen[id]);
			}
			if (Heros[tar_id] != tar)
				DealDamage(Heros[tar_id], src, (1 + SpellDamage[id])*Velen[id]);
		},
		check : function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (GetId(tar)[0] == GetId(src)[0]) throw "请选择一个有效的目标";
 			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	8: {
		name : "Starfire",
		cost : 5,
		class : "Druid",
		effect : function(tar, src){
			var id = GetId(src)[0];
			DealDamage(tar, src, (5 + SpellDamage[id])*Velen[id]);
			Drawcard(GetId(src)[0]);
		},
		check : function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	9: {
		name: "Arcana Shot",
		cost: 1,
		class: "Hunter",
		effect: function(tar, src){
			var id = GetId(src)[0];
			DealDamage(tar, src, (2 + SpellDamage[id])*Velen[id]);
		},
		check : function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	10: {
		name: "Hunter\'s Mark",
		cost: 1,
		class: "Hunter",
		effect: function(tar, src){
			tar.Health_Buff = [];
			tar.Health_Aura = [];
			tar.health = 1;
			tar.maxhealth = 1;
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}	
	},
	11: {
		name: "Tracking",
		cost: 1,
		class: "Hunter",
		effect: function(tar, src){
			var id = GetId(src)[0];
			var x = Choose(id, [Deck[id][0], Deck[id][1], Deck[id][2]], 1);
			if (Hands[id].length < 10)
				Hands[id].push(Deck[id][x]);
			else
				Show(Deck[id][x]);
			Deck[id].splice(0,3);
		}
	},
	12:{
		name: "Animal Companion",
		cost: 3,
		class: "Hunter",
		effect: function(tar, src){
			var x = Math.floor(Math.random()*3);
			Summon(new Minion(Minions_ex_DB[9+x], "Minions_ex_DB", 9+x),-1,GetId(src)[0]);
		}
	},
	13:{
		name: "Kill Command",
		cost: 3,
		class: "Hunter",
		effect: function(tar, src){
			var x = 3, id=GetId(src)[0];
			for (var i=0;i<Minions[id].length;i++){
				if (Minions[id][i].type.indexOf("Beast") != -1){
					x = 5;
				}
			}
			DealDamage(tar, src, (5 + SpellDamage[id])*Velen[id]);
		}
	},
	14:{
		name: "Multi-Shot",
		cost: 4,
		class: "Hunter",
		effect: function(tar, src){
			var id = 1-GetId(src)[0];
			var len = Minions[id].length;
			var x = Math.floor(Math.random(len)), y = Math.floor(Math.random(len));
			if (y>=x) y++;
			DealDamage(Minions[id][x], src, (3 + SpellDamage[id])*Velen[id]);
			DealDamage(Minions[id][y], src, (3 + SpellDamage[id])*Velen[id]);
		},
		check: function(tar, src){
			var id= 1-GetId(src)[0];
			if (Minions[id].length < 2)
				return false;
		}
	},
	15:{
		name: "Arcana Missiles",
		cost: 1,
		class: "Mage",
		effect: function(tar, src){
			var id = GetId(src)[0];
			var x = (3 + SpellDamage[id])*Velen[id];
			for (var i=0;i<x;i++){
				var Tars = [];
				for (var j=0;j<Minions[1-id].length;j++){
					if (Minions[1-id][j].health>0 && Minions[1-id][j].indexOf("Immune")==-1){
						Tars.push(Minions[1-id][j]);
					}
				}
				if (Heros[1-id].indexOf("Immune")==-1)
					Tars.push(Heros[1-id]);
				if (Tars.length == 0)
					break;
				else
					DealDamage(Tars[Math.floor(Math.random()*Tars.length)], src, 1);
			}
		}
	},
	16:{
		name: "Mirror Image",
		cost: 1,
		class: "Mage",		
		effect: function(tar, src){
			var id = GetId(src)[0];
			Summon(new Minions(Minions_ex_DB[12], "Minions_ex_DB", 12), -1, id);
			Summon(new Minions(Minions_ex_DB[12], "Minions_ex_DB", 12), -1, id);
		}
	},
	17:{
		name: "Arcana Explosion",
		cost: 2,
		class: "Mage",		
		effect: function(tar, src){
			var id = GetId(src)[0];
			var x = (1 + SpellDamage[id])*Velen[id];
			for (var i=0;i<Minions[1-id].length;i++)
				DealDamage(Minions[1-id][i], src, x);
		}
	},
	18:{
		name: "Frostbolt",
		cost: 2,
		class: "Mage",		
		effect: function(tar, src){
			var id = GetId(src)[0];
			var x = (3 + SpellDamage[id])*Velen[id];
			if (tar.effect.indexOf("Freeze")==-1) tar.effect.push("Freeze");
			DealDamage(tar, src, x);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	19:{
		name: "Arcana Intellect",
		cost: 3,
		class: "Mage",		
		effect: function(tar, src){
			var id = GetId(src)[0];
			Drawcard(id);
			Drawcard(id);
		}
	},
	20:{
		name: "Frost Nova",
		cost: 3,
		class: "Mage",		
		effect: function(tar, src){
			var id = GetId(src)[0];
			for (var i=0;i<Minions[1-id].length;i++){
				var tar = Minions[1-id][i];
				if (tar.effect.indexOf("Freeze")==-1) tar.effect.push("Freeze");
			}
		}
	},
	21:{
		name: "Fireball",
		cost: 4,
		class: "Mage",		
		effect: function(tar, src){
			var id = GetId(src)[0];
			var x = (6 + SpellDamage[id])*Velen[id];
			DealDamage(tar, src, x);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}		
	},
	22:{
		name: "Polymorph",
		cost: 4,
		class: "Mage",
		effect: function(tar, src){
			tar = new Minions(Minions_ex_DB[13], "Minions_ex_DB", 13);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}		
	},
	23:{
		name: "Flamestrike",
		cost: 7,
		class: "Mage",
		effect: function(tar, src){
			var id = GetId(src)[0];
			var x = (4 + SpellDamage[id])*Velen[id];
			for (var i=0;i<Minions[1-id].length;i++)
				DealDamage(Minions[1-id][i], src, x);			
		}
	},
	24:{
		name: "Blessing of Might",
		cost: 1,
		class: "Paladin",
		effect: function(tar, src){
			if (tar==null) return;
			if (tar.Attack_Buff == undefined) tar.Attack_Buff = [];
			var add = function(obj) { obj.attack += 3; }
			var remove = function(obj){ obj.attack -= 3; }
			tar.Attack_Buff.push([src, add, remove]);
			add(tar);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	25:{
		name: "Blessing of Might",
		cost: 1,
		class: "Paladin",
		effect: function(tar, src){
			if (tar.effect.indexOf("Divine Shield")==-1)
				tar.effect.push("Divine Shield");
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}		
	},
	26:{
		name: "Humility",
		cost: 1,
		class: "Paladin",
		effect: function(tar, src){
			tar.Attack_Buff = [];
			tar.Attack_Aura = [];
			tar.attack = 1;
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}		
	},
	27:{
		name: "Holy Light",
		cost: 2,
		class: "Paladin",
		effect : function(tar, src){
			var id = GetId(src)[0];
			Restore(tar, src, 6*Velen[id]);
		},
		check : function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	28:{
		name: "Blessing of Kings",
		cost: 4,
		class: "Paladin",
		effect: function(tar, src){
			if (tar==null) return;
			if (tar.Attack_Buff == undefined) tar.Attack_Buff = [];
			if (tar.Health_Buff == undefined) tar.Health_Buff = [];
			var add1 = function(obj) { obj.attack += 4; }
			var remove1 = function(obj){ obj.attack -= 4; }
			var add2 = function(obj) { obj.maxhealth += 4; obj.health += 4; }
			var remove2 = function(obj){ obj.maxhealth -= 4; obj.health = Math.max(obj.health, obj.maxhealth); }
			tar.Attack_Buff.push([src, add1, remove1]);
			tar.Health_Buff.push([src, add2, remove2]);
			add1(tar); add2(tar);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	29:{
		name: "Consecration",
		cost: 4,
		class: "Paladin",
		effect: function(tar, src){
			var Tars = [], id = 1 - GetId(src)[0];
			for (var i=0; i<Minions[id].length;i++)
				Tars.push(Minions[id][i]);
			Tars.push(Heros[id]);
			for (var i=0; i<Tars.length; i++)
				DealDamage(Tars[i], src, (2+SpellDamage[1-id])*Velen[1-id]);
		}
	},
	30:{
		name: "Hammer of Wrath",
		cost: 4,
		class: "Paladin",
		effect: function(tar, src){
			var id = GetId(src);
			DealDamage(tar, src, (3+SpellDamage[GetId[id]])*Velen[id]);
			Drawcard(id);
		},
		check : function (tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	31:{
		name: "Mind Vision",
		cost: 1,
		class: "Priest",
		effect: function(tar, src){
			var x = Math.floor(Math.random()*Hands[1-GetId(src)[0]].length);
			var card = Hands[1-GetId(src)[0]][x];
			var getcard = new Hands(eval(card.DBfrom)[card.cardid], card.DBfrom, card.cardid);
			if (Hands[id].length < 10)
				Hands.push(getcard);
			else
				Show(getcard);
		},
		check: function(tar, src){
			if (Hands[1-GetId(src)[0]].length > 0) return true;
			throw "对方没有手牌，无法使用"
		}
	},
	32:{
		name: "Power Word: Shield",
		cost: 1,
		class: "Priest",
		effect: function(tar, src){
			if (tar==null) return;
			if (tar.Health_Buff == undefined) tar.Health_Buff = [];
			var add = function(obj) { obj.maxhealth += 2; obj.health += 2; }
			var remove = function(obj){ obj.maxhealth -= 2; obj.health = Math.max(obj.health, obj.maxhealth); }
			tar.Health_Buff.push([src, add, remove]);
			add(tar);
			Drawcard(GetId(src)[0]);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}		
	},
	33:{
		name: "Holy Smite",
		cost: 1,
		class: "Priest",
		effect : function (tar, src){
			var id = GetId(src)[0];
			DealDamage(tar, src, (2 + SpellDamage[id])*Velen[id]);
		},
		check : function (tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	34: {
		name: "Mind Blast",
		cost: 2,
		class: "Priest",
		effect: function(tar, src){
			var id = GetId(src)[0];
			DealDamage(Heros[1-id], src, (5 + SpellDamage[id])*Velen[id]);			
		}
	},
	35: {
		name: "Shadow Word: Pain",
		cost: 2,
		class: "Priest",
		effect: function(tar, src){
			DeathList.push(tar);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.attack >= 4) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;			
		}
	},
	36: {
		name: "Divine Spirit",
		cost: 2,
		class: "Priest",
		effect: function(tar, src){
			if (tar==null) return;
			if (tar.Health_Buff == undefined) tar.Health_Buff = [];
			var num = tar.health;
			var add = function(obj, effect) { var num = effect[3]; obj.maxhealth += num; obj.health += num; }
			var remove = function(obj, effect){ var num = effect[3]; obj.maxhealth -= num; obj.health = Math.max(obj.health, obj.maxhealth); }
			tar.Health_Buff.push([src, add, remove, num]);
			add(tar, [src, add, remove, num]);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;			
		}
	},
	37: {
		name: "Shadow Word: Death",
		cost: 3,
		class: "Priest",
		effect: function(tar, src){
			DeathList.push(tar);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.attack <= 4) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;			
		}
	},
	38: {
		name: "Holy Nova",
		cost: 5,
		class: "Priest",
		effect: function(tar, src){
			var id = GetId(src)[0];
			for (var i=0;i<Minions[1-id].length;i++){
				DealDamage(Minions[1-id][i], src, (2 + SpellDamage[id])*Velen[id]);
			}
			DealDamage(Heros[1-id][i], src, (2 + SpellDamage[id])*Velen[id]);
			for (var i=0;i<Minions[1-id].length;i++){
				Restore(Minions[1-id][i], src, 2*Velen[id]);
			}
			Restore(Heros[1-id][i], src, 2*Velen[id]);
		},
	},
	39: {
		name: "Mind Control",
		cost: 10,
		class: "Priest",
		effect: function(tar, src){
			var id = GetId(src)[0];
			tar.exhaustion = true;
			Minions[id].push(tar);
			Minions[1-id].splice(Minions[1-id].indexOf(tar), 1);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (Minions(GetId(src)[0]).length == 7) throw "无法使用，场满了";
			if (GetId(src)[0] == GetId(tar)[0]) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;			
		}
	},
	40: {
		name: "Backstab",
		cost: 2,
		class: "Rogue",
		effect: function(tar, src){
			var id = GetId(src)[0];
			DealDamage(tar, src, (2+SpellDamage[id])*Velen[id]);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			if (tar.health < tar.maxhealth) throw "请选择一个未受伤的随从";
			return true;			
		}
	},
	41: {
		name: "Sinister Strike",
		class: "Rogue",
		cost: 1,
		effect: function(tar, src){
			var id = GetId(src)[0];
			DealDamage(Heros[1-id], src, (3 + SpellDamage[id])*Velen[id]);			
		}
	},
	42: {
		name: "Deadly Poison",
		class: "Rogue",
		cost: 1,
		effect: function(tar, src){
			var id = GetId(src)[0];
			if (Weapons[id].length > 0){
				var tar = Weapons[id][0];
				if (tar.Attack_Buff == undefined) tar.Attack_Buff = [];
				var add = function(obj) { obj.attack += 2; }
				var remove = function(obj) { obj.attack -= 2; }
				tar.Attack_Buff.push([src, add, remove]);
				add(tar);
			}
		},
		check: function(tar, src){
			var id = GetId(src)[0];
			if (Weapons[id].length <= 0) throw "没有武器，无法使用。";
			return true;
		}
	},
	43: {
		name: "Sap",
		class: "Rogue",
		cost: 2,
		effect: function(tar, src){
			var id = GetId(tar)[0];
			if (Hands[id].length < 10){
				Hands[id].push(tar);
				Minions[id].splice(Minions.indexOf(tar), 1);
			} else {
				DeathList.push(tar);
			}
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (GetId(src)[0] == GetId(tar)[0]) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	44: {
		name: "Assassinate",
		class: "Rogue",
		cost: 5,
		effect: function(tar, src){
			DeathList.push(tar);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (GetId(src)[0] == GetId(tar)[0]) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	45: {
		name: "Fan of Knives",
		class: "Rogue",
		cost: 3,
		effect: function(tar, src){
			var id = 1 - GetId(src)[0];
			for (var i=0;i<Minions[id].length;i++){
				DealDamage(Minions[id][i], src, (1+SpellDamage[1-id])*Velen[1-id]);
			}
			Drawcard(1-id);
		},
	},
	46: {
		name: "Shiv",
		class: "Rogue",
		cost: 2,
		effect: function(tar, src){
			DealDamage(tar, src, (1+SpellDamage[1-id])*Velen[1-id]);
			Drawcard(1-id);
		},
		check: function (tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	47: {
		name: "Vanish",
		class: "Rogue",
		cost: 6,
		effect: function(tar, src){
			for (var id=0;id<2;id++)
				for (var i=0;i<Minions[0].length;i++){
					var tar = Minions[0][i];
					if (Hands[id].length < 10){
						Hands[id].push(tar);
						Minions[id].splice(Minions.indexOf(tar), 1);
					} else {
						DeathList.push(tar);
					}
				}			
		},
	},
	48: {
		name: "Sprint",
		class: "Rogue",
		cost: 7,
		effect: function(tar, src){
			var id = GetId(src)[0];
			Drawcard(id);
			Drawcard(id);
			Drawcard(id);
			Drawcard(id);
		}
	},
	49: {
		name: "Ancestral Healing",
		class: "Shaman",
		cost: 0,
		effect: function(tar, src){
			var id = GetId(src)[0];
			Restore(tar, src, tar.maxhealth*Velen[id]);
			if (tar.Buff == undefined) tar.Buff = [];
			var add = function(obj) { obj.effect.push("Taunt"); }
			var remove = function(obj){ obj.effect.splice(obj.indexOf("Taunt"), 1); }
			tar.Buff.push([src, add, remove]);
			add(tar);			
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;			
		}
	},
	50: {
		name: "Frost Shock",
		class: "Shaman",
		cost: 1,
		effect: function(tar, src){
			var id = GetId(src);
			DealDamage(tar, src, (1+SpellDamage[id])*Velen[id]);
			if (tar.effect.indexOf("Freeze") == -1)
				tar.effect.push("Freeze");
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (GetId(src)[0] == GetId(tar)[0]) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	51: {
		name: "Rockbiter Weapon",
		class: "Shaman",
		cost: 2,
		effect: function(tar, src){
			tar.attack += 3;
			tar.reflash.push(function(obj){obj.attack -= 3;});
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (GetId(src)[0] != GetId(tar)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;			
		}
	},
	52: {
		name: "Windfury",
		class: "Shaman",
		cost: 2,
		effect: function(tar, src){
			if (tar.effect.indexOf("Windfruy") == -1)
				tar.effect.push("Windfury");
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	53: {
		name: "Hex",
		cost: 4,
		class: "Shaman",
		effect: function(tar, src){
			tar = new Minions(Minions_ex_DB[14], "Minions_ex_DB", 14);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	54: {
		name: "Bloodlust",
		cost: 5,
		class: "Shaman",
		effect: function(tar, src){
			var id = GetId(src)[0];
			for (var i=0;i<Minions[id].length;i++){
				var tar = Minions[id][i];
				tar.attack += 3;
				tar.reflash.push(function(obj){obj.attack -= 3;});
			}
		},
	},
	55: {
		name: "Sacrificial Pact",
		cost: 0,
		class: "Warlock",
		effect: function(tar, src){
			DeathList.push(tar);
			Restore(Heros[GetId(src)[0]], src, 5*Velen[GetId(src)[0]]);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Demon")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	56: {
		name: "Corruption",
		cost: 1,
		class: "Warlock",
		effect: function(tar, src){
			if (tar.OpponetStartTurnTrigger == undefined) tar.OpponetStartTurnTrigger = [];
			var x = function (list){
				DeathList.push(list[0]);
			}
			tar.OpponetStartTurnTrigger.push(x);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;			
		}
	},
	57: {
		name: "Mortal Coil",
		cost: 1,
		class: "Warlock",
		effect: function(tar, src){
			var id = GetId(src)[0];
			DealDamage(tar, src, (1+SpellDamage[id])*Velen[id]);
			if (tar.health == 0 || DeathList.indexOf(tar)!=-1)
				Drawcard(id);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;			
		}
	},
	58: {
		name: "Soulfire",
		cost: 1,
		class: "Warlock",
		effect: function(tar, src){
			var id = GetId(src)[0];
			DealDamage(tar, src, (4+SpellDamage[id])*Velen[id]);
			Discard(id);
		},
		check : function (tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	59: {
		name: "Drain Life",
		cost: 3,
		class: "Warlock",
		effect: function (tar, src){
			var id = GetId(src)[0];
			DealDamage(tar, src, (2*SpellDamage[id])*Velen[id]);
			Restore(tar, src, 2*Velen[id]);
		},
		check : function (tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;
		}
	},
	60: {
		name: "Shadow Bolt",
		cost: 3,
		class: "Warlock",
		effect: function(tar, src){
			var id = GetId(src)[0];
			DealDamage(tar, src, (4*SpellDamage[id])*Velen[id]);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;			
		}
	},
	61: {
		name: "Hellfire",
		cost: 4,
		class: "Warlock",
		effect: function(tar, src){
			var id = GetId(src)[0], tars = Heros.concat(Minions[0]).concat(Minions[1]);
			for (var i=0;i<tars.length;i++){
				DealDamage(tars[i], src, (3+SpellDamage[id])*Velen[id]);
			}
		}
	},
	62: {
		name: "Charge",
		cost: 1,
		class: "Warrior",
		effect: function(tar, src){
			tar.effect.push("Charge");
			tar.effect.push("Can't attack Hero");
			tar.reflash.push(function(obj){
				obj.effect.splice(obj.effect.indexOf("Can't attack Hero"), 1);
			});
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (GetId(tar)[0] != GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;			
		}
	},
	63: {
		name: "Cleave",
		cost: 2,
		class: "Warrior",
		effect: function(tar, src){
			var id = GetId(src)[0], Tars = [];
			var m = Minions[1-id];
			if (m.length == 0) return;
			var x = Math.floor(Math.random()*m.length);
			Tars.push(m[x]);
			if (m.length>1){
				var y = Math.floor(Math.random()*(m.length-1));
				if (y>=x) y++;
				Tars.push(m[y]);
			}
			for (var i=0;i<Tars.length;i++){
				DealDamage(Tars[i], src, (2+SpellDamage[id])*Velen[id]);
			}
		},
		check: function(tar, src){
			if (Minions[1-GetId(src)[0]].length < 2) throw "小于2个随从";
			return true;
		}
	},
	64: {
		name: "Whirlwind",
		cost : 1,
		class: "Warrior",
		effect: function(tar, src){
			var Tars = Minions[0].concat(Minions[1]), id = GetId(src)[0];
			for (var i=0;i<Tars.length;i++){
				DealDamage(Tars[i], src, (1+SpellDamage[id])*Velen[id]);
			}
		}
	},
	65: {
		name: "Execute",
		cost: 2,
		class: "Warrior",
		effect: function(tar, src){
			DeathList.push(tar);
		},
		check: function(tar, src){
			if (tar == null) throw "请选择一个有效的目标";
			if (GetId(tar)[0] == GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.health >= tar.maxhealth) throw "请选择一个有效的目标";
			if (tar.type.indexOf("Minion")==-1) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Immune")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Stealth")!=-1 && GetId(tar)[0]!=GetId(src)[0]) throw "请选择一个有效的目标";
			if (tar.effect.indexOf("Can't be targeted by Spells or Hero Powers.") != -1) throw "请选择一个有效的目标";
			return true;			
		}
	},
	66: {
		name: "Heroic Strike",
		cost: 2,
		effect: function(tar, src){
			var src = Heros[GetId(src)[0]];
			src.attack += 4;
			src.reflash.push(function(obj){obj.attack -= 4;});
		}
	},
	67: {
		name: "Shield Block",
		cost: 3,
		effect: function(tar, src){
			var id = GetId(src)[0];
			GainArmor(Hero[id], 5);
			Drawcard(id);
		}
	}
}