var Minions_Basic_DB = {
	0: {
		name : "Ironbark Protector",
		attack : 8,
		health : 8,
		cost : 8,
		effect : ["Taunt"],
		class : "Druid"
	},
	1: {
		name : "Timber Wolf",
		attack : 1,
		health : 1,
		cost : 1,
		class : "Hunter",
		type : ["Beast"],
		Ongoing : [
			function(src){
				var check = function(obj, src){
					if (src.Ongoing!=undefined && src.Ongoing.length>0 && GetId(obj)[0] == GetId(src)[0] && obj!=src && obj.type.indexOf("Beast")!=-1)
						return true;
					return false;
				}
				var add = function(obj) { obj.attack += 1; }
				var remove = function(obj){	obj.attack -= 1; }
				var x = [src, check, add, remove];
				for (var i=0;i<Minions[GetId(src)[0]].length;i++){
					var obj = Minions[GetId(src)[0]][i];
					if (check(obj, src) && obj.Attack_Aura.indexOf(x)==-1){
						if (obj.Attack_Aura == undefined)
							obj.Attack_Aura = [];
						obj.Attack_Aura.push(x);
						add(obj);
					}
				}
			}
		]
	},
	2: {
		name : "Houndmaster",
		attack : 4,
		health : 3,
		cost : 4,
		class : "Hunter",
		Battlecry : [
			function(tar=null){
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
			}
		],
		BattlecryCheck : [
			function(tar, src){
				var id, Tars=[];
				if (Minions[0].indexOf(src)!=-1) id=0;
				if (Minions[1].indexOf(src)!=-1) id=1;
				for (var i=0;i<Minions[id].length;i++){
					if (Minions[id][i].effect.indexOf("Beast")!=-1){
						Tars.push(Minions[id][i]);
					}
				}
				if (Tars==[] && tar==null) return true;
				if (Tars.indexOf(tar)!=-1) return true;
				throw "这不是一个合法的目标";
			}
		]
	},
	3: {
		name : "Starving Buzzard",
		attack : 3,
		health : 2,
		cost : 5,
		class : "Hunter",
		type : ["Beast"],
		YourPlayMinionsTrigger : [
			function(obj){
				if (obj.effect.indexOf("Beast")!=-1){
					Drawcard();
				}
			}
		]
	},
	4: {
		name : "Tundra Rhino",
		attack : 2,
		health : 5,
		cost : 5,
		class : "Hunter",
		type : ["Beast"],
		Ongoing : [
			function(src){
				var check = function(obj, src){
					if (src.Ongoing!=undefined && src.Ongoing.length>0 && GetId(obj)[0] == GetId(src)[0] && obj.type.indexOf("Beast")!=-1)
						return true;
					return false;
				}
				var add = function(obj) { obj.effect.push("Charge"); }
				var remove = function(obj){	obj.effect.splice(obj.indexOf("Charge"), 1); }
				var x = [src, check, add, remove];
				for (var i=0;i<Minions[GetId(src)[0]].length;i++){
					var obj = Minions[GetId(src)[0]][i];
					if (obj.Aura == undefined)
						obj.Aura = [];
					if (check(obj, src) && obj.Aura.indexOf(x)==-1){
						obj.Aura.push(x);
						add(obj);
					}
				}
			}
		]
	},
	5: {
		name : "Water Elemental",
		attack : 3,
		health : 6,
		cost : 4,
		class : "Mage",
		type : ["Elemental"],
		DealingDamageTrigger : [
			function(list){
				list[1].effect.push("Freeze");
			}
		]
	},
	6: {
		name : "Guardian of Kings",
		attack : 5,
		health : 6,
		cost : 7,
		class : "Paladin",
		Battlecry : [
			function(tar, obj){
				var id;
				if (Minions[0].indexOf(obj)!=-1) id=0;
				if (Minions[1].indexOf(obj)!=-1) id=1;				
				Restore(Heros[id], obj, 6);
			}
		],
	},
	7: {
		name : "Northshire Cleric",
		attack : 1,
		health : 3,
		cost : 1,
		class : "Priest",
		MinionsHealTrigger : [
			function(list){
				var id;
				if (Minions[0].indexOf(list[0])!=-1) id=0;
				if (Minions[1].indexOf(list[0])!=-1) id=1;
				Drawcard(id);
			}
		]
	},
	8: {
		name : "Flametongue Totem",
		attack : 0,
		health : 3,
		cost : 2,
		class : "Shaman",
		type : ["Totem"],
		Ongoing : [
			function(src){
				var check = function(obj, src){
					if (src.Ongoing!=undefined && src.Ongoing.length>0 && GetId(obj)[0] == GetId(src)[0] && Math.abs(GetId(obj)[0]-GetId(src)[0])==0)
						return true;
					return false;
				}
				var add = function(obj) { obj.attack += 2; }
				var remove = function(obj){	obj.attack -= 2; }
				var x = [src, check, add, remove];
				for (var i=0;i<Minions[GetId(src)[0]].length;i++){
					var obj = Minions[GetId(src)[0]][i];
					if (obj.Attack_Aura == undefined)
						obj.Attack_Aura = [];
					if (check(obj, src) && obj.Attack_Aura.indexOf(x)==-1){
						obj.Attack_Aura.push(x);
						add(obj);
					}
				}
			}
		]
	},
	9: {
		name : "WinderSpeak",
		attack : 3,
		health : 3,
		cost : 4,
		class : "Shaman",
		Battlecry : [
			function(tar=null){
				if (tar == null) return;
				tar.effect.push("Windfury");
			}
		],
		BattlecryCheck : [
			function(tar, src){
				var src_id = -1, tar_id = -1, src_pos=-1, tar_pos=-1;
				if (Minions[0].indexOf(src)!=-1) { src_id = 0; src_pos = Minions[0].indexOf(src) };
				if (Minions[1].indexOf(src)!=-1) { src_id = 1; src_pos = Minions[0].indexOf(src) };
				if (Minions[0].indexOf(tar)!=-1) { tar_id = 0; tar_pos = Minions[0].indexOf(tar) };
				if (Minions[1].indexOf(tar)!=-1) { tar_id = 1; tar_pos = Minions[0].indexOf(tar) };
				if (Minions[src_id].length == 1 && tar == null) return true;
				if (src_id == tar_id && src_pos != tar_pos) return true;
				throw "这不是一个合法的目标";
			}
		]
	},
	10: {
		name : "Fire Elemental",
		attack : 6,
		health : 5,
		cost : 6,
		class : "Shaman",
		type : ["Elemental"],
		Battlecry : [
			function(tar=null){
				if (tar == null) return;
				DealDamage(tar, src, 3);
			}
		],
		BattlecryCheck : [
			function(tar, src){
				if (Minions[0].indexOf(tar)!=-1 || Minions[1].indexOf(tar)!=-1 || Heros.indexOf(tar)!=-1)
					if (tar!=src)
						return true;
				throw "这不是一个合法的目标";
			}
		]
	},
	11: {
		name : "Voidwalker",
		attack : 1,
		health : 3,
		cost : 1,
		effect : ["Taunt"],
		type : ["Demon"],
		class : "Warlock",
	},
	12: {
		name : "Succubus",
		attack : 4,
		health : 3,
		cost : 2,
		type : ["Demon"],
		class : "Warlock",
		Battlecry : [
			function(tar, src){
				var id = GetId(src)[0];
				Discard(src);
			}
		]
	},
	13: {
		name : "Dread Infernal",
		attack : 6,
		health : 6,
		cost : 6,
		type : ["Demon"],
		class : "Warlock",
		Battlecry : [
			function(tar, src){
				for (var i=0;i<Minions[0].length;i++) if (Minions[0][i] != src) DealDamage(Minions[0][i], src, 1);
				for (var i=0;i<Minions[1].length;i++) if (Minions[1][i] != src) DealDamage(Minions[1][i], src, 1);
				DealDamage(Heros[0], src, 1);
				DealDamage(Heros[1], src, 1);
			}
		]
	},
	14: {
		name : "Warsong Commander",
		attack : 2,
		health : 3,
		cost : 3,
		class : "Warrior",
		Ongoing : [
			function(src){
				var check = function(obj, src){
					if (src.Ongoing!=undefined && src.Ongoing.length>0 && GetId(obj)[0] == GetId(src)[0] && src!=obj && obj.effect.indexOf("Charge")!=-1)
						return true;
					return false;
				}
				var add = function(obj) { obj.attack += 1; }
				var remove = function(obj){	obj.attack -= 1; }
				var x = [src, check, add, remove];
				for (var i=0;i<Minions[GetId(src)[0]].length;i++){
					var obj = Minions[GetId(src)[0]][i];
					if (obj.Attack_Aura == undefined)
						obj.Attack_Aura = [];
					if (check(obj, src) && obj.Attack_Aura.indexOf(x)==-1){
						obj.Attack_Aura.push(x);
						add(obj);
					}
				}
			}
		]
	},
	15: {
		name : "Kor\'kron Elite",
		attack : 4,
		health : 3,
		cost : 4,
		class : "Warrior",
		effect : ["Charge"]
	},
	16: {
		name : "Elven Archer",
		attack : 1,
		health : 1,
		cost : 1,
		Battlecry : [
			function(tar, src){
				DealDamage(tar, src, 1);
			}
		],
		BattlecryCheck : [
			function(tar, src){
				if (GetId(tar)[0]!=-1 && tar!=src) return true;
				throw "这不是一个合法的目标"
			}
		]
	},
	17: {
		name : "Goldshire Footman",
		attack : 1,
		health : 2,
		cost : 1,
		effect : ["Taunt"]
	},
	18 : {
		name : "Grimscale Oracle",
		attack : 1,
		health : 1,
		cost : 1,
		type : ["Murloc"],
		Ongoing : [
			function(src){
				var check = function(obj, src){
					if (src.Ongoing!=undefined && src.Ongoing.length>0 && GetId(obj)[0] == GetId(src)[0] && obj!=src && obj.type.indexOf("Murloc")!=-1)
						return true;
					return false;
				}
				var add = function(obj) { obj.attack += 1; }
				var remove = function(obj){	obj.attack -= 1; }
				var x = [src, check, add, remove];
				for (var i=0;i<Minions[GetId(src)[0]].length;i++){
					var obj = Minions[GetId(src)[0]][i];
					if (obj.Attack_Aura == undefined)
						obj.Attack_Aura = [];
					if (check(obj, src) && obj.Attack_Aura.indexOf(x)==-1){
						obj.Attack_Aura.push(x);
						add(obj);
					}
				}
			}
		]
	},
	19 : {
		name : "Murloc Raider",
		attack : 2,
		health : 1,
		cost : 1,
		type : ["Murloc"]
	},
	20 : {
		name : "Stonetusk Boar",
		attack : 1,
		health : 1,
		cost : 1,
		effect : ["Charge"]
	},
	21 : {
		name : "Voodoo Doctor",
		attack : 2,
		health : 1,
		cost : 1,
		Battlecry : [
			function(tar, src){
				Restore(tar, src, 2);
			}
		],
		BattlecryCheck : [
			function(tar, src){
				if (GetId(tar)[0]!=-1 && tar!=src) return true;
				throw "这不是一个合法的目标"
			}
		]
	},
	22 : {
		name : "Acidic Swamp Ooze",
		attack : 3,
		health : 2,
		cost : 2,
		Battlecry: [
			function(tar, src){
				var id = GetId(src)[0];
				if (Weapons[1-id].length>0){
					DeathList.push(Weapons[1-id][0]);
				}
			}
		]
	},
	23 : {
		name : "Bloodfen Raptor",
		attack : 3,
		health : 2,
		cost : 2,
		type : ["Beast"],
	},
	24 : {
		name : "Bluegill Warrior",
		attack : 2,
		health : 1,
		cost : 2,
		type : ["Murloc"],
		effect : ["Charge"]
	},
	25 : {
		name : "Forstwolf Grunt",
		attack : 2,
		health : 2,
		cost : 2,
		effect : ["Taunt"]
	},
	26 : {
		name : "Kobold Geo",
		attack : 2,
		health : 2,
		cost : 2,
		Ongoing: [
			function(src){
				var check = function(obj, src){
					if (src.Ongoing!=undefined && src.Ongoing.length>0 && GetId(obj)[0] == GetId(src)[0] && obj!=src && obj.type.indexOf("Hero")!=-1)
						return true;
					return false;
				}
				var add = function(obj) { SpellDamage[GetId(src)[0]] += 1; }
				var remove = function(obj){	SpellDamage[GetId(src)[0]] -= 1; }
				var x = [src, check, add, remove];
				var obj = Heros[GetId(src)[0]];
				if (obj.Aura == undefined) obj.Aura = [];
				if (check(obj, src) && obj.Aura.indexOf(x)==-1){
					obj.Aura.push(x);
					add(obj);
				}
			}
		]
	},
	27 : {
		name : "Murloc Tidehunter",
		attack : 2,
		health : 1,
		cost : 2,
		Battlecry : [
			function(tar, src){
				var [src_id, src_pos] = GetId(src);
				Summon(new Minions(Minions_ex_DB[6], "Minions_ex_DB", 6), src_pos+1, src_id);
			}
		]
	},
	28 : {
		name : "Novice Engineer",
		attack : 1,
		health : 1,
		cost : 2,
		Battlecry : [
			function(tar, src){
				var src_id = GetId(src)[0];
				Drawcard(src_id);
			}
		]
	},
	29 : {
		name : "River Crocolisk",
		attack : 2,
		health : 3,
		cost : 2,
		type : ["Beast"],
	},
	30 : {
		name : "Dalaran Mage",
		attack : 1,
		health : 4,
		cost : 3,
		Ongoing: [
			function(src){
				var check = function(obj, src){
					if (src.Ongoing!=undefined && src.Ongoing.length>0 && GetId(obj)[0] == GetId(src)[0] && obj!=src && obj.type.indexOf("Hero")!=-1)
						return true;
					return false;
				}
				var add = function(obj) { SpellDamage[GetId(src)[0]] += 1; }
				var remove = function(obj){	SpellDamage[GetId(src)[0]] -= 1; }
				var x = [src, check, add, remove];
				var obj = Heros[GetId(src)[0]];
				if (obj.Aura == undefined) obj.Aura = [];
				if (check(obj, src) && obj.Aura.indexOf(x)==-1){
					obj.Aura.push(x);
					add(obj);
				}
			}
		]		
	},
	31 : {
		name : "Ironforge Riflenman",
		attack : 2,
		health : 2,
		cost : 3,
		Battlecry : [
			function(tar, src){
				DealDamage(tar, src, 1);
			}
		],
		BattlecryCheck : [
			function(tar, src){
				if (GetId(tar)[0]!=-1 && tar!=src) return true;
				throw "这不是一个合法的目标"
			}
		]		
	},
	32 : {
		name : "Ironfur Grlzzly",
		cost : 3,
		attack : 3,
		health : 3,
		effect : ["Taunt"],
		type : ["Beast"]
	},
	33 : {
		name : "Magma Rager",
		attack : 5,
		health : 1,
		cost : 3,
		type : "Elemental",
	},
	34 : {
		name : "Raid Leader",
		attack : 2,
		health : 2,
		cost : 3,
		Ongoing : [
			function(src){
				var check = function(obj, src){
					if (src.Ongoing!=undefined && src.Ongoing.length>0 && GetId(obj)[0] == GetId(src)[0] && obj!=src)
						return true;
					return false;
				}
				var add = function(obj) { obj.attack += 1; }
				var remove = function(obj){	obj.attack -= 1; }
				var x = [src, check, add, remove];
				for (var i=0;i<Minions[GetId(src)[0]].length;i++){
					var obj = Minions[GetId(src)[0]][i];
					if (obj.Attack_Aura == undefined)
						obj.Attack_Aura = [];
					if (check(obj, src) && obj.Attack_Aura.indexOf(x)==-1){
						obj.Attack_Aura.push(x);
						add(obj);
					}
				}
			}
		]		
	},
	35 : {
		name : "Razorfen Hunter",
		attack : 2,
		health : 3,
		cost : 3,
		Battlecry : [
			function(tar, src){
				var [src_id, src_pos] = GetId(src);
				Summon(new Minions(Minions_ex_DB[7], "Minions_ex_DB", 7), src_pos+1, src_id);
			}
		]
	},
	36 : {
		name : "Shattered Sun Cleric",
		attack : 3,
		health : 2,
		cost : 3,
		Battlecry : [
			function(tar, src){
				if (tar==null) return;
				if (tar.Attack_Buff == undefined) tar.Attack_Buff = [];
				if (tar.Health_Buff == undefined) tar.Health_Buff = [];
				var add1 = function(obj) { obj.attack += 1; }
				var remove1 = function(obj){ obj.attack -= 1; }
				var add2 = function(obj) { obj.maxhealth += 1; obj.health += 1; }
				var remove2 = function(obj){ obj.maxhealth -= 1; obj.health = Math.max(obj.health, obj.maxhealth); }
				tar.Attack_Buff.push([src, add1, remove1]);
				tar.Health_Buff.push([src, add2, remove2]);
				add1(tar); add2(tar);
			}
		],
		BattlecryCheck : [
			function(tar, src){
				var id, Tars=[];
				if (Minions[0].indexOf(src)!=-1) id=0;
				if (Minions[1].indexOf(src)!=-1) id=1;
				for (var i=0;i<Minions[id].length;i++){
					if (Minions[id][i] != src){
						Tars.push(Minions[id][i]);
					}
				}
				if (Tars==[] && tar==null) return true;
				if (Tars.indexOf(tar)!=-1) return true;
				throw "这不是一个合法的目标";
			}
		]
	},
	37 : {
		name : "Silverback Patriarch",
		attack : 1,
		health : 4,
		cost : 3,
		type : ["Beast"],
		effect : ["Taunt"]
	},
	38 : {
		name : "Wolfrider",
		attack : 3,
		health : 1,
		cost : 3,
		effect : ["Charge"]
	},
	39 : {
		name : "Chilwind Yeti",
		cost : 4,
		attack : 4,
		health : 5,
	},
	40 : {
		name : "Dragonling Mechanic",
		cost : 4,
		attack : 2,
		health : 4,
		Battlecry : [
			function(tar, src){
				var [src_id, src_pos] = GetId(src);
				Summon(new Minions(Minions_ex_DB[8], "Minions_ex_DB", 8), src_pos+1, src_id);
			}			
		]
	},
	41 : {
		name : "Gnomish Inventor",
		attack : 2,
		health : 4,
		cost : 4,
		Battlecry : [
			function(tar, src){
				var src_id = GetId(src)[0];
				Drawcard(src_id);
			}
		]
	},
	42 : {
		name : "Oasis Snapjaw",
		attack : 2,
		health : 7,
		cost : 4,
		type : ["Beast"]
	},
	43 : {
		name : "Ogre Magi",
		attack : 4,
		health : 4,
		cost : 4,
		Ongoing: [
			function(src){
				var check = function(obj, src){
					if (src.Ongoing!=undefined && src.Ongoing.length>0 && GetId(obj)[0] == GetId(src)[0] && obj!=src && obj.type.indexOf("Hero")!=-1)
						return true;
					return false;
				}
				var add = function(obj) { SpellDamage[GetId(src)[0]] += 1; }
				var remove = function(obj){	SpellDamage[GetId(src)[0]] -= 1; }
				var x = [src, check, add, remove];
				var obj = Heros[GetId(src)[0]];
				if (obj.Aura == undefined) obj.Aura = [];
				if (check(obj, src) && obj.Aura.indexOf(x)==-1){
					obj.Aura.push(x);
					add(obj);
				}
			}
		]		
	},
	44 : {
		name : "Sen\'jin Shieldmasta",
		attack : 3,
		health : 5,
		cost : 4,
		effect : ["Taunt"]
	},
	45 : {
		name : "Stormwind Knight",
		attack : 2,
		health : 5,
		cost : 4,
		effect : ["Charge"]
	},
	46: {
		name : "Booty Bay Bodyguard",
		attack : 5,
		health : 4,
		cost : 5,
		effect : ["Taunt"]
	},
	47: {
		name : "Darkscale Healer",
		attack : 4,
		health : 5,
		cost : 5,
		Battlecry : [
			function(tar, src){
				var src_id = GetId(src)[0];
				var Tars = [];
				for (var i=0;i<Minions[src_id].length;i++){
					if (Minions[src_id][i] != src)
						Tars.push(Minions[src_id][i], src, 2);
				}
				Tars.push(Heros[src_id][i], src, 2);
				for (var i=0;i<Tars.length;i++)
					Restore(Tars[i], src, 2);
			}
		]
	},
	48: {
		name : "Forstwolf Warlord",
		attack : 4,
		health : 4,
		cost : 5,
		Battlecry: [
			function(tar, src){
				var num = Minions[GetId(src)[0]].length-1;
				if (tar==null) return;
				if (tar.Attack_Buff == undefined) tar.Attack_Buff = [];
				if (tar.Health_Buff == undefined) tar.Health_Buff = [];
				var add1 = function(obj, effect) { obj.attack += effect[3]; }
				var remove1 = function(obj, effect){ obj.attack -= effect[3]; }
				var add2 = function(obj, effect) { obj.maxhealth += effect[3]; obj.health += effect[3]; }
				var remove2 = function(obj, effect){ obj.maxhealth -= effect[3]; obj.health = Math.max(obj.health, obj.maxhealth); }
				tar.Attack_Buff.push([src, add1, remove1, num]);
				tar.Health_Buff.push([src, add2, remove2, num]);
				add1(tar, [src, add1, remove1, num]); add2(tar, [src, add2, remove2, num]);
			}
		]
	},
	49: {
		name : "Gurubashi Berserker",
		attack : 2,
		health : 3,
		cost : 5,
		TakeDamageTrigger : [
			function(list){
				var src = list[0];
				if (src.Attack_Buff == undefined) src.Attack_Buff = [];
				var add = function(obj) { obj.attack += 3; }
				var remove = function(obj) { obj.attack += 3; }
				src.Attack_Buff.push([src, add, remove])
				add(src);
			}
		]
	},
	50: {
		name : "Nightblade",
		attack : 4,
		health : 4,
		cost : 5,
		Battlecry : [
			function(tar, src){
				var src_id = GetId(src)[0];
				DealDamage(Heros[1-src_id], src, 3);
			}
		]
	},
	51: {
		name : "Stormpike Commando",
		attack : 4,
		health : 2,
		cost : 5,
		Battlecry : [
			function(tar, src){
				DealDamage(tar, src, 2);
			}
		],
		BattlecryCheck : [
			function(tar, src){
				if (GetId(tar)[0]!=-1 && tar!=src) return true;
				throw "这不是一个合法的目标"
			}
		]		
	},
	52: {
		name : "Archmage",
		cost : 6,
		attack : 4,
		health : 7,
		Ongoing: [
			function(src){
				var check = function(obj, src){
					if (src.Ongoing!=undefined && src.Ongoing.length>0 && GetId(obj)[0] == GetId(src)[0] && obj!=src && obj.type.indexOf("Hero")!=-1)
						return true;
					return false;
				}
				var add = function(obj) { SpellDamage[GetId(src)[0]] += 1; }
				var remove = function(obj){	SpellDamage[GetId(src)[0]] -= 1; }
				var x = [src, check, add, remove];
				var obj = Heros[GetId(src)[0]];
				if (obj.Aura == undefined) obj.Aura = [];
				if (check(obj, src) && obj.Aura.indexOf(x)==-1){
					obj.Aura.push(x);
					add(obj);
				}
			}
		]		
	},
	53: {
		name : "Boulderfist Ogre",
		cost : 6,
		attack : 6,
		health : 7,
	},
	54: {
		name : "Reckless Rocketeer",
		cost : 6,
		attack : 5,
		health : 2,
		effect : ["Charge"],
	},
	55: {
		name : "Core Hound",
		cost : 7,
		attack : 9,
		health : 5,
		type : ["Beast"],
	},
	56: {
		name : "Stormwind Champion",
		cost : 7,
		attack : 6,
		health : 6,
		Ongoing : [
			function(src){
				var check = function(obj, src){
					if (src.Ongoing!=undefined && src.Ongoing.length>0 && GetId(obj)[0] == GetId(src)[0] && obj!=src)
						return true;
					return false;
				}
				var add1 = function(obj) { obj.attack += 1; }
				var remove1 = function(obj){ obj.attack -= 1; }
				var add2 = function(obj) { obj.maxhealth += 1; obj.health += 1;}
				var remove2 = function(obj){ obj.maxhealth -= 1; obj.health = Math.max(obj.maxhealth, obj.health); }
				var x = [src, check, add1, remove1];
				var y = [src, check, add2, remove2];
				for (var i=0;i<Minions[GetId(src)[0]].length;i++){
					var obj = Minions[GetId(src)[0]][i];
					if (obj.Attack_Aura == undefined)
						obj.Attack_Aura = [];
					if (check(obj, src) && obj.Attack_Aura.indexOf(x)==-1){
						obj.Attack_Aura.push(x);
						add1(obj);
					}
					if (check(obj, src) && obj.Health_Aura.indexOf(y)==-1){
						obj.Health_Aura.push(y);
						add2(obj);
					}
				}
			}
		]
	},
	57: {
		name : "War Golem",
		cost : 7,
		attack : 7,
		health : 7
	},
}