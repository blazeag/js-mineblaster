mineblaster.gui.message = new Object();



// Show message
// ---------------------------------------------------------------------
mineblaster.gui.message.show = function (msg, timing, new_game_bt)
{
	if (new_game_bt === undefined)
	{
		new_game_bt = false;
	}
	
	$('#msg_new_game').unbind('click');

	var msg_box = $('#message_box');
	var msg_div = $('<div id="message_text">' + msg + '</div>');
	
	msg_box.html(msg_div);
	
	if (new_game_bt)
	{
		$('#message_text').append('<input type="button" id="msg_new_game" value="New Game">');
		$('#msg_new_game').click(mineblaster.field.initialize);

	}
	
	msg_box.css({visibility: 'hidden'});
	msg_box.show();

	mineblaster.gui.message.center();
	
	msg_box.hide();
	msg_box.css({visibility: 'visible'});
	
	msg_box.fadeIn(timing);
}



// Center message vertically
// ---------------------------------------------------------------------
mineblaster.gui.message.center = function ()
{
	var msg_y = ($('#message_box').outerHeight() - $('#message_text').outerHeight()) / 2;
	$('#message_text').css({top: msg_y + 'px'});
}
