var Hero, Deck, playid, Fatigue={0:0, 1:0, DealingDamageTrigger:[], play_index:0}, DeathList=[];
var ChogallBuff, PreparationBuff, KirinTorBuff;
function Game(Heroid1, Heroid2, Deck1, Deck2){
	Hero = [new Hero(Heroid1), new Hero(Heroid1)];
	Deck = [[], []];
	Fatigue = [0,0,]
	for (var i=0; i<30; i++){
		Deck[0].push(Deck1[i]);
		Deck[1].push(Deck2[i]);
	}
	playid = Math.floor(Math.random()*2);
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
		DealDamage(Hero[id], Fatigue, Fatigue[id])
	} else {
		var c = Math.floor(Math.random()*Deck[id].length);
		if (Hand[id].length == 10){
			Deck[id].splice(c,1);
		} else {
			Hand.push(Deck[id].splice(c,1));
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

	if (Hero.indexOf(tar) != -1) {
		var id = Hero.indexOf(tar);
		for (var i=0;i<Minions[id].length;i++){
			if (Minions[id][i].effect.indexOf("Your hero can only take 1 damage at a time.")){
				num = 1;
			}
		}
		var PerDamage = -1;
		for (var i=0;i<Minions[id].length;i++) {
			if (Minions[id][i].effect.indexOf("Whenever your hero takes damage, this minion takes it instead.")){
				if (play_index > PerDamage){
					PerDamage = play_index;
					tar = Minions[id][i];
				}
			}
		}
		if (id != playid) {
			if (var i=0;i<Secret[id];i++){
				if (Secret[id][i].name == "Ice Block"){
				if (play_index > PerDamage){
					PerDamage = play_index;
					//触发冰箱
					RevealSecret();
					tar = Hero[id];
					Secret[id][i].splice(id,1);
					Hero[id].effect.push("Immune");
					Hero[id].reflash.push(function(){this.effect.splice(this.effect.indexOf("Immune"), 1)})
					return;
				}
			}
		}
	}

	var Damagetriggers = [];
	// 受到伤害扳机
	for (var i=0;i<tar.TakeDamageTrigger.length;i++){
		Damagetriggers.push([tar.play_index, tar.TakeDamageTrigger[i]])
	}
	// 造成伤害扳机
	for (var i=0;i<src.DealingDamageTrigger.length;i++)
		Damagetriggers.push([src.play_index, src.DealingDamageTrigger[i]]);
	// 友方随从受到伤害扳机
	var id;
	if (Minions[0].indexOf(tar) != 0) id = 0 else id = 1;
	for (var i=0;i<Minions[id].length;i++){
		for (var j=0;j<Minions[id][i].FriendlyTakeDamageTrigger.length;j++){
			Damagetriggers.push([Minions[id][i].play_index, Minions[id][i].FriendlyTakeDamageTrigger[j]]);
	}
	// 随从受到伤害扳机
	for (var id=0;id<2;id++){
		for (var i=0;i<Minions[id].length;i++){
			for (var j=0;j<Minions[id][i].MinionsTakeDamageTrigger.length;j++){
				Damagetriggers.push([Minions[id][i].play_index, Minions[id][i].MinionsTakeDamageTrigger[j]]);
			}
		}
	}
	// 扳机排序
	Damagetriggers = Damagetriggers.sort();
	for (var i=0;i<Damagetriggers;i++){
		Damagetriggers[i](tar, src, num);
	}
	// 实际造成伤害
	if (Hero.indexOf(tar)!=0){
		// 护甲
		tar.Armor -= num;
		if (tar.Armor < 0){
			tar.health += tar.Armor;
			tar.Armor = 0;
		}
	} else {
		tar.health -= num;
	}
}

function GainArmor(tar, num) {
	var id = Hero.indexOf(tar);
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
	tar.Armor += num;
}

function EquippingWeapon(obj, tar=null, src=playid){
	// 把武器的触发器加入到英雄里去
	Hero[src].Weapon = obj;
	Hero[src].OngoingEffect = Hero[src].OngoingEffect.concat(obj.OngoingEffect)
	Hero[src].AttackTrigger = Hero[src].AttackTrigger.concat(obj.AttackTrigger)
	Hero[src].AfterAttackTrigger = Hero[src].AfterAttackTrigger.concat(obj.AfterAttackTrigger)
	Hero[src].DealingDamageTrigger = Hero[src].DealingDamageTrigger.concat(obj.DealingDamageTrigger)
	Hero[src].DealingDamageTrigger = Hero[src].DealingDamageTrigger.concat(obj.DealingDamageTrigger)
	Hero[src].AfterSummonTrigger = Hero[src].AfterSummonTrigger.concat(obj.AfterSummonTrigger)
	Hero[src].TakeDamageTrigger = Hero[src].TakeDamageTrigger.concat(obj.TakeDamageTrigger)
	// 触发战吼
	for (var i=0;i<obj.Battlecry.length;i++){
		obj.Battlecry[i](tar);
	}
	// 装备武器的触发器，例如绣水海盗
	var EquippingWeaponTriggers = []
	for (var i=0;i<Minions[src].length;i++){
		for (var j=0;j<Minions[src].EquippingWeaponTrigger.length;j++){
			EquippingWeaponTriggers.push([Minions[src].play_index, Minions[src].EquippingWeaponTrigger[j]]);
		}
	}
	EquippingWeaponTriggers = EquippingWeaponTriggers.sort();
	for (var i=0;i<EquippingWeaponTriggers.length();i++){
		EquippingWeaponTriggers[i](Hero[src].Weapon);
	}
	// 把武器标记未待摧毁状态
	DeathList.push([Hero[src].Weapon.play_index, Hero[src].Weapon]);
	// 更新英雄攻击力
	if (playid == src){
		Hero[src].attack += obj.attack;
	}
}

function Death(){
	DeathList = DeathList.sort();
}

function StartTurn(){
	var StartTurnTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].StartTurnTrigger.length;j++){
			StartTurnTriggers.push([Minions[0][i].play_index, Minions[0][i].StartTurnTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].StartTurnTrigger.length;j++){
			StartTurnTriggers.push([Minions[1][i].play_index, Minions[1][i].StartTurnTrigger[j]])
		}
	}
	for (var i=0;i<Minions[playid].length;i++){
		for (var j=0;j<Minions[playid][i].StartYourTurnTrigger.length;j++){
			StartTurnTriggers.push([Minions[playid][i].play_index, Minions[playid][i].StartYourTurnTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1-playid].length;i++){
		for (var j=0;j<Minions[1-playid][i].StartOpponentTurnTrigger.length;j++){
			StartTurnTriggers.push([Minions[1-playid][i].play_index, Minions[1-playid][i].StartOpponentTurnTrigger[j]])
		}
	}
	for (var i=0;i<Secret[playid].length;i++){
		if (Secret[playid][i].name == "Competitive Spirit"){
			// 争强好胜
			StartTurnTriggers.push([Secret[playid][i].play_index, Secret[playid][i].effect])
		}
	}
	StartTurnTriggers = StartTurnTriggers.sort()
	for (var i=0;i<StartTurnTriggers.length;i++){
		StartTurnTriggers[i]();
	}
}

function EndTurn(){
	var EndTurnTriggers = [];
	for (var i=0;i<Minions[0].length;i++){
		for (var j=0;j<Minions[0][i].EndTurnTrigger.length;j++){
			EndTurnTriggers.push([Minions[0][i].play_index, Minions[0][i].EndTurnTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1].length;i++){
		for (var j=0;j<Minions[1][i].EndTurnTrigger.length;j++){
			EndTurnTriggers.push([Minions[1][i].play_index, Minions[1][i].EndTurnTrigger[j]])
		}
	}
	for (var i=0;i<Minions[playid].length;i++){
		for (var j=0;j<Minions[playid][i].YourEndTurnTrigger.length;j++){
			EndTurnTriggers.push([Minions[playid][i].play_index, Minions[playid][i].YourEndTurnTrigger[j]])
		}
	}
	for (var i=0;i<Minions[1-playid].length;i++){
		for (var j=0;j<Minions[1-playid][i].OpponentEndTurnTrigger.length;j++){
			EndTurnTriggers.push([Minions[1-playid][i].play_index, Minions[1-playid][i].OpponentEndTurnTrigger[j]])
		}
	}
	EndTurnTriggers = EndTurnTriggers.sort()
	for (var i=0;i<EndTurnTriggers.length;i++){
		EndTurnTriggers[i]();
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
				reflash[k][i].reflash[j];
			}
		}
	}
	// 重置本回合计数器
	UseCardsThisTurn = []
	DeathMinionsThisTurn = []
	ChogallBuff = false
	PreparationBuff = false
	KirinTorBuff = false
	if (MaxMana < 10){
		MaxMana += 1;
	}
	Mana = MaxMana;
	Hero[playid].HeroPowerFlag = true;
	for (var k=0;k<2;k++){
		for (var i=0;i<Minions[k].length;i++){
			Minions[k][i].exhaustion = false; // 疲惫状态
		}
		Hero[k].exhaustion = false;
	}
}

function ChecksWiner(){
	if (DeathList.indexOf(Hero[0]) != -1 && DeathList.indexOf(Hero[1]) != -1){
		// 平局
	}
	if (DeathList.indexOf(Hero[0]) != -1){
		// 玩家1失败 玩家2胜利
	}
	if (DeathList.indexOf(Hero[1]) != -1){
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
		RevealSecretTriggers[i]();
	}
}

function UseSpell(obj, src, tar=null){
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
		UseSpellTriggers[i](obj);
	}
	if (src == Hero[playid] && Secret[1-playid].indexOf("Counterspell")!=-1){
		// 触发法术反制
		RevealSecret();
		Secret[1-playid].splice(Secret[1-playid].indexOf("Counterspell"), 1);
		return;
	}
	// 扣除费用
	if (ChogallBuff && src==Hero[playid]){
		// 古加尔buff
		DealDamage(src, src, obj.cost);
		ChogallBuff = false;
	} else{
		if (obj.cost>0)
			Hero[playid].Mana -= obj.cost;
	}
	if (PreparationBuff && src==Hero[playid]){
		// 伺机待发buff
		PreparationBuff = false;	
	}
	if (KirinTorBuff && src==Hero[playid] && obj.type.indexOf("Secret")!=-1){
		// 肯瑞托法师buff
		KirinTorBuff = false;
	}
	if (src == Hero[playid] && Minions[playid].indexOf(tar) != -1){
		// 龙人巫师、黑暗邪使艾蒂丝和光明邪使菲奥拉
		tar.YourSpellTargetTrigger();
	}
	if (Hero[playid]==src && Secret[1-playid].indexOf("Spellbender")!=-1 && Minions[1-playid].length<7 && tar!=null){
		// 扰咒术
		RevealSecret();
		tar = Summon(New Minions(Minions_ex_DB[5]), 1-playid);
		Secret[1-playid].splice(Secret[1-playid].indexOf("Spellbender"),1);
	}
	if (tar!=null) obj.effect(tar, src) else obj.effect(tar, src);
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
		AfterSpellTriggers[i]();
	}
}

function PlayMinions(){
	// 打出一个随从
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
	for (var i=0;i<Hero[id].YourSummonTrigger.length;i++){
		SummonTriggers.push([0, Hero[id].YourSummonTrigger[i]]);
	}
	SummonTriggers = SummonTriggers.sort()
	for (var i=0;i<SummonTriggers.length;i++){
		SummonTriggers[i]();
	}
}