function Spell(obj, DBfrom, cardid){
	for (var i in obj){
		this[i] = obj[i];
	}
	if (this.type == undefined)
		this.type = ["Spell"];
	else
		this.type.push("Spell");
	play_index += 1;
	this.play_index = play_index;
}