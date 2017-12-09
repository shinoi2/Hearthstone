var Fatigue={0:0, 1:0, DealingDamageTrigger:[], play_index:0}, DeathList=[];
var ChogallBuff, PreparationBuff, KirinTorBuff;
var Weapons = [[], []];
var Mana = [0, 0], MaxMana = [0, 0];
var Heros, Deck, Hand=[[], []];
var Secret=[[], []];
var playturn, playid, play_index=0;
var cemetery = [[], []];
var discards = [[], []];
var Minions = [[], []];
var Overload = [[0,0], [0,0]]
var Deck;

function Game(Heroid1, Heroid2, Deck1, Deck2){
	Heros = [new Hero(Hero_DB[Heroid1]), new Hero(Hero_DB[Heroid2])];
	Deck = [[], []];
	// for (var i=0; i<30; i++){
	// 	Deck[0].push(Deck1[i]);
	// 	Deck[1].push(Deck2[i]);
	// }
	playid = Math.floor(Math.random()*2);
	playturn = 0;
	for (var i=0;i<3;i++){
		Drawcard(playid); 
	}
	for (var i=0;i<4;i++){
		Drawcard(1-playid);
	}
	// [待完成]调度
}

function Drawcard(id = playid) {
	if (Deck[id].length == 0){
		Fatigue[id] ++;
		DealDamage(Heros[id], Fatigue, Fatigue[id])
	} else {
		var c = Math.floor(Math.random()*Deck[id].length);
		if (Hand[id].length == 10){
			Deck[id].splice(c,1);
		} else {
			Hand[id].push(Deck[id].splice(c,1));
			var DrawTriggers = [];
			for (var i=0; i<Minions[id]; i++) {
				for (var j=0; j<Minions[id][i].WhenYourDrawcardTrigger.length;j++){
					DrawTriggers.push([Minions[id][i].play_index, Minions[id][i].WhenYourDrawcardTrigger[j]])
				}
			}
			for (var i=0; i<Minions[id]; i++) {
				for (var j=0; j<Minions[id][i].WhenOpponentDrawcardTrigger.length;j++){
					DrawTriggers.push([Minions[id][i].play_index, Minions[id][i].WhenOpponentDrawcardTrigger[j]])
				}
			}
			DrawTriggers = DrawTriggers.sort();
			for (var i=0; i<DrawTriggers.length; i++) {
				DrawTriggers[i][1]();
			}
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

	var Damagetriggers = [];
	// 受到伤害扳机
	for (var i=0;i<tar.TakeDamageTrigger.length;i++) {
		Damagetriggers.push([tar.play_index, tar.TakeDamageTrigger[i]])
	}
	// 造成伤害扳机
	for (var i=0;i<src.DealingDamageTrigger.length;i++)
		Damagetriggers.push([src.play_index, src.DealingDamageTrigger[i]]);
	// 友方随从受到伤害扳机
	var id;
	if (Minions[0].indexOf(tar) == 0) id = 0; else id = 1;
	for (var i=0;i<Minions[id].length;i++) {
		for (var j=0;j<Minions[id][i].FriendlyTakeDamageTrigger.length;j++){
			Damagetriggers.push([Minions[id][i].play_index, Minions[id][i].FriendlyTakeDamageTrigger[j]]);
		}
	}
	// 随从受到伤害扳机
	for (var id=0;id<2;id++) {
		for (var i=0;i<Minions[id].length;i++) {
			for (var j=0;j<Minions[id][i].MinionsTakeDamageTrigger.length;j++){
				Damagetriggers.push([Minions[id][i].play_index, Minions[id][i].MinionsTakeDamageTrigger[j]]);
			}
		}
	}
	// 扳机排序
	Damagetriggers = Damagetriggers.sort();
	for (var i=0;i<Damagetriggers;i++) {
		Damagetriggers[i](tar, src, num);
	}
	// 实际造成伤害
	if (Heros.indexOf(tar)!=-1) {
		// 护甲
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
	var GainArmorTriggers = []
	for (var i=0;i<Minions[id].length;i++){
		for (var j=0;j<Minions[id][i].GainArmorTrigger.length;j++){
			GainArmorTriggers.push(Minions[id].play_index, Minions[id][i].GainArmorTrigger[j]);
		}
	}
	GainArmorTriggers = GainArmorTriggers.sort()
	for (var i=0;i<GainArmorTriggers;i++){
		GainArmorTriggers[i]();
	}
	tar.armor += num;
}

function EquippingWeapon(obj, tar=null, src=playid){
	Weapons[src].push(obj);
	for (var i=0;i<obj.Battlecry.length;i++){
		obj.Battlecry[i](tar);
	}
	for (var i=0;i<Minions[src].length;i++){
		for (var j=0;j<Minions[src][i].EquippingWeaponTrigger.length;j++){
			Minions[src].EquippingWeaponTrigger[j](obj);
		}
	}
	if (src == playid){
		Heros[src].attack += obj.attack;
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
	if (DeathList.length == 0) return false;
	for (var d=0; d<DeathList.length; d++){
		if (DeathList[d][1].type.indexOf("Minions")){
			// 移除随从
			var id;
			var deathitem = DeathList[d][1];
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
			// 移除武器
			var id;
			var deathitem = DeathList[d][1];
			if (Weapons[0].indexOf(deathitem) != -1) id = 0; else id = 1;
			Weapons[id].splice(Weapons[id].indexOf(deathitem), 1);
			// 触发亡语
			for (var i=0;i<deathitem.Deathrattle.length;i++){
				deathitem.Deathrattle[i]();
			}
			// 去除属性
			Heros[id].attack -= Weapons.attack;
			// 加入墓地
			cemetery[id].push(new Weapon(eval(deathitem.DBfrom)[deathitem.cardid], deathitem.DBfrom, deathitem.cardid))
		}
	}
}

function StartTurn(){
	var StartTurnTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].StartTurnTrigger.length;j++){
			StartTurnTriggers.push([Minions[0][i].play_index, Minions[0][i].StartTurnTrigger[j], Minions[0][i]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].StartTurnTrigger.length;j++){
			StartTurnTriggers.push([Minions[1][i].play_index, Minions[1][i].StartTurnTrigger[j], Minions[0][i]])
		}
	}
	for (var i=0;i<Minions[playid].length;i++){
		for (var j=0;j<Minions[playid][i].YourStartTurnTrigger.length;j++){
			StartTurnTriggers.push([Minions[playid][i].play_index, Minions[playid][i].YourStartTurnTrigger[j], Minions[playid][i]])
		}
	}
	for (var i=0;i<Minions[1-playid].length;i++){
		for (var j=0;j<Minions[1-playid][i].OpponentStartTurnTrigger.length;j++){
			StartTurnTriggers.push([Minions[1-playid][i].play_index, Minions[1-playid][i].OpponentStartTurnTrigger[j], Minions[playid][i].play_index])
		}
	}
	for (var i=0;i<Secret[playid].length;i++){
		if (Secret[playid][i].name == "Competitive Spirit"){
			// 争强好胜
			StartTurnTriggers.push([Secret[playid][i].play_index, Secret[playid][i].effect, Secret[playid][i]])
		}
	}
	StartTurnTriggers = StartTurnTriggers.sort()
	for (var i=0;i<StartTurnTriggers.length;i++){
		StartTurnTriggers[i][1](StartTurnTriggers[i][2]);
	}
}

function EndTurn(){
	var EndTurnTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].EndTurnTrigger.length;j++){
			EndTurnTriggers.push([Minions[0][i].play_index, Minions[0][i].EndTurnTrigger[j], Minions[0][i]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].EndTurnTrigger.length;j++){
			EndTurnTriggers.push([Minions[1][i].play_index, Minions[1][i].EndTurnTrigger[j], Minions[1][i]])
		}
	}
	for (var i=0;i<Minions[playid].length;i++){
		for (var j=0;j<Minions[playid][i].YourEndTurnTrigger.length;j++){
			EndTurnTriggers.push([Minions[playid][i].play_index, Minions[playid][i].YourEndTurnTrigger[j], Minions[playid][i]])
		}
	}
	for (var i=0;i<Minions[1-playid].length;i++){
		for (var j=0;j<Minions[1-playid][i].OpponentEndTurnTrigger.length;j++){
			EndTurnTriggers.push([Minions[1-playid][i].play_index, Minions[1-playid][i].OpponentEndTurnTrigger[j], Minions[1-playid][i]])
		}
	}
	EndTurnTriggers = EndTurnTriggers.sort()
	for (var i=0;i<EndTurnTriggers.length;i++){
		EndTurnTriggers[i][1](EndTurnTriggers[i][2]);
	}
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
			for (var j=0;j<Minions[k][i].reflash.length;j++){
				Minions[k][i].reflash[j](Minions[k][i]);
			}
			Minions[k][i].reflash = [];
		}
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
	var RevealSecretTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].RevealSecretTrigger.length;j++){
			RevealSecretTriggers.push([Minions[0][i].play_index, Minions[0][i].RevealSecretTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].RevealSecretTrigger.length;j++){
			RevealSecretTriggers.push([Minions[1][i].play_index, Minions[1][i].RevealSecretTrigger[j]])
		}
	}
	for (var i=0;i<Minions[playid].length;i++){
		for (var j=0;j<Minions[playid][i].YourRevealSecretTrigger.length;j++){
			RevealSecretTriggers.push([Minions[playid][i].play_index, Minions[playid][i].YourRevealSecretTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1-playid].length;i++){
		for (var j=0;j<Minions[1-playid][i].OpponentRevealSecretTrigger.length;j++){
			RevealSecretTriggers.push([Minions[1-playid][i].play_index, Minions[1-playid][i].OpponentRevealSecretTrigger[j]])
		}
	}
	RevealSecretTriggers = RevealSecretTriggers.sort()
	for (var i=0;i<RevealSecretTriggers.length;i++){
		RevealSecretTriggers[i][1]();
	}
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
	var UseSpellTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].UseSpellTrigger.length;j++){
			UseSpellTriggers.push([Minions[0][i].play_index, Minions[0][i].UseSpellTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].UseSpellTrigger.length;j++){
			UseSpellTriggers.push([Minions[1][i].play_index, Minions[1][i].UseSpellTrigger[j]])
		}
	}
	for (var i=0;i<Minions[playid].length;i++){
		for (var j=0;j<Minions[playid][i].YourUseSpellTrigger.length;j++){
			UseSpellTriggers.push([Minions[playid][i].play_index, Minions[playid][i].YourUseSpellTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1-playid].length;i++){
		for (var j=0;j<Minions[1-playid][i].OpponentUseSpellTrigger.length;j++){
			UseSpellTriggers.push([Minions[1-playid][i].play_index, Minions[1-playid][i].OpponentUseSpellTrigger[j]])
		}
	}
	UseSpellTriggers = UseSpellTriggers.sort()
	for (var i=0;i<UseSpellTriggers.length;i++){
		UseSpellTriggers[i][1](obj);
	}
	if (src == Heros[playid] && Secret[1-playid].indexOf("Counterspell")!=-1){
		// 触发法术反制
		RevealSecret();
		Secret[1-playid].splice(Secret[1-playid].indexOf("Counterspell"), 1);
		return;
	}
	if (src == Heros[playid] && Minions[playid].indexOf(tar) != -1){
		// 龙人巫师、黑暗邪使艾蒂丝和光明邪使菲奥拉
		tar.YourSpellTargetTrigger();
	}
	if (Heros[playid]==src && Secret[1-playid].indexOf("Spellbender")!=-1 && Minions[1-playid].length<7 && tar!=null){
		// 扰咒术
		RevealSecret();
		tar = Summon(new Minion(Minions_ex_DB[5], "Minions_ex_DB", 5), 1-playid);
		Secret[1-playid].splice(Secret[1-playid].indexOf("Spellbender"),1);
	}
	if (tar!=null) obj.effect(tar, src); else obj.effect(tar, src);
	// 法术施放后 狂野炎术师、火妖和西风灯神
	var AfterSpellTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].AfterSpellTrigger.length;j++){
			AfterSpellTriggers.push([Minions[0][i].play_index, Minions[0][i].AfterSpellTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].AfterSpellTrigger.length;j++){
			AfterSpellTriggers.push([Minions[1][i].play_index, Minions[1][i].AfterSpellTrigger[j]])
		}
	}
	for (var i=0;i<Minions[playid].length;i++){
		for (var j=0;j<Minions[playid][i].YourAfterSpellTrigger.length;j++){
			AfterSpellTriggers.push([Minions[playid][i].play_index, Minions[playid][i].YourAfterSpellTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1-playid].length;i++){
		for (var j=0;j<Minions[1-playid][i].OpponentAfterSpellTrigger.length;j++){
			AfterSpellTriggers.push([Minions[1-playid][i].play_index, Minions[1-playid][i].OpponentAfterSpellTrigger[j]])
		}
	}
	// [待完成] 西风灯神
	AfterSpellTriggers = AfterSpellTriggers.sort()
	for (var i=0;i<AfterSpellTriggers.length;i++){
		AfterSpellTriggers[i][1]();
	}
}

function PlayMinions(obj, pos, tar=null){
	if (obj.check(tar) == false){
		return false;
	}
	// 扣除费用
	if (SeadvilStingerBuff && obj.type.indexOf("Murloc")!=-1){
		// 海魔钉刺者buff
		if (src.effect.indexOf("Immune")==-1 && src.health<=Math.Max(obj.cost, 0)){
			return false;
		}
		SeadvilStingerBuff = false;
		DealDamage(Heros[playid], Heros[playid], Math.Max(obj.cost, 0));
	} else {
		if (obj.cost>0)
			if (Mana[playid] >= obj.cost)
				Mana[playid] -= obj.cost;
			else
				return false;
	}
	// Play Minions Trigger
	var PlayMinionsTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].PlayMinionsTrigger.length;j++){
			PlayMinionsTriggers.push([Minions[0][i].play_index, Minions[0][i].PlayMinionsTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].PlayMinionsTrigger.length;j++){
			PlayMinionsTriggers.push([Minions[1][i].play_index, Minions[1][i].PlayMinionsTrigger[j]])
		}
	}
	for (var i=0;i<Minions[playid].length;i++){
		for (var j=0;j<Minions[playid][i].YourPlayMinionsTrigger.length;j++){
			PlayMinionsTriggers.push([Minions[playid][i].play_index, Minions[playid][i].YourPlayMinionsTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1-playid].length;i++){
		for (var j=0;j<Minions[1-playid][i].OpponentPlayMinionsTrigger.length;j++){
			PlayMinionsTriggers.push([Minions[1-playid][i].play_index, Minions[1-playid][i].OpponentPlayMinionsTrigger[j]])
		}
	}
	PlayMinionsTriggers = PlayMinionsTriggers.sort()
	for (var i=0;i<PlayMinionsTriggers.length;i++){
		PlayMinionsTriggers[i][1]();
	}
	Death();
	// Summon Minions Trigger
	var SummonTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].SummonTrigger.length;j++){
			SummonTriggers.push([Minions[0][i].play_index, Minions[0][i].SummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].SummonTrigger.length;j++){
			SummonTriggers.push([Minions[1][i].play_index, Minions[1][i].SummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[playid].length;i++){
		for (var j=0;j<Minions[playid][i].YourSummonTrigger.length;j++){
			SummonTriggers.push([Minions[playid][i].play_index, Minions[playid][i].YourSummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1-playid].length;i++){
		for (var j=0;j<Minions[1-playid][i].OpponentSummonTrigger.length;j++){
			SummonTriggers.push([Minions[1-playid][i].play_index, Minions[1-playid][i].OpponentSummonTrigger[j]])
		}
	}
	SummonTriggers = SummonTriggers.sort()
	for (var i=0;i<SummonTriggers.length;i++){
		SummonTriggers[i][1](obj);
	}
	// Battlecry
	for (var i=0;i<obj.Battlecry.length;i++){
		obj.Battlecry[i](tar);
		OngoingEffectReFlash();
		// 铜须[待完成]
	}
	// After Play Trigger
	var AfterPlayMinionsTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].AfterPlayMinionsTrigger.length;j++){
			AfterPlayMinionsTriggers.push([Minions[0][i].play_index, Minions[0][i].AfterPlayMinionsTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].AfterPlayMinionsTrigger.length;j++){
			AfterPlayMinionsTriggers.push([Minions[1][i].play_index, Minions[1][i].AfterPlayMinionsTrigger[j]])
		}
	}
	for (var i=0;i<Minions[playid].length;i++){
		for (var j=0;j<Minions[playid][i].YourAfterPlayMinionsTrigger.length;j++){
			AfterPlayMinionsTriggers.push([Minions[playid][i].play_index, Minions[playid][i].YourAfterPlayMinionsTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1-playid].length;i++){
		for (var j=0;j<Minions[1-playid][i].OpponentAfterPlayMinionsTrigger.length;j++){
			AfterPlayMinionsTriggers.push([Minions[1-playid][i].play_index, Minions[1-playid][i].OpponentAfterPlayMinionsTrigger[j]])
		}
	}
	for (var i=0;i<Secret[1-playid].length;i++){
		if (Secret[1-playid][i].name="Mirror Entity" || 
			Secret[1-playid][i].name=="Repentance" || 
			Secret[1-playid][i].name=="Snipe" ||
			Secret[1-playid][i].name=="Potion of Polymorph"){
			AfterPlayMinionsTriggers.push([Secret[1-playid][i].play_index, Secret[1-playid][i].effect]);
		}
	}
	AfterPlayMinionsTriggers = AfterPlayMinionsTriggers.sort(obj)
	for (var i=0;i<AfterPlayMinionsTriggers.length;i++){
		AfterPlayMinionsTriggers[i][1](obj);
	}
	// After Summon Trigger
	var AfterSummonTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].AfterSummonTrigger.length;j++){
			AfterSummonTriggers.push([Minions[0][i].play_index, Minions[0][i].AfterSummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].AfterSummonTrigger.length;j++){
			AfterSummonTriggers.push([Minions[1][i].play_index, Minions[1][i].AfterSummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[playid].length;i++){
		for (var j=0;j<Minions[playid][i].YourAfterSummonTrigger.length;j++){
			AfterSummonTriggers.push([Minions[playid][i].play_index, Minions[playid][i].YourAfterSummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1-playid].length;i++){
		for (var j=0;j<Minions[1-playid][i].OpponentAfterSummonTrigger.length;j++){
			AfterSummonTriggers.push([Minions[1-playid][i].play_index, Minions[1-playid][i].OpponentAfterSummonTrigger[j]])
		}
	}
	AfterSummonTriggers = AfterSummonTriggers.sort()
	for (var i=0;i<AfterSummonTriggers.length;i++){
		AfterSummonTriggers[i][1](obj);
	}
}

function Summon(obj, pos=-1, id=playid){
	// 召唤一个随从
	if (pos == -1) pos=Minions[id].length;
	if (Minions[id].length >= 7) return;
	Minions[id].splice(pos, 0, obj);
	var SummonTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].SummonTrigger.length;j++){
			SummonTriggers.push([Minions[0][i].play_index, Minions[0][i].SummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].SummonTrigger.length;j++){
			SummonTriggers.push([Minions[1][i].play_index, Minions[1][i].SummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[id].length;i++){
		for (var j=0;j<Minions[id][i].YourSummonTrigger.length;j++){
			SummonTriggers.push([Minions[id][i].play_index, Minions[id][i].YourSummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1-id].length;i++){
		for (var j=0;j<Minions[1-id][i].OpponentSummonTrigger.length;j++){
			SummonTriggers.push([Minions[1-id][i].play_index, Minions[1-id][i].OpponentSummonTrigger[j]])
		}
	}
	SummonTriggers = SummonTriggers.sort()
	for (var i=0;i<SummonTriggers.length;i++){
		SummonTriggers[i](obj);
	}
	OngoingEffectReFlash();
	var AfterSummonTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].AfterSummonTrigger.length;j++){
			AfterSummonTriggers.push([Minions[0][i].play_index, Minions[0][i].AfterSummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].AfterSummonTrigger.length;j++){
			AfterSummonTriggers.push([Minions[1][i].play_index, Minions[1][i].AfterSummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[id].length;i++){
		for (var j=0;j<Minions[id][i].YourAfterSummonTrigger.length;j++){
			AfterSummonTriggers.push([Minions[id][i].play_index, Minions[id][i].YourAfterSummonTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1-id].length;i++){
		for (var j=0;j<Minions[1-id][i].OpponentAfterSummonTrigger.length;j++){
			AfterSummonTriggers.push([Minions[1-id][i].play_index, Minions[1-id][i].OpponentAfterSummonTrigger[j]])
		}
	}
	for (var i=0;i<Heros[id].YourAfterSummonTrigger.length;i++){
		AfterSummonTriggers.push([0, Heros[id].YourAfterSummonTrigger[i]]);
	}
	AfterSummonTriggers = AfterSummonTriggers.sort()
	for (var i=0;i<AfterSummonTriggers.length;i++){
		AfterSummonTriggers[i][1](obj);
	}
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
	if (AttackCheck(tar, src) == false) {
		return false;
	}
	var Longbowflag = false;
	if (src.type.indexOf("Hero") && Weapons[src.type.indexOf("Hero")][0].name=="Gladiator\'s Longbow"){
		// 角斗士的长弓
		Longbowflag = true;
		src.type.indexOf("Hero").effect.push("Immune")
	}
	// 攻击前事件
	var BeforAttackTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].BeforAttackTrigger.length;j++){
			BeforAttackTriggers.push([Minions[0][i].play_index, Minions[0][i].BeforAttackTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].BeforAttackTrigger.length;j++){
			BeforAttackTriggers.push([Minions[1][i].play_index, Minions[1][i].BeforAttackTrigger[j]])
		}
	}
	BeforAttackTriggers = BeforAttackTriggers.sort()
	for (var i=0;i<BeforAttackTriggers.length;i++){
		BeforAttackTriggers[i][1](tar, src);
	}
	// 失去潜行
	if (src.type.indexOf("Stealth") != -1){
		src.type.splice(src.type.indexOf("Stealth"), 1)
	}
	// 攻击事件
	for (var i=0;i<src.AttackTrigger.length;i++)
		src.AttackTrigger[i](tar, src);
	if (src.effect.indexOf("Hero") != -1 && Weapons[src.effect.indexOf("Hero")].length != 0 && Weapons[src.effect.indexOf("Hero")][0].effect.indexOf("Immune") == -1){
		Weapons[src.effect.indexOf("Hero")][0].durability -= 1;
	}
	DealDamage(tar, src, src.attack);
	DealDamage(src, tar, tar.attack);
	if (Heros.indexOf(src)!=-1){
		var id = Heros.indexOf(src);
		if (Weapons[id].length >= 0){
			Weapons[id][0].durability -= 1;
		}
	}
	// 攻击后事件
	for (var i=0;i<src.AfterAttackTrigger.length;i++)
		src.AfterAttackTrigger[i](tar, src);
	if (src.effect.indexOf("Hero") != -1 && Weapons[src.effect.indexOf("Hero")].length != 0 && Weapons[src.effect.indexOf("Hero")][0].effect.indexOf("Immune") == -1){
		Weapons[src.effect.indexOf("Hero")][0].durability -= 1;
	}
	// 捕熊陷阱
	for (var i=0; i<Secret[1-playid].length; i++){
		if (Secret[1-playid][i].name == "Bear Trap" && src == Heros[1-playid] && Minions[1-playid].length<7){
			Secret[1-playid][i].effect(1-playid);
		}
	}
}

function UseHeroPower(tar = null){
	if (Heros[playid].heropowerflag == false || Mana[playid]<Heros[playid].heropowercost){
		return false;
	}
	if (Heros[playid].HeropowerCheck(tar) == false){
		return false;
	}
	Heros[playid].heropowerflag = false;
	Mana[playid] -= Heros[playid].heropowercost; // 击剑
	Heros[playid].heropower(tar);
	// 激励 Inspire
	ChecksWiner();
}

function Restore(tar, src, num){
	// [待修复]
	tar.health += num;
	if (tar.health >= tar.maxhealth) 
		tar.health = tar.maxhealth
}