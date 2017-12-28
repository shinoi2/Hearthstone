var Fatigue={0:0, 1:0, DealingDamageTrigger:[], play_index:0}, DeathList=[];
var ChogallBuff, PreparationBuff, KirinTorBuff;
var Weapons = [[], []];
var Mana = [0, 0], MaxMana = [0, 0];
var Heros = [];
var Secret=[[], []];
var playturn, playid, play_index=0;
var cemetery = [[], []];
var discards = [[], []];
var Minions = [[], []];
var Overload = [[0,0], [0,0]]
var Triggers = [];
var SpellDamage = [0, 0], Velen = [1, 1];
var Deck = [[], []];
var Hands = [[], []];

function Trigger_1(TriggerType, id=-1){
	if (id==-1 || id==0){
		for (var i=0;i<Minions[0].length;i++){
			if (Minions[0][i][TriggerType]!=undefined){
				for (var j=0;j<Minions[0][i][TriggerType].length;j++){
					Triggers.push([Minions[0][i].play_index, Minions[0][i][TriggerType][j], Minions[0][i]]);
				}
			}
		}
	} else
	if (id==-1 || id==1){
		for (var i=0;i<Minions[1].length;i++){
			if (Minions[1][i][TriggerType]!=undefined){
				for (var j=0;j<Minions[1][i][TriggerType].length;j++){
					Triggers.push([Minions[1][i].play_index, Minions[1][i][TriggerType][j], Minions[1][i]]);
				}
			}
		}
	} else {
		if (id.TriggerType!=undefined){
			for (var i=0;i<id[TriggerType].length;i++){
				Triggers.push(id.play_index, id[TriggerType][i], id);
			}
		}
	}
}

function Trigger_2(list=[]){
	Triggers.sort();
	for (var i=0;i<Triggers.length;i++){
		Triggers[i][1]([Triggers[i][2]].concat(list));
	}
	Triggers = [];
}

function Discard(id){
	if (Hands[id].length == 0) return;
	var x = Math.floor(Math.random()*Hands[id].length);
	var c = Hands[id][x];
	discards[id].push(c);
	Hands.splice(x, 1);
	// 13小鬼 魔像 。。。
}

function Game(Heroid1, Heroid2, Deck1, Deck2){
	Heros = [new Hero(Hero_DB[Heroid1]), new Hero(Hero_DB[Heroid2])];
	Deck = [[], []];
	for (var i=0; i<30; i++){
	 	Deck[0].push(new Card(Deck1[i][0], Deck1[i][1]));
	 	Deck[1].push(new Card(Deck2[i][0], Deck2[i][1]));
	}
	playid = Math.floor(Math.random()*2);
	playturn = 0;
	for (var i=0;i<3;i++){
		Drawcard(playid); 
	}
	for (var i=0;i<4;i++){
		Drawcard(1-playid);
	}
	MaxMana[playid] = 1;
	Mana[0] = MaxMana[0];
	Mana[1] = MaxMana[1];
	// Choose(playid, Hands[playid]);
	// Choose(1-playid, Hands[1-playid]);
	Hands[1-playid].push(new Spell(Spell_ex_DB[1], "Spell_ex_DB", 1));
}

function GetId(obj){
	if (Minions[0].indexOf(obj)!=-1){
		return [0, Minions[0].indexOf(obj)];
	}
	if (Minions[1].indexOf(obj)!=-1){
		return [1, Minions[1].indexOf(obj)];
	}
	if (Heros.indexOf(obj)!=-1){
		return [Heros.indexOf(obj), "Hero"];
	}
	return [-1, -1];
}

function Drawcard(id = playid) {
	if (Deck[id].length == 0){
		Fatigue[id] ++;
		DealDamage(Heros[id], Fatigue, Fatigue[id])
	} else {
		var c = Math.floor(Math.random()*Deck[id].length);
		if (Hands[id].length == 10){
			Deck[id].splice(c,1);
		} else {
			Hands[id].push(Deck[id].splice(c,1));
			var Triggers = [];
			Trigger_1("DrawTriger");
			Trigger_1("YourDrawTriger", playid);
			Trigger_1("OpponentDrawTriger", 1-playid);
			Trigger_2([Hands[id][Hands[id].length-1]]);
		}
	}
}

