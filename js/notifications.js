(function(){

	if (!("Notification" in window)) {
    	alert("This browser does not support desktop notification");
  	}
	

	var askPermission;
	var icon;
	var title;
	var msg;

	function notificationload(){
		 askPermission = document.getElementById("askNotif");
		 askPermission.onclick = doAskPermission;
		 showNotif = document.getElementById("showNotif");
		 showNotif.onclick = doShowNotif; 	
	}

	function doShowNotif(){
	    if (window.Notification && Notification.permission !== "denied") {
        	var title = document.getElementById("titleNotif").value;
        	var icon = document.getElementById("iconNotif").value;
        	var body = document.getElementById("msgNotif").value;
        	var n = new Notification(title, {
        		icon: icon,
        		body: body
        	});
    	}
	}

	function doAskPermission(){
		if (window.Notification && Notification.permission !== "granted") {
    		Notification.requestPermission(function (status) {
      			if (Notification.permission !== status) {
        			Notification.permission = status;
  				}
    		});
  		}	
	}

	window.addEventListener("load", notificationload, false);
})();