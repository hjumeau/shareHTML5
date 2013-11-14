(function(){
	
	var askPermission;
	var icon;
	var title;
	var msg;

	function notificationload(){
		 icon = document.getElementById("iconNotif");
		 title = document.getElementById("titleNotif");	
		 msg = document.getElementById("msgNotif");	
		 askPermission = document.getElementById("askNotif");
		 askPermission.onclick = doAskPermission;
		 showNotif = document.getElementById("showNotif");
		 showNotif.onclick = doShowNotif; 	
	}

	function doShowNotif(){
		if(window.webkitNotifications.checkPermission() == 0) {
			// Create a new notification
	    	var notification = window.webkitNotifications.createNotification(icon.value, title.value, msg.value);
	    	notification.show();
   		}
	}

	function doAskPermission(){
		window.webkitNotifications.requestPermission();
	}

	window.addEventListener("load", notificationload, false);
})();