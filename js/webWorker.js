(function(){
	
	var container = document.getElementById('webworkerOutput');
	var launchWithOutWWButton = document.getElementById("launchWithOutWebWorker");
	var launchWithWWButton = document.getElementById("launchWithWebWorker");
	var killWWButton = document.getElementById("killWebWorker");

	killWWButton.disabled = true;

	var elem = document.createElement("output");
	container.appendChild(elem);

	var w;

	var webworker = {};
	
	webworker.launchWithWW = function(){
		// initialisation du worker
		w = new Worker("../js/worker.js");

		elem.value = "";
		launchWithWWButton.disabled = true;
		killWWButton.disabled = false;

		//ajout d'un listener
		w.addEventListener("message", function(event){
		  elem.value = event.data;
		});
	};

	webworker.kill = function(){
		w.terminate();
  		elem.value += " - Worker Éliminé!";
  		launchWithWWButton.disabled = false;	
	};

	webworker.launchWithOutWW = function(){
	
		var l = 1000000000;
		elem.value = "";
		
		//on remplit un tableau
		for(var i = 0; i < l; i++){
			//tous les 100 tours, on informe le thread principal
  			if(i%1000 === 0){
				elem.value = "J'ai fait "+i+" tours";
  			}
		}
	};

	launchWithWWButton.onclick = webworker.launchWithWW;
	launchWithOutWWButton.onclick = webworker.launchWithOutWW;
	killWWButton.onclick = webworker.kill;

})();