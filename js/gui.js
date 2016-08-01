mineblaster.gui = new Object();

mineblaster.gui.images = ['imgs/mineblaster_icon.svg', 'imgs/wrong_mine.svg', 'imgs/menu.svg', 'imgs/mine.svg'];
mineblaster.gui.preloaded_images = new Array();

//Background color
mineblaster.gui.background_colors = ['#930', '#390', '#039', '#9a0', '#399', '#939', '#e50', '#999'];	// Background possible colors
mineblaster.gui.current_background = '';



// GUI initialization
// --------------------------------------------------------
mineblaster.gui.initialize = function ()
{
	// Toggle options and set option button listener
	$('#options').click(mineblaster.gui.menu.toggle);
	$('#controls_box, #message_box').click(function(event) {
		event.stopPropagation();
	});
	$(document).click(mineblaster.gui.menu.close);
	
	$('#vibration').change(function () {
		
		if ($(this).is(':checked'))
		{
			mineblaster.vibration = true;
		}
		else
		{
			mineblaster.vibration = false;
		}
		
		// Set cookie
		mineblaster.setcookie('vibration', mineblaster.vibration);
		
	});

	// Regeneration button listener
	$("#regenerate").mouseup(mineblaster.field.initialize);

	// Message fadeout on click
	$('#message_box').click(function () { $(this).fadeOut(); });
	
}



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
mineblaster.gui.change_background = function (callback)
{
	do
	{
		random = Math.floor(Math.random() * mineblaster.gui.background_colors.length);
	}
	while (random == mineblaster.gui.current_background);

	mineblaster.gui.current_background = random;

	// Background color animation
	$('body, #controls_box').stop().animate({
		'background-color' : mineblaster.gui.background_colors[random]
	}, callback);

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