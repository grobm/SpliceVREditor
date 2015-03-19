/*
SpliceVR Editor: A video editor for cinematic virtual reality
Copyright (C) 2015 Alex Meagher Grau

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

(function(global) {
	SpliceVRFile = function() {
		this.svr = "";
	};

	SpliceVRFile.prototype.openSVR = function() {
		var input = document.createElement("input");
		input.type = "file";
		input.accept = ".svr";
		var t = this;
		input.addEventListener("change", function (event) {
			var files = input.files;
			if (!files.length)
				return;
			t.svr = URL.createObjectURL(files[0]);
			t.importSVR();
		});
		input.click();
	};


	SpliceVRFile.prototype.importSVR = function() {
		renderNodes.length = 0;
		renderLinks.length = 0;
		var xhttp = new XMLHttpRequest('UTF-8');
		xhttp.open('GET', this.svr, false);
		try{
			xhttp.send();
  			var svrFile = JSON.parse(xhttp.responseText);
  			var svrNodes = svrFile.svr.nodes;
			for(var n = 0; n < svrNodes.length; n++){
				renderNodes.push(new SpliceVRNode());
				renderNodes[n].x = svrNodes[n].x;
				renderNodes[n].y = svrNodes[n].y;
			}
			for(var n = 0; n < svrNodes.length; n++){
				for(var i = 0; i < svrNodes[n].events.length; i++){
					var svrExit = svrNodes[n].events[i].actions[0].exit;
					var k = svrExit.id-65536;
					renderLinks.push(new SpliceVRLink(renderNodes[n],renderNodes[k]));
				}
			}
		}
		catch(e){
			
		}

	};

	SpliceVRFile.prototype.saveSVR = function() {
		var svrStr = "{";
        svrStr += "\n\t\"svr\" : {";

		svrStr += "\n\t\t\"nodes\" : [";
		for (var n = 0; n < renderNodes.length; n++){
			svrStr += "\n\t\t\t{";
			svrStr += "\n\t\t\t\t\"id\" : "+(65536+n)+",";
			svrStr += "\n\t\t\t\t\"x\" : "+(renderNodes[n].x)+",";
			svrStr += "\n\t\t\t\t\"y\" : "+(renderNodes[n].y)+",";

			svrStr += "\n\t\t\t\t\"events\" : [";
			var c = 0;
			for(var i = 0; i < renderLinks.length; i++){

				if(renderLinks[i].node1 == renderNodes[n]){
					var j = 0;
					for(j = 0; j < renderNodes.length; j++){
						if(renderLinks[i].node2 == renderNodes[j])
							break;
					}
					if(c!= 0){
						svrStr += ",";
					}
					c++;

					svrStr += "\n\t\t\t\t\t{";
					svrStr += "\n\t\t\t\t\t\t\"triggers\" : [";

					svrStr += "\n\t\t\t\t\t\t\t{";
					svrStr += "\n\t\t\t\t\t\t\t\t\"keyup\" : {\"value\" : 64}";
					svrStr += "\n\t\t\t\t\t\t\t}";

					svrStr += "\n\t\t\t\t\t\t],";
					svrStr += "\n\t\t\t\t\t\t\"actions\" : [";

					svrStr += "\n\t\t\t\t\t\t\t{";
					svrStr += "\n\t\t\t\t\t\t\t\t\"exit\" : {\"id\" : "+(65536+j)+"}";
					svrStr += "\n\t\t\t\t\t\t\t}";

					svrStr += "\n\t\t\t\t\t\t]";
					svrStr += "\n\t\t\t\t\t}";
				}
			}
			svrStr += "\n\t\t\t\t]";
			svrStr += "\n\t\t\t}";
			if(n != renderNodes.length-1){
				svrStr += ",";
			}
		}
		svrStr += "\n\t\t]";
        svrStr += "\n\t}";
        svrStr += "\n}";
		
        var blob = new Blob([svrStr], {type : 'application/json'});
        var downloadLink = document.createElement("a");
		downloadLink.download = "export.svr";
		if (window.webkitURL != null)
			downloadLink.href = window.webkitURL.createObjectURL(blob);
		else{
			downloadLink.href = window.URL.createObjectURL(blob);
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
		}
		downloadLink.click();
	};
})(window);