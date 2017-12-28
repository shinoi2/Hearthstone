function show(id){
	$(".Heros_0").attr("src", "img/"+Heros[1-id].name+".png");
	$(".HeroPower_0").attr("src", "img/"+Heros[1-id].heropowername+".png");
	$("#Heros_0h").text(Heros[1-id].health);
	if (Heros[1-id].health==Heros[1-id].maxhealth)
		$("#Heros_0h").attr("class", "Heros_0h");
	else
		$("#Heros_0h").attr("class", "Heros_0h_red")
	$(".Heros_1").attr("src", "img/"+Heros[id].name+".png");
	$(".HeroPower_1").attr("src", "img/"+Heros[id].heropowername+".png");
	$("#Heros_1h").text(Heros[id].health);
	if (Heros[id].health==Heros[id].maxhealth)
		$("#Heros_1h").attr("class", "Heros_1h");
	else
		$("#Heros_1h").attr("class", "Heros_1h_red")
	// 对方场上随从
	$("#m0").attr("class", "Minions_0"+Minions[1-id].length);
	for (var i=0;i<Minions[1-id].length;i++){
		var st = "m0" + i;
		$("#"+st).show();
		var temp = Minions[1-id][i];
		$("#"+st+"p").attr("src", "img/Minion_"+temp.name+".png");
		$("#"+st+"a").text(temp.attack);
		$("#"+st+"h").text(temp.health);
		if (temp.health < temp.maxhealth)
			$("#"+st+"h").attr("class", "Minion_health_font_red");
		else
			$("#"+st+"h").attr("class", "Minion_health_font");
	}
	for (var i=Minions[1-id].length;i<7;i++){
		var st = "m0" + i;
		$("#"+st).hide();
	}
	// 己方场上随从
	$("#m1").attr("class", "Minions_1"+Minions[id].length);
	for (var i=0;i<Minions[id].length;i++){
		var st = "m1" + i;
		$("#"+st).show();
		var temp = Minions[id][i];
		$("#"+st+"p").attr("src", "img/Minion_"+temp.name+".png");
		$("#"+st+"a").text(temp.attack);
		$("#"+st+"h").text(temp.health);
		if (temp.health < temp.maxhealth)
			$("#"+st+"h").attr("class", "Minion_health_font_red");
		else
			$("#"+st+"h").attr("class", "Minion_health_font");
	}	
	for (var i=Minions[id].length;i<7;i++){
		var st = "m1" + i;
		$("#"+st).hide();
	}
	$(".Mana0").text(Mana[1-id]+'/'+MaxMana[1-id]);
	$(".Mana1").text(Mana[id]+'/'+MaxMana[id]);
	for (var i=0;i<Mana[id];i++){
		$(".Mana_"+i).attr("src", "img/Full_Mana.png");
		$(".Mana_"+i).show();
	}
	for (var i=Mana[id];i<MaxMana[id]-Overload[id][0];i++){
		$(".Mana_"+i).attr("src", "img/Null_Mana.png");
		$(".Mana_"+i).show();
	}
	for (var i=MaxMana[id]-Overload[id][0];i<MaxMana[id];i++){
		$(".Mana_"+i).attr("src", "img/Lock_Mana.png");
		$(".Mana_"+i).show();
	}
	for (var i=MaxMana[id];i<10;i++)
		$(".Mana_"+i).hide();
	for (var i=0;i<MaxMana[id]-Overload[id][0];i++)
		$(".Lock_"+i).hide();
	for (var i=MaxMana[id]-Overload[id][0];i<MaxMana[id];i++)
		$(".Lock_"+i).show();
	for (var i=MaxMana[id];i<10;i++)
		$(".Lock_"+i).hide();
}

function ChoosePos(playid){

}