function DealDamage(tar, src, num) {
	if (tar.effect.indexOf("Immune") != -1) return;
	if (tar.effect.indexOf("Divine Shield") != -1){
		tar.effect.splice(tar.effect.indexOf("Divine Shield"), 1);
		return;
	}
	if (Heros.indexOf(tar) != -1) {
		var id = Heros.indexOf(tar);
		for (var i=0;i<Minions[id].length;i++){
			if (Minions[id][i].effect.indexOf("Your hero can only take 1 damage at a time.")) {
				num = 1;
			}
		}
		var PerDamage = -1;
		for (var i=0;i<Minions[id].length;i++) {
			if (Minions[id][i].effect.indexOf("Whenever your hero takes damage, this minion takes it instead.")){
				if (play_index > PerDamage) {
					PerDamage = play_index;
					tar = Minions[id][i];
				}
			}
		}
		if (id != playid) {
			for (var i=0;i<Secret[id].length;i++){
				if (Secret[id][i].name == "Ice Block"){
					if (play_index > PerDamage){
						PerDamage = play_index;
						//触发冰箱
						RevealSecret();
						tar = Heros[id];
						Secret[id][i].splice(id,1);
						Heros[id].effect.push("Immune");
						Heros[id].reflash.push(function(obj){obj.effect.splice(obj.effect.indexOf("Immune"), 1)})
						return;
					}
				}
			}
		}
	}

	var Triggers = [];
	// 受到伤害扳机
	Trigger_1("TakeDamageTrigger", tar);
	// 造成伤害扳机
	Trigger_1("DealingDamageTrigger", src)
	// 友方随从受到伤害扳机
	var id;
	if (Minions[0].indexOf(tar) == 0) id = 0; else id = 1;
	Trigger_1("FriendlyTakeDamageTrigger", id);
	// 随从受到伤害扳机
	Trigger_1("MinionsTakeDamageTrigger");
	// 扳机排序
	Trigger_2([tar, src, num]);
	// 实际造成伤害
	tar.health -= num;
	// [待完成] 法术伤害加成
	if (Heros.indexOf(tar)!=-1) {
		tar.armor -= num;
		if (tar.armor < 0) {
			tar.health += tar.armor;
			tar.armor = 0;
		}
	} else {
		tar.health -= num;
	}
}

function GainArmor(tar, num) {
	var id = Heros.indexOf(tar);
	var Triggers = [];
	Trigger_1("GainArmorTrigger");
	Trigger_1("YourGainArmorTrigger", id);
	Trigger_1("OpponentGainArmorTrigger", 1-id);
	Trigger_2();
	tar.armor += num;
}

function EquippingWeapon(obj, tar=null, src=playid, Battlecry=false){
	Weapons[src].push(obj);
	Triggers = []
	Trigger_1("EquippingWeaponTrigger", src);
	Trigger_2([Weapons[src][Weapons[src].length - 1]])
	if (src == playid){
		Heros[src].attack += Weapons[src][Weapons[src].length - 1].attack;
	}
	if (Battlecry && obj.Battlecry!=undefined){
		for (var i=0;i<Weapons[src][Weapons[src].length - 1].Battlecry.length;i++){
			Weapons[src][Weapons[src].length - 1].Battlecry[i]([Weapons[src][Weapons[src].length - 1]]);
		}
	}
	for (var i=0;i<Weapons[src].length-1;i++){
		DeathList.push([Weapons[src][i].play_index, Weapons[src][i]]);
	}
}

