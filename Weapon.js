function Weapon(obj, DBfrom, cardid){
	this.name = obj.name;
	this.DBfrom = DBfrom;
	this.cardid = cardid;
	this.cost = obj.cost;
	this.attack = obj.attack;
	this.durability = obj.durability;
	this.reflash = [];
	this.Battlecry = obj.Battlecry==undefined ? [] : obj.Battlecry;
	this.Deathrattle = obj.Deathrattle==undefined ? [] : obj.Deathrattle;
	this.effect = obj.effect==undefined ? [] : obj.effect;
	this.type = ["Weapon"]
	play_index += 1;
	this.play_index = play_index;
}