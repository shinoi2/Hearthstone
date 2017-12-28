function Minion(obj, DBfrom, cardid){
	this.effect = [];
	for (var i in obj){
		this[i] = obj[i];
	}
	this.maxhealth = obj.health;
	if (this.type == undefined)
		this.type = ["Minion"];
	else
		this.type.push("Minion");
	this.rarity = null;
	if (obj.rarity != undefined) this.rarity = obj.rarity;
	play_index += 1;
	this.play_index = play_index;
	this.exhaustion = true;
	this.attacktime = 1;
	if (this.effect != undefined){
		if (this.effect.indexOf("Charge") != -1) {
			this.exhaustion = false;
			if (this.effect.indexOf("Windfury") != -1){
				this.attacktime += 1;
			} else
			if (this.effect.indexOf("Mega-Windfury") != -1){
				this.attacktime += 3;
			}
		}
	}
}