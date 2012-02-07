// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

var globalDialog;
var globalTree;
var globalTable;

$(document).ready(function() {
	resizeIFrame();
	activeNavItem();
	
	top.$('#save_changes_btn').click(function() {
		if (typeof onSaveChanges == "function") {
			onSaveChanges();
		} else {
			$('#current_form').submit();
		}
		return false;
	});
})

function activeNavItem() {
	var items = $(".nav-item");
	var path = window.location.pathname.toLowerCase();
	if (path == "/") {
		$(".nav-home-item").addClass("active");
		return;
	}
	for (i = 0; i < items.length; i++) {
		item = items[i];
		if (path.indexOf("/" + item.textContent.toLowerCase()) >= 0) {
			$(item).addClass("active");
			return;
		}
	}
}

function resizeIFrame() {
	o = top.document.getElementsByTagName('iframe');
	for(i=0;i<o.length;i++){
		if (/\bautoHeight\b/.test(o[i].className)){
			e = o[i];
			if(e.contentDocument){
				e.height = e.contentDocument.body.offsetHeight;
			} else {
				e.height = e.contentWindow.document.body.scrollHeight;
			}
		}
	}
}

function openDialog(url, width, title) {
	globalDialog = $(' \
		<div class="modal"> \
			<div class="modal-header"> \
				<a class="close" data-dismiss="modal">×</a> \
		    	<h4>' + title + '</h4> \
		  	</div> \
			<div class="modal-body"> \
				<iframe src="' + url + '" id="dialog-frame" class="autoHeight" frameBorder="0" scrolling="no" style="width:100%;"/> \
			</div> \
			<div class="modal-footer"> \
				<a href="#" class="btn btn-primary" id="save_changes_btn">Save changes</a> \
	            <a href="#" class="btn" data-dismiss="modal">Close</a> \
            </div> \
		</div> \
		').modal().css({ width: width, 'margin-left': function () { return -($(this).width() / 2); } });
	
	globalDialog.on('hidden', function() {
		globalDialog.remove();
	});	
}

function closeDialog() {
	globalDialog.modal('hide');
}

function getTree() {
	return $("#tree").dynatree("getTree");
}

function getTable() {
	// return $("#table").dataTable();
	return globalTable;
}

function getTreeSelectionKey() {
	var node = getTree().getActiveNode();
	var key = -1;
	if (node) {
		key = node.data.key;
	}
	return key;
}

function getTableSelectionKey() {
    var aTrs = getTable().fnGetNodes();
     
    for ( var i=0 ; i<aTrs.length ; i++ ) {
        if ( $(aTrs[i]).hasClass('row_selected') ) {
			return aTrs[i].firstChild.innerHTML;
        }
    }
    return -1;	
}