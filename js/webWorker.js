(function(){
	
	var elem = document.getElementById('webworkerOutput');
	var launchWithOutWWButton = document.getElementById("launchWithOutWebWorker");
	var launchWithWWButton = document.getElementById("launchWithWebWorker");

	var webworker = {};
	
	webworker.initWithWW = function(){
		// initialisation du worker
		var w = new Worker("../js/worker.js");

		elem.innerHTML = "";
		launchWithWWButton.disabled = true;

		//ajout d'un listener
		w.addEventListener("message", function(event){
		  elem.innerHTML = "Le worker a déjà fait "+
		    event.data+" tours";
		});

		setTimeout(function(){
			// Au bout d'une seconde, on arrête le worker
	  		w.terminate();
	  		elem.innerHTML += " - Worker Éliminé!";
	  		launchWithWWButton.disabled = false;
		},50000);
	};

	webworker.initWithOutWW = function(){
	
		var l = 1000000000;
		elem.innerHTML = "";
		
		//on remplit un tableau
		for(var i = 0; i < l; i++){
			//tous les 100 tours, on informe le thread principal
  			if(i%1000 === 0){
				elem.innerHTML = "J'ai fait "+i+" tours";
  			}
		}
	};

	launchWithWWButton.onclick = webworker.initWithWW;
	launchWithOutWWButton.onclick = webworker.initWithOutWW;

})();