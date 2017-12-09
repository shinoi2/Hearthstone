function Minion(obj, DBfrom, cardid){
	this.DBfrom = DBfrom;
	this.cardid = cardid;
	this.name = obj.name;
	this.maxhealth = obj.health;
	this.attack = obj.attack;
	this.health = this.maxhealth;
	this.cost = obj.cost;
	this.type = ["Minion"];
	this.reflash = [];
	this.rarity = null;
	if (obj.rarity != undefined) this.rarity = obj.rarity;
	play_index += 1;
	this.play_index = play_index;
	if (obj.type != undefined)
		this.type.concat(obj.type);
	this.effect = obj.effect==undefined ? [] : obj.effect;
	this.exhaustion = true;
	this.attacktime = 0;
	if (this.effect.indexOf("Charge") != -1) {
		this.exhaustion = false;
		this.attacktime = 1;
		if (this.effect.indexOf("Windfury") != -1){
			this.attacktime += 1;
		}
		if (this.effect.indexOf("Mega-Windfury") != -1){
			this.attacktime += 3;
		}
	}
	this.Battlecry = obj.Battlecry==undefined ? [] : obj.Battlecry;
	this.Deathrattle = obj.Deathrattle==undefined ? [] : obj.Deathrattle;
	this.check = obj.check==undefined ? [] : obj.check;
	this.StartTurnTrigger = obj.StartTurnTrigger==undefined ? [] : obj.StartTurnTrigger;
	this.YourStartTurnTrigger = obj.YourStartTurnTrigger==undefined ? [] : obj.YourStartTurnTrigger;
	this.OpponentStartTurnTrigger = obj.OpponentStartTurnTrigger==undefined ? [] : obj.OpponentStartTurnTrigger;
	this.EndTurnTrigger = obj.EndTurnTrigger==undefined ? [] : obj.EndTurnTrigger;
	this.YourEndTurnTrigger = obj.YourEndTurnTrigger==undefined ? [] : obj.YourEndTurnTrigger;
	this.OpponentEndTurnTrigger = obj.OpponentEndTurnTrigger==undefined ? [] : obj.OpponentEndTurnTrigger;
	this.RevealSecretTrigger = obj.RevealSecretTrigger==undefined ? [] : obj.RevealSecretTrigger;
	this.YourRevealSecretTrigger = obj.YourRevealSecretTrigger==undefined ? [] : obj.YourRevealSecretTrigger;
	this.OpponentRevealSecretTrigger = obj.OpponentRevealSecretTrigger==undefined ? [] : obj.OpponentRevealSecretTrigger;
	this.UseSpellTrigger = obj.UseSpellTrigger==undefined ? [] : obj.UseSpellTrigger;
	this.YourUseSpellTrigger = obj.YourUseSpellTrigger==undefined ? [] : obj.YourUseSpellTrigger;
	this.OpponentUseSpellTrigger = obj.OpponentUseSpellTrigger==undefined ? [] : obj.OpponentUseSpellTrigger;
	this.YourSpellTargetTrigger = obj.YourSpellTargetTrigger==undefined ? [] : obj.YourSpellTargetTrigger;
	this.AfterSpellTrigger = obj.AfterSpellTrigger==undefined ? [] : obj.AfterSpellTrigger;
	this.YourAfterSpellTrigger = obj.YourAfterSpellTrigger==undefined ? [] : obj.YourAfterSpellTrigger;
	this.OpponentAfterSpellTrigger = obj.OpponentAfterSpellTrigger==undefined ? [] : obj.OpponentAfterSpellTrigger;
	this.PlayMinionsTrigger = obj.PlayMinionsTrigger==undefined ? [] : obj.PlayMinionsTrigger;
	this.YourPlayMinionsTrigger = obj.YourPlayMinionsTrigger==undefined ? [] : obj.YourPlayMinionsTrigger;
	this.OpponentPlayMinionsTrigger = obj.OpponentPlayMinionsTrigger==undefined ? [] : obj.OpponentPlayMinionsTrigger;
	this.SummonTrigger = obj.SummonTrigger==undefined ? [] : obj.SummonTrigger;
	this.YourSummonTrigger = obj.YourSummonTrigger==undefined ? [] : obj.YourSummonTrigger;
	this.OpponentSummonTrigger = obj.OpponentSummonTrigger==undefined ? [] : obj.OpponentSummonTrigger;
	this.AfterPlayMinionsTrigger = obj.AfterPlayMinionsTrigger==undefined ? [] : obj.AfterPlayMinionsTrigger;
	this.YourAfterPlayMinionsTrigger = obj.YourAfterPlayMinionsTrigger==undefined ? [] : obj.YourAfterPlayMinionsTrigger;
	this.OpponentAfterPlayMinionsTrigger = obj.OpponentAfterPlayMinionsTrigger==undefined ? [] : obj.OpponentAfterPlayMinionsTrigger;
	this.AfterSummonTrigger = obj.AfterSummonTrigger==undefined ? [] : obj.AfterSummonTrigger;
	this.YourAfterSummonTrigger = obj.YourAfterSummonTrigger==undefined ? [] : obj.YourAfterSummonTrigger;
	this.OpponentAfterSummonTrigger = obj.OpponentAfterSummonTrigger==undefined ? [] : obj.OpponentAfterSummonTrigger;
	this.BeforAttackTrigger = obj.BeforAttackTrigger==undefined ? [] : obj.BeforAttackTrigger;
	this.AttackTrigger = obj.AttackTrigger==undefined ? [] : obj.AttackTrigger;
	this.AfterAttackTrigger = obj.AfterAttackTrigger==undefined ? [] : obj.AfterAttackTrigger;
	this.TakeDamageTrigger = obj.TakeDamageTrigger==undefined ? [] : obj.TakeDamageTrigger;
	this.DealingDamageTrigger = obj.DealingDamageTrigger==undefined ? [] : obj.DealingDamageTrigger;
	this.FriendlyTakeDamageTrigger = obj.FriendlyTakeDamageTrigger==undefined ? [] : obj.FriendlyTakeDamageTrigger;
	this.MinionsTakeDamageTrigger = obj.MinionsTakeDamageTrigger==undefined ? [] : obj.MinionsTakeDamageTrigger;
	this.GainArmorTrigger = obj.GainArmorTrigger==undefined ? [] : obj.GainArmorTrigger;
	this.EquippingWeaponTrigger = obj.EquippingWeaponTrigger==undefined ? [] : obj.EquippingWeaponTrigger;
	this.MinionsDeathTrigger = obj.MinionsDeathTrigger==undefined ? [] : obj.MinionsDeathTrigger;
	this.YourMinionsDeathTrigger = obj.YourMinionsDeathTrigger==undefined ? [] : obj.YourMinionsDeathTrigger;
	this.OpponentMinionsDeathTrigger = obj.OpponentMinionsDeathTrigger==undefined ? [] : obj.OpponentMinionsDeathTrigger;
	this.OngoingEffect = obj.OngoingEffect==undefined ? [] : obj.OngoingEffect;
}