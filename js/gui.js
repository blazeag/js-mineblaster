mineblaster.gui = new Object();

mineblaster.gui.preloaded_images = new Array();
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
		mineblaster.cookies.set('vibration', mineblaster.vibration);
		
	});

	$('#animations').change(function () {
		
		if ($(this).is(':checked'))
		{
			mineblaster.animations = true;
		}
		else
		{
			mineblaster.animations = false;
		}
		
		// Set cookie
		mineblaster.cookies.set('vibration', mineblaster.vibration);
		mineblaster.cookies.set('animations', mineblaster.animations);
		
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
	
	for (i = 0; i < mineblaster.images.length; i++)
	{
		mineblaster.gui.preloaded_images[i] = new Image();
		mineblaster.gui.preloaded_images[i].src = mineblaster.images[i];
	}
}



// Change background color
// ---------------------------------------------------------------------
mineblaster.gui.change_background = function (callback)
{
	do
	{
		random = Math.floor(Math.random() * mineblaster.background_colors.length);
	}
	while (random == mineblaster.gui.current_background);

	mineblaster.gui.current_background = random;

	// Background color animation
	
	if (mineblaster.animations)
	{
		$('body, #controls_box').stop().animate({
			'background-color' : mineblaster.background_colors[random]
		}, callback);
	}
	else
	{
		$('body, #controls_box').css({'background-color': mineblaster.background_colors[random]});
		callback();
	}

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