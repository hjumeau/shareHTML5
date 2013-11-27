var i = 0;
var j = 0;
while(true){
	i++
	if(i%1000000 === 0){
		j++
    	postMessage("Le worker a déjà fait "+j+" tours");
  	}
}
  