mineblaster.gui = new Object();

mineblaster.gui.images = ['imgs/mineblaster_icon.svg', 'imgs/wrong_mine.svg', 'imgs/menu.svg', 'imgs/mine.svg'];
mineblaster.gui.preloaded_images = new Array();

//Background color
mineblaster.gui.background_colors = ['#930', '#390', '#039', '#9a0', '#399', '#939', '#e50', '#999'];	// Background possible colors
mineblaster.gui.current_background = '';



// Preload GUI images
// --------------------------------------------------------
mineblaster.gui.preload_images = function ()
{
	var i;
	
	for (i = 0; i < mineblaster.gui.images.length; i++)
	{
		mineblaster.gui.preloaded_images[i] = new Image();
		mineblaster.gui.preloaded_images[i].src = mineblaster.gui.images[i];
	}
}


// Change background color
// ---------------------------------------------------------------------
mineblaster.gui.change_background = function ()
{
	do
	{
		random = Math.floor(Math.random() * mineblaster.gui.background_colors.length);
	}
	while (random == mineblaster.gui.current_background);

	mineblaster.gui.current_background = random;

	$('#controls_box').stop().animate({
		'background-color' : mineblaster.gui.background_colors[random]
	});

	// Background color animation
	$('body').stop().animate({
		'background-color' : mineblaster.gui.background_colors[random]
	});

}



// Update visual indicators (remaining cells, mines, etc)
// ---------------------------------------------------------------------
mineblaster.gui.update_indicators = function ()
{
	var i, j;
	var remaining_cells = (mineblaster.field.rows_number * mineblaster.field.cols_number) - mineblaster.field.mine_number - mineblaster.field.open_cells_number;

	// Update remaining non-opened cells indicator
	$("#remaining_cells").html(remaining_cells.toString());

	// Update remaining mines indicator
	mineblaster.field.marked_mines_number = 0;

	for (i = 0; i < mineblaster.field.rows_number; i++)
	{
		for (j = 0; j < mineblaster.field.cols_number; j++)
		{
			if (mineblaster.field.marked_cells[i][j] == "M")
			{
				mineblaster.field.marked_mines_number++;
			}
		}
	}
	
	var remaining_mines = mineblaster.field.mine_number - mineblaster.field.marked_mines_number;

	$("#remaining_mines").html(remaining_mines.toString());
}







mineblaster.gui.menu = new Object();

mineblaster.gui.menu.opened = true;


// Open options menu
// --------------------------------------------------------
mineblaster.gui.menu.open = function ()
{
	$('#controls_box').animate({'top': '0px'});
	mineblaster.gui.menu.opened = true;
}



// Close options menu
// --------------------------------------------------------
mineblaster.gui.menu.close = function ()
{
	var controls_h = $('#controls_box').outerHeight();
	var indicators_h = $('#indicators').outerHeight();

	$('#controls_box').animate({'top': "-" + (controls_h - indicators_h) + 'px'});

	mineblaster.gui.menu.opened = false;
}


// Toggle options menu
// --------------------------------------------------------
mineblaster.gui.menu.toggle = function ()
{
	if (! mineblaster.gui.menu.opened)
	{
		mineblaster.gui.menu.open();
	}
	
	else
	{
		mineblaster.gui.menu.close();
	}
}




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