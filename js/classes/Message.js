// Show message
// ---------------------------------------------------------------------
class Message
{
	show(msg, timing, new_game_bt)
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

		this.center();

		msg_box.hide();
		msg_box.css({visibility: 'visible'});

		if (options.animations)
		{
			msg_box.fadeIn(timing);
		}
		else
		{
			msg_box.show();
		}
	}



	// Hide message box
	// ---------------------------------------------------------------------
	hide()
	{
		// Remove end message, if present
		if (options.animations)
		{
			$("#message_box").fadeOut();
		}
		else
		{
			$("#message_box").hide();
		}
	}



	// Center message vertically
	// ---------------------------------------------------------------------
	center()
	{
		var msg_y = ($('#message_box').outerHeight() - $('#message_text').outerHeight()) / 2;
		$('#message_text').css({top: msg_y + 'px'});
	}
}