function Death(){
	for (var k=0;k<2;k++){
		for (var i=0;i<Minions[k].length;i++){
			if (Minions[k][i].health <= 0 && DeathList.indexOf([Minions[k][i].play_index, Minions[k][i]]) == -1){
				DeathList.push([Minions[k][i].play_index, Minions[k][i]])
			}
		}
		for (var i=0;i<Weapons[k].length;i++)
			if (Weapons[k][i].durability <= 0 && DeathList.indexOf([Weapons[k][i].play_index, Weapons[k][i]]) == -1){
				DeathList.push([Weapons[k][i].play_index, Weapons[k][i]])
		}
	}
	DeathList = DeathList.sort();
	rDeathList = DeathList;
	DeathList = []
	for (var d=0; d<rDeathList.length; d++){
		if (rDeathList[d][1].type.indexOf("Minion")!=-1){
			// 移除随从
			var id;
			var deathitem = rDeathList[d][1];
			if (Minions[0].indexOf(deathitem) != -1) id = 0; else id = 1;
			Minions[id].splice(Minions[id].indexOf(deathitem), 1);
			// 触发亡语
			for (var i=0; i<deathitem.Deathrattle.length; i++){
				deathitem.Deathrattle[i]();
			}
			// 死亡扳机
			var MinionsDeathTriggers = [];
			for (var i=0;i<Minions[0].length;i++){
				for (var j=0;j<Minions[0][i].MinionsDeathTrigger.length;j++){
					MinionsDeathTriggers.push([Minions[0][i].play_index, Minions[0][i].MinionsDeathTrigger[j]])
				}
			}
			for (var i=0;i<Minions[1].length;i++){
				for (var j=0;j<Minions[1][i].MinionsDeathTrigger.length;j++){
					MinionsDeathTriggers.push([Minions[1][i].play_index, Minions[1][i].MinionsDeathTrigger[j]])
				}
			}
			
			for (var i=0;i<Minions[id].length;i++){
				for (var j=0;j<Minions[id][i].YourMinionsDeathTrigger.length;j++){
					MinionsDeathTriggers.push([Minions[id][i].play_index, Minions[id][i].YourMinionsDeathTrigger[j]])
				}
			}
			for (var i=0;i<Minions[1-id].length;i++){
				for (var j=0;j<Minions[1-id][i].OpponentMinionsDeathTrigger.length;j++){
					MinionsDeathTriggers.push([Minions[1-playid][i].play_index, Minions[1-id][i].OpponentMinionsDeathTrigger[j]])
				}
			}
			MinionsDeathTriggers = MinionsDeathTriggers.sort()
			for (var i=0;i<MinionsDeathTriggers.length;i++){
				MinionsDeathTriggers[i][1](deathitem);
			}
			// 加入墓地
			cemetery[id].push(new Minion(eval(deathitem.DBfrom)[deathitem.cardid], deathitem.DBfrom, deathitem.cardid));
		} else {
			var id;
			var deathitem = rDeathList[d][1];
			if (Weapons[0].indexOf(deathitem) != -1) id = 0; else id = 1;
			// 触发亡语
			for (var i=0;i<deathitem.Deathrattle.length;i++){
				deathitem.Deathrattle[i]();
			}
			// 去除属性
			Heros[id].attack -= deathitem.attack;
			// 加入墓地
			Weapons[id].splice(Weapons[id].indexOf(deathitem), 1);
			cemetery[id].push(new Weapon(eval(deathitem.DBfrom)[deathitem.cardid], deathitem.DBfrom, deathitem.cardid))
		}
	}
}

function StartTurn(){
	Triggers = [];
	Trigger_1("StartTurnTrigger");
	Trigger_1("YourStartTurnTrigger", playid);
	Trigger_1("OpponetStartTurnTrigger", 1-playid);
	Trigger_2();
}

function EndTurn(){
	Triggers = [];
	Trigger_1("EndTurnTrigger");
	Trigger_1("YourEndTurnTrigger", playid);
	Trigger_1("OpponetEndTurnTrigger", 1-playid);
	Trigger_2();
	Reflash();
	StartTurn();
}

