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
			var svrFile = xhttp.responseXML;
			var svrNodes = svrFile.getElementsByTagName('node');
			for(var n = 0; n < svrNodes.length; n++){
				renderNodes.push(new SpliceVRNode());
				var nodeX = svrNodes[n].getElementsByTagName('x');
				renderNodes[n].x = parseFloat(nodeX[0].childNodes[0].nodeValue);
				var nodeY = svrNodes[n].getElementsByTagName('y');
				renderNodes[n].y = parseFloat(nodeY[0].childNodes[0].nodeValue);
			}
			for(var n = 0; n < svrNodes.length; n++){
				var svrEvents = svrNodes[n].getElementsByTagName('event');
				for(var i = 0; i < svrEvents.length; i++){
					var svrExits = svrEvents[i].getElementsByTagName('exit');
					for(var j = 0; j < svrExits.length; j++){
						var svrExitID = svrExits[j].getElementsByTagName('id');
						var k = parseInt(svrExitID[0].childNodes[0].nodeValue) - 65536;
						renderLinks.push(new SpliceVRLink(renderNodes[n],renderNodes[k]));
					}
				}
			}
		}
		catch(e){
			
		}

	};

	SpliceVRFile.prototype.saveSVR = function() {
		var svrStr = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        svrStr += "\n\t<svr>";
		for (var n = 0; n < renderNodes.length; n++){
			svrStr += "\n\t\t<node>";
			svrStr += "\n\t\t\t<id>"+(65536+n)+"</id>";
			svrStr += "\n\t\t\t<x>"+(renderNodes[n].x)+"</x>";
			svrStr += "\n\t\t\t<y>"+(renderNodes[n].y)+"</y>";

			for(var i = 0; i < renderLinks.length; i++){
				svrStr += "\n\t\t\t<event>";
				if(renderLinks[i].node1 == renderNodes[n]){
					svrStr += "\n\t\t\t\t<triggers>";
					svrStr += "\n\t\t\t\t\t<keyup>";
					svrStr += "\n\t\t\t\t\t\t<value>13</value>";
					svrStr += "\n\t\t\t\t\t</keyup>";
					svrStr += "\n\t\t\t\t</triggers>";
					svrStr += "\n\t\t\t\t<actions>";
					svrStr += "\n\t\t\t\t\t<exit>";
					var j = 0;
					for(j = 0; j < renderNodes.length; j++){
						if(renderLinks[i].node2 == renderNodes[j])
							break;
					}
					svrStr += "\n\t\t\t\t\t\t<id>"+(65536+j)+"</id>";
					svrStr += "\n\t\t\t\t\t</exit>";
					svrStr += "\n\t\t\t\t</actions>";
				}
				svrStr += "\n\t\t\t</event>";
			}
			svrStr += "\n\t\t</node>";
		}
		svrStr += "\n\t\t<global>";
		svrStr += "\n\t\t</global>";
        svrStr += "\n\t</svr>";

        var blob = new Blob([svrStr], {type : 'text/xml'});
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