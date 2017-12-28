function Weapon(obj, DBfrom, cardid){
	for (var i in obj) this.obj = obj.i;
	this.name = obj.name;
	this.DBfrom = DBfrom;
	if (this.type != undefined)
		this.type.push("Weapon");
	else
		this.type = ["Weapon"];
	play_index += 1;
	this.play_index = play_index;
}