function Reflash(){
	playturn += 1
	playid = 1-playid
	if (playturn == 89){
		// 平局 exit
	}
	console.log("现在是你对手的回合了")
	// 清楚过期状态，例如冰箱嗜血
	for (var k=0;k<2;k++){
		for (var i=0;i<Minions[k].length;i++){
			if (Minions[k][i].reflash!=undefined)
			for (var j=0;j<Minions[k][i].reflash.length;j++){
				Minions[k][i].reflash[j](Minions[k][i]);
			}
			Minions[k][i].reflash = [];
		}
		if (Heros[k].reflash!=undefined)
		for (var i=0;i<Heros[k].reflash.length;i++){
			Heros[k].reflash[i](Heros[k]);
		}
		Heros[k].reflash = [];
		Heros[k].attack = 0;
		if (Weapons[k].length != 0 && k == playid){
			Heros[k].attack = Weapons[k].attack;
		}
	}
	// 重置本回合计数器
	DeathList = []
	UseCardsThisTurn = []
	DeathMinionsThisTurn = []
	ChogallBuff = false
	PreparationBuff = false
	KirinTorBuff = false
	if (MaxMana[playid] < 10){
		MaxMana[playid] += 1;
	}
	Overload[playid][0] = Overload[playid][1];
	Overload[playid][1] = 0;
	Mana[playid] = MaxMana[playid] - Overload[playid][0];
	Heros[playid].heropowerflag = true;
	for (var k=0;k<2;k++){
		for (var i=0;i<Minions[k].length;i++){
			Minions[k][i].exhaustion = false; // 疲惫状态
		}
		Heros[k].exhaustion = false;
	}
	for (var i=0;i<Minions[playid].length;i++){
		Minions[playid][i].attacktime = 1;
		if (Minions[playid][i].effect.indexOf("Windfury")!=-1){
			Minions[playid][i].attacktime += 1;
		}
		if (Minions[playid][i].effect.indexOf("Mega-Windfury")!=-1){
			Minions[playid][i].attacktime += 3;
		}
	}
	Heros[playid].attacktime = 1;
	if (Weapons[playid].length > 0){
		Heros[playid].attack = Weapons[playid][0].attack;
		if (Weapons[playid][0].effect.indexOf("Windfury")!=-1){
			Heros[playid].attacktime += 1;
		}
		if (Weapons[playid][0].effect.indexOf("Mega-Windfury")!=-1){
			Heros[playid].attacktime += 3;
		}
	}
}

function ChecksWiner(){
	if (DeathList.indexOf(Heros[0]) != -1 && DeathList.indexOf(Heros[1]) != -1){
		// 平局
	}
	if (DeathList.indexOf(Heros[0]) != -1){
		// 玩家1失败 玩家2胜利
	}
	if (DeathList.indexOf(Heros[1]) != -1){
		// 玩家1胜利 玩家2失败
	}
}

function RevealSecret(){
	Triggers = [];
	Trigger_1("RevealSecretTrigger");
	Trigger_1("YourRevealSecretTrigger", 1-playid);
	Trigger_1("OpponentRevealSecretTrigger", playid);
	Trigger_2();
	var RevealSecretTriggers = [];
}

function UseSpell(obj, src, tar=null){
	// 扣除费用
	if (obj.check(tar) == false){
		return false;
	}
	if (ChogallBuff && src==Heros[playid]){
		// 古加尔buff
		ChogallBuff = false;
		if (src.effect.indexOf("Immune")==-1 && src.health<=Math.Max(obj.cost, 0)){
			return false;
		}
		DealDamage(src, src, Math.Max(obj.cost, 0));
	} else{
		if (obj.cost>0)
			if (Mana[playid] >= obj.cost)
				Mana[playid] -= obj.cost;
			else
				return false;
	}
	if (PreparationBuff && src==Heros[playid]){
		// 伺机待发buff
		PreparationBuff = false;	
	}
	if (KirinTorBuff && src==Heros[playid] && obj.type.indexOf("Secret")!=-1){
		// 肯瑞托法师buff
		KirinTorBuff = false;
	}
	if (src == Heros[playid] && Secret[1-playid].indexOf("Counterspell")!=-1){
		// 触发法术反制
		RevealSecret();
		Secret[1-playid].splice(Secret[1-playid].indexOf("Counterspell"), 1);
		return;
	}
	// 龙人巫师
	Triggers = [];
	Trigger_1("YourSpellTargetTrigger", tar);
	Trigger_2([src]);

	// 扰咒术
	if (Heros[playid]==src && Secret[1-playid].indexOf("Spellbender")!=-1 && Minions[1-playid].length<7 && tar!=null){
		RevealSecret();
		tar = Summon(new Minion(Minions_ex_DB[5], "Minions_ex_DB", 5), 1-playid);
		Secret[1-playid].splice(Secret[1-playid].indexOf("Spellbender"),1);
	}
	// 法术效果执行
	obj.effect();

	// 法术施放后 狂野炎术师、火妖和西风灯神，待完成
	Triggers = []
	Trigger_1("AfterSpellTrigger");
	var id = -1;
	if (Heros[0] == src) id = 0;
	if (Heros[1] == src) id = 1;
	if (id != -1){
		Trigger_1("YourAfterSpellTrigger", id);
		Trigger_1("OpponentAfterSpellTrigger", 1-id);
	}
	Trigger_2([src, tar])
}

function PlayMinionsCheck(obj){
	// 判断费用是否足够
	if (SeadvilStingerBuff && obj.type.indexOf("Murloc")!=-1){
		// 海魔钉刺者buff
		if (Heros[playid].effect.indexOf("Immune")==-1 && Heros[playid].health<=Math.Max(obj.cost, 0)){
			return false;
		}
	} else {
		if (obj.cost > Mana[playid])
			return false;
	}
	return true;
}

function PlayMinions(obj, pos, tar){
	// 扣除费用
	if (PlayMinionsCheck(obj) == false) return false;
	if (SeadvilStingerBuff && obj.type.indexOf("Murloc")!=-1){
		SeadvilStingerBuff = false;
		DealDamage(Heros[playid], Heros[playid], Math.Max(obj.cost, 0));
	} else {
		Mana[playid] -= Math.max(obj.cost, 0);
	}
	// 将随从置入场内
	// 选择随从放置的位置
	// Get(pos);
	if (pos==undefined)
		pos = ChoosePos(playid);
	Hands[playid].splice(Hands[playid].indexOf(obj), 1);
	Minions[playid].splice(pos, 0, obj);
	if (obj.BattlecryCheck != undefined){
		// 选择战吼目标
		if (tar==undefined)
			tar = ChooseTar(playid, obj);
		if (obj.BattlecryCheck(tar, obj)==false)
			return false;
		obj.Battlecry(tar, src);
	}
	// 当打出一个随从
	Triggers = [];
	Trigger_1("PlayMinionsTrigger");
	Trigger_1("YourPlayMinionsTrigger", playid);
	Trigger_1("OpponentPlayMinionsTrigger", 1-playid);
	Trigger_2([obj]);
	Death();
	// 当召唤一个随从
	Triggers = [];
	Trigger_1("SummonTrigger");
	Trigger_1("YourSummonTrigger", playid);
	Trigger_1("OpponentSummonTrigger", 1-playid);
	Trigger_2([obj]);
	// 战吼
	if (obj.Battlecry != undefined){
		for (var i=0;i<obj.Battlecry.length;i++){
			obj.Battlecry[i](tar, obj);
			OngoingEffectReFlash();
		}
		// if (铜须Buff){
		// 	for (var i=0;i<obj.Battlecry.length;i++){
		// 		obj.Battlecry[i](tar);
		// 		OngoingEffectReFlash();
		// 	}
		// }
	}
	// 当打出一个随从后
	Triggers = [];
	Trigger_1("AfterPlayMinionsTrigger");
	Trigger_1("YourAfterPlayMinionsTrigger", playid);
	Trigger_1("OpponentAfterPlayMinionsTrigger", 1-playid);
	Trigger_2([obj])
	// 当召唤一个随从后
	Triggers = [];
	Trigger_1("AfterSummonMinionsTrigger");
	Trigger_1("YourSummonPlayMinionsTrigger", playid);
	Trigger_1("OpponentSummonPlayMinionsTrigger", 1-playid);
	Trigger_2([obj])
}

function UseCard(obj, pos=null, tar=null){
	if (obj.type == "Minion")
		return PlayMinions(obj, pos, tar);
	if (obj.type == "Spell")
		return UseSpell(obj, Heros[playid], tar);
	if (obj.type == "Weapon")
		return EquippingWeapon(obj, tar, playid, true);
	// if (obj.type == "Hero")
}

function Summon(obj, pos=-1, id=playid){
	if (pos == -1) pos=Minions[id].length;
	if (Minions[id].length >= 7) return false;
	Minions[id].splice(pos, 0, obj);
	Triggers = [];
	Trigger_1("SummonTrigger");
	Trigger_1("YourSummonTrigger", playid);
	Trigger_1("OpponentSummonTrigger", 1-playid);
	Trigger_2([obj]);
	OngoingEffectReFlash();
	Triggers = [];
	Trigger_1("AfterSummonMinionsTrigger");
	Trigger_1("YourSummonPlayMinionsTrigger", playid);
	Trigger_1("OpponentSummonPlayMinionsTrigger", 1-playid);
	Trigger_2([obj])
	OngoingEffectReFlash();
}

function OngoingEffectReFlash(){
	// 光环刷新
}

function AttackCheck(tar, src) {
	if (src.attack <= 0) return false;
	if (src.effect.indexOf("Can't attack")!=-1) return false;
	if (src.effect.indexOf("Freeze")!=-1) return false;
	if (Minions[playid].indexOf(src) == -1 && Heros[playid] != src) return false;
	if (Minions[1-playid].indexOf(tar) == -1 && Heros[1-playid] != tar) return false;
	if (src.attacktime <= 0) return false;
	if (tar.effect.indexOf("Immune")!=-1) return false;
	if (tar.effect.indexOf("Stealth")!=-1) return false;
	var Taunts = []
	for (var i=0;i<Minions[1-playid].length;i++){
		if (Minions[1-playid][i].effect.indexOf("Taunt")!=-1 && Minions[1-playid][i].effect.indexOf("Stealth")==-1){
			Taunts.push(Minions[1-playid][i]);
		}
	}
	if (Taunts.length > 0 && Taunts.indexOf(tar) == -1) return false;
	src.attacktime -= 1; // 愚者之灾[待完成]
	return true;
}

function Attack(tar, src){
	if (AttackCheck(tar, src) == false) return false;
	var Longbowflag = false;
	if (src.type.indexOf("Hero") && Weapons[src.type.indexOf("Hero")][0].name=="Gladiator\'s Longbow"){
		// 角斗士的长弓
		Longbowflag = true;
		src.type.indexOf("Hero").effect.push("Immune")
	}
	// 失去潜行
	if (src.type.indexOf("Stealth") != -1){
		src.type.splice(src.type.indexOf("Stealth"), 1)
	}
	// 攻击事件
	DealDamage(tar, src, src.attack);
	DealDamage(src, tar, tar.attack);
	if (Heros.indexOf(src)!=-1){
		var id = Heros.indexOf(src);
		if (Weapons[id].length >= 0){
			Weapons[id][0].durability -= 1;
		}
	}
}

function UseHeroPower(tar = null){
	if (Heros[playid].heropowerflag == false || Mana[playid]<Heros[playid].heropowercost) return false;
	if (Heros[playid].HeropowerCheck(tar) == false) return false;
	Heros[playid].heropowerflag = false;
	Mana[playid] -= Heros[playid].heropowercost;
	Heros[playid].heropower(tar);
	ChecksWiner();
}

function Restore(tar, src, num){
	// 奥金尼
	if (tar.health == tar.maxhealth) return;
	tar.health += num;
	if (tar.health >= tar.maxhealth)
		tar.health = tar.maxhealth;
	Triggers = [];
	Trigger_1("MinionsHealTrigger");
	Trigger_2([tar, src, num]);
}

function Choose(id, list, num = 1){
	
}

function mulligan(id, list){

}