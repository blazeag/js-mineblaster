// Show message
// ---------------------------------------------------------------------
class Message
{
	show(msg, timing, animations, new_game_btn, field)
	{
		if (new_game_btn === undefined)
		{
			new_game_btn = false;
		}

		$('#msg_new_game').off('click');

		var msg_box = $('#message_box');
		msg_box.hide();

		var msg_div = $('<div>').attr('id', "message_text").html(msg);

		msg_box.html(msg_div);

		if (new_game_btn)
		{
			$('#message_text').append('<input type="button" id="msg_new_game" value="New Game">');
			$('#msg_new_game').on('click', function() { field.initialize(field); });
		}


		if (animations)
		{
			$('#mineblaster').css({filter: 'blur(5px)'});
			msg_box.fadeIn(timing);
		}
		else
		{
			msg_box.show();
		}
	}



	// Hide message box
	// ---------------------------------------------------------------------
	hide(animations)
	{
		// Remove end message, if present
		if (animations)
		{
			$('#mineblaster').css('filter', 'none');
			$("#message_box").fadeOut();
		}
		else
		{
			$("#message_box").hide();
		}
	}

}