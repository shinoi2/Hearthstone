function Hero(obj){
	this.effect = [];
	for (var i in obj){
		this[i] = obj[i];
	}
	this.maxhealth = obj.health;
	if (this.type != undefined)
		this.type.push("Hero");
	else
		this.type = ["Hero"];
}