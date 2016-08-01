mineblaster.field = new Object();

//Global variables
mineblaster.field.field;			// Array containing mines and cells values
mineblaster.field.open_cells;			// Array containing open cells boolean flags
mineblaster.field.marked_cells;		// Array containing cell markers

mineblaster.field.open_cells_number;		// Open cells counter
mineblaster.field.marked_mines_number;	// Mine-marked cells number
mineblaster.field.just_opened_cells;	// List of just opened cells

mineblaster.field.rows_number;		// Field rows number
mineblaster.field.cols_number;		// Field columns number
mineblaster.field.mine_number;		// Field mines number
mineblaster.field.timeouts = [];		// Timeout container			



mineblaster.field.initialize = function ()
{
	// Change background color
	mineblaster.gui.change_background(mineblaster.field.rebuild);
}



// Rebuild field
// ---------------------------------------------------------------------
mineblaster.field.rebuild = function ()
{
	// Empty arrays
	mineblaster.field.field = new Array();
	mineblaster.field.open_cells = new Array();
	mineblaster.field.marked_cells = new Array();
	
	// Remove end message, if present
	$("#message_box").fadeOut();

	for (i = 0; i < mineblaster.field.timeouts.length; i++)
	{
		clearTimeout(mineblaster.field.timeouts[i]);
	}
	
	mineblaster.field.timeouts = [];

	// Empty counters
	mineblaster.field.open_cells_number = 0;

	// Get highest row and column value
	var max_rows_number = $('#rows_number').attr("max");
	var max_cols_number = $('#cols_number').attr("max");

	// Get and check all field parameters
	mineblaster.field.rows_number = parseInt($("#rows_number").val());
	mineblaster.field.cols_number = parseInt($("#cols_number").val());
	mineblaster.field.mine_number = parseInt($("#mine_number").val());

	if (mineblaster.field.rows_number < 1 || mineblaster.field.rows_number > max_rows_number)
	{
		mineblaster.gui.message.show("Max rows number is " + max_rows_number + "!", 300);
		$('#rows_number').val(max_rows_number);
		return false;
	}
	
	if (mineblaster.field.cols_number < 1 || mineblaster.field.cols_number > max_cols_number)
	{
		mineblaster.gui.message.show("Max columns number is " + max_cols_number + "!", 300);
		$('#cols_number').val(max_cols_number);
		return false;
	}

	if (mineblaster.field.mine_number <= 0)
	{
		message("Put at least one mine in the field!", 300);
		return false;
	}

	if (mineblaster.field.mine_number > (mineblaster.field.rows_number * mineblaster.field.cols_number) - 1)
	{
		var max_mines = (mineblaster.field.rows_number * mineblaster.field.cols_number) - 1;
		mineblaster.gui.message.show("Mines saturate field!<br />Please decrease number of mines to a maximum of " + max_mines, 300);
		return false;
	}
	
	// Set cookies
	mineblaster.setcookie('rows_number', mineblaster.field.rows_number);
	mineblaster.setcookie('cols_number', mineblaster.field.cols_number);
	mineblaster.setcookie('mine_number', mineblaster.field.mine_number);

	// Field disposition
	mineblaster.field.generate();
	mineblaster.field.plant_mines();
	mineblaster.field.calculate_cells_values();
	mineblaster.field.draw();
	
	mineblaster.gui.update_indicators();

	// Unbind all previously associated cells listeners
	$(".cell").unbind();

	// Associate new events to cells
	$(".cell").click(mineblaster.field.cell_click);				// Cell opening listener
	$(".cell").dblclick(mineblaster.field.open_surrounding_cells);		// Surrounding cells opening listener
	$(".cell").mousedown(mineblaster.field.right_mouse_button);			// Cell marking listener
	$("#field").bind("contextmenu", function (e) {		// Avoid cells contextual menu on right mouse button click
		e.preventDefault();
	});
	
}



// Right mouse click listener, for cell marking capability
// ---------------------------------------------------------------------
mineblaster.field.right_mouse_button = function(e)
{
	var id;
	var row, column;

	// 3 is right mouse button value
	if (e.which === 3)
	{
		// Get pressed cell row and column number
		id = $(this).attr("id");

		row = parseInt(id.substring(3, id.indexOf("col")));
		column = parseInt(id.substring(id.indexOf("col") + 3));

		// If cell is already open, do nothing
		if (mineblaster.field.open_cells[row][column] == 1)
		{
			return false;
		}

		// Jump between cell possible states
		if (mineblaster.field.marked_cells[row][column] == "") mineblaster.field.marked_cells[row][column] = "M";
		else if (mineblaster.field.marked_cells[row][column] == "M") mineblaster.field.marked_cells[row][column] = "?";
		else if (mineblaster.field.marked_cells[row][column] == "?") mineblaster.field.marked_cells[row][column] = "";
		
		// Vibrate on mobile devices
		if (navigator.vibrate && mineblaster.vibration)
		{
			navigator.vibrate(30);
		}



		// Write value into displayed cell
		$("#row" + row + "col" + column + " .front").html(mineblaster.field.marked_cells[row][column]);

		// If cell assumes mied state, remove opening cell listener
		if (mineblaster.field.marked_cells[row][column] == "M")
		{
			$("#row" + row + "col" + column).unbind("click");
		}

		// If cell is de-marked, reapply click-to-open listener
		if (mineblaster.field.marked_cells[row][column] == "")
		{
			$("#row" + row + "col" + column).click(mineblaster.field.cell_click);
		}

		// Update visual indicators
		mineblaster.gui.update_indicators();
	}
}



// Field data arrays initialization
// ---------------------------------------------------------------------
mineblaster.field.generate = function ()
{
	var i, j;
	var random;

	mineblaster.field.just_opened_cells = [];

	// Draw field row by row
	for (i = 0; i < mineblaster.field.rows_number; i++)
	{
		mineblaster.field.field[i] = new Array();
		mineblaster.field.open_cells[i] = new Array();
		mineblaster.field.marked_cells[i] = new Array();

		// Column by column
		for (j = 0; j < mineblaster.field.cols_number; j++)
		{
			mineblaster.field.field[i][j] = "";
			mineblaster.field.marked_cells[i][j] = "";
			mineblaster.field.open_cells[i][j] = 0;
		}
	}
	
	// Close options
	mineblaster.gui.menu.close();
}



// Field drawing procedure
// ---------------------------------------------------------------------
mineblaster.field.draw = function ()
{
	var i, j; // Counters
	var field = $('#field'); // Field HTML element
	var field_string = ''; // Empty HTML field string

	// Empty field
	field.html('');

	var field_str = "";
	
	// Row by row
	for (i = 0; i < mineblaster.field.rows_number; i++)
	{
		// Column by column
		for (j = 0; j < mineblaster.field.cols_number; j++)
		{
			var cell_id = 'row' + i + 'col' + j;
			field_str += '<div class="cell" id="' + cell_id + '"><div class="front"></div><div class="back"></div></div>';
		}
	}

	// Insert HTML field string into field HTML element
	field.append(field_str);

	// Resize field to fit window width/height
	mineblaster.field.resize();
}



// Resize field cells to fit window size
// ---------------------------------------------------------------------
mineblaster.field.resize = function ()
{
	var i, j;
	
	// Disable transition effect for cells
	$(".cell").addClass("no_transition");

	// Set field size
	var window_w = $(window).outerWidth();
	var window_h = $(window).outerHeight() - $('#indicators').outerHeight() - 10;

	var cell_w = window_w / mineblaster.field.cols_number;
	var cell_h = window_h / mineblaster.field.rows_number;
	cell_h = cell_w = Math.min(cell_w, cell_h);

	// Minimum width
	if (cell_w < 30)
	{
		cell_w = cell_h = 30;
	}

	// Only integer cell sizes, due to firefox collapsing some adjacent borders
	// when using decimal sizes
	cell_w = Math.floor(cell_w);
	cell_h = Math.floor(cell_h);

	$("div.cell").width(cell_w);
	$("div.cell").height(cell_h);

	var field_w = (cell_w * mineblaster.field.cols_number);
	var field_h = cell_h * mineblaster.field.rows_number;

	$('#field').width(field_w);
	$('#field').height(field_h);

	font_size = cell_w / 2.5;
	pad_top = cell_w / 4;

	// Trick to vertically center numbers
	$(".cell .front, .cell .back").css({
		fontSize : font_size + 'px',
		paddingTop : pad_top + 'px'
	});

	// Center field horizontally
	var offset_x = ($(window).outerWidth() - $('#field').outerWidth()) / 2;
	$('#field').css({
		'left' : offset_x + 'px'
	});

	// Center field vertically
	var controls_height = $('#indicators').outerHeight() + 10;
	var field_y = (($(window).outerHeight() - controls_height - $('#field').outerHeight()) / 2);
	
	if (field_y < 0) field_y = 0;
	
	var offset_y = controls_height + field_y;
	$('#field').css({
		'top' : offset_y + 'px'
	});
	
	// Re-enable transition effect for cells
	$(".cell").removeClass("no_transition");

	// Centers message, if open
	mineblaster.gui.message.center();
}



// Cell value calculation
// ---------------------------------------------------------------------
mineblaster.field.calculate_cells_values = function ()
{
	var adjacent_mines;
	var i, j, k, w;

	// Row by row
	for (i = 0; i < mineblaster.field.rows_number; i++)
	{
		// Column by column
		for (j = 0; j < mineblaster.field.cols_number; j++)
		{
			// Set cell adjacent mines number to zero
			adjacent_mines = 0;

			// Calculate only if cell is not mined
			if (mineblaster.field.field[i][j] != "*")
			{
				// From one line above to one line below
				for (k = -1; k < 2; k++)
				{
					// From one column to the left to one column to the right
					for (w = -1; w < 2; w++)
					{
						if (i + k < 0) continue; // Skip if above row is out of the field
						if (i + k >= mineblaster.field.rows_number) continue; // Skip if below row is out of the field
						if (j + w < 0) continue; // Skip if left column is out of the field
						if (j + w >= mineblaster.field.cols_number) continue; // Skip if right column is out of the
						if (k == 0 && w == 0) continue; // Don't compare a cell with itself

						// If current cell contains a mine, increase adjacent
						// mines counter for this cell
						if (mineblaster.field.field[i + k][j + w] == "*")
						{
							adjacent_mines++;
						}
					}
				}

				// Insert found value into cell value
				mineblaster.field.field[i][j] = adjacent_mines;
			}
		}
	}

}



// Mine positioning
// ---------------------------------------------------------------------
mineblaster.field.plant_mines = function ()
{
	var i;
	var random_row, random_column;

	// Distribute required mines number
	for (i = 0; i < mineblaster.field.mine_number; i++)
	{
		// Search for a random non-mined cell
		do
		{
			random_row = Math.floor(Math.random() * mineblaster.field.rows_number);
			random_column = Math.floor(Math.random() * mineblaster.field.cols_number);
		}
		while (mineblaster.field.field[random_row][random_column] == "*");

		// Found a free cell, flag it as mined
		mineblaster.field.field[random_row][random_column] = "*";
	}
}





//Cell click listener callback
//---------------------------------------------------------------------
mineblaster.field.cell_click = function (e)
{
	var id;
	var row, column;

	// Get pressed cell row and column number
	id = $(this).attr('id');

	row = parseInt(id.substring(3, id.indexOf('col')));
	column = parseInt(id.substring(id.indexOf('col') + 3));

	// Manage cell opening
	mineblaster.field.open_cell(row, column, 0);
}



//Cell opening procedure
//---------------------------------------------------------------------
mineblaster.field.open_cell = function (row, column, stack_level)
{
	var i, j;
	var cell;
	
	// Cell HTML element
	cell = $("#row" + row + "col" + column);

	// If cell doesn't contain a mine, and it is not an alreay opened cell, increase open cells counter
	if (mineblaster.field.field[row][column] != "*" && mineblaster.field.open_cells[row][column] == 0)
	{
		mineblaster.field.open_cells_number++;
	}

	// Update visual indicators
	mineblaster.gui.update_indicators();

	// Flag cell as opened
	mineblaster.field.open_cells[row][column] = 1;
	mineblaster.field.just_opened_cells.push([row, column]);

	// Remove any cell flags and markers
	mineblaster.field.marked_cells[row][column] = "";

	// If cell isn't empty, show cell value
	if (mineblaster.field.field[row][column] != 0) cell.children('.back').html(mineblaster.field.field[row][column]);
	else cell.children(".back").html("");

	// If cell has a numeric value, apply suited class
	for (i = 1; i <= 8; i++)
	{
		if (mineblaster.field.field[row][column] == i) cell.addClass("mine_" + i);
	}

	// If a mined cell was pressed, you're dead
	if (mineblaster.field.field[row][column] == "*")
	{
		cell.children(".back").html('').addClass("mine");		// Apply mined CSS class
		setTimeout("mineblaster.gui.message.show(\"You're dead :(\", 500, true)", 1000);		// Warn of death 
		mineblaster.game_over();			// Call end of game function
		
		return;
	};

	// If remaining unopened cells number is 0, I win
	if (mineblaster.field.open_cells_number == (mineblaster.field.rows_number * mineblaster.field.cols_number) - mineblaster.field.mine_number)
	{
		setTimeout("mineblaster.gui.message.show(\"You win! :)\", 500, true)", 1000);		// Warn of victory
		$('#remaining_cells, #remaining_mines').html('0');
		mineblaster.game_over();			// Call end of game function
		return;
	}
	
	// If cell has zero value, recursively open all surrounding cells
	if (mineblaster.field.field[row][column] == 0)
	{
		for (i= -1; i < 2; i++)
		{
			for (j = -1; j < 2; j++)
			{
				if (row + i < 0) continue;
				if (row + i >= mineblaster.field.rows_number) continue;
				if (column + j < 0) continue;
				if (column + j >= mineblaster.field.cols_number) continue;
				if (i == 0 && j == 0) continue;
				if (mineblaster.field.open_cells[row + i][column + j] == 1) continue;

				mineblaster.field.open_cell(row + i, column + j, stack_level + 1);
			}
		}
	}
	
	if (stack_level == 0)
	{
		mineblaster.field.flip_open_cells();
	}

}


//Perpetrate cell opening
//---------------------------------------------------------------------
mineblaster.field.flip_open_cells = function ()
{
	var i, j, delay;
	delay = 0;

	// Flip all just opened cells in the same order they where opened
	for (i = 0; i < mineblaster.field.just_opened_cells.length; i++)
	{
		if (i == 0 && navigator.vibrate && mineblaster.vibration)
		{
			navigator.vibrate(30);
		}
		
		var row = mineblaster.field.just_opened_cells[i][0];
		var column = mineblaster.field.just_opened_cells[i][1];
		
		if (mineblaster.field.open_cells[row][column] == 1)
		{
			func = "$('#row" + row + "col" + column + "').addClass('open_cell');";

			mineblaster.field.timeouts.push(setTimeout(func, 20 + delay));
			
			// 10ms delay between cells opening
			delay += 20;
		}
	}

	// Empty just opened cells array
	mineblaster.field.just_opened_cells = [];
}



//If double click on opened cell, if it has a satisfied mine number,
//open all surrounding cells, except for mine-flagged ones
//---------------------------------------------------------------------
mineblaster.field.open_surrounding_cells = function open_surrounding_cells()
{
	var i, j, marked_mines_number;
	var id;
	var row, column;

	// Get pressed cell row and column number
	id = $(this).attr("id");

	row = parseInt(id.substring(3, id.indexOf("col")));
	column = parseInt(id.substring(id.indexOf("col") + 3));

	// If cell is not open, skip (it shouldn't be a possible case)
	if (mineblaster.field.open_cells[row][column] == 0)
	{
		return false;
	}

	// Count mine-marked cells surrounding pressed one
	marked_mines_number = 0;

	// Row by row
	for (i = -1; i < 2; i++)
	{
		// Column by column
		for (j = -1; j < 2; j++)
		{
			if (row + i < 0) continue;
			if (row + i >= mineblaster.field.rows_number) continue;
			if (column + j < 0) continue;
			if (column + j >= mineblaster.field.cols_number) continue;
			if (i == 0 && j == 0) continue;
			if (mineblaster.field.open_cells[row + i][column + j] == 1) continue;

			if (mineblaster.field.marked_cells[row + i][column + j] == "M") marked_mines_number++;
		}
	}

	// If marked mines is greater or equal to cell value,
	// open all non-market surrounding ones
	if (marked_mines_number >= mineblaster.field.field[row][column])
	{
		// Row by row
		for (i = -1; i < 2; i++)
		{
			// Column by column
			for (j = -1; j < 2; j++)
			{
				if (row + i < 0) continue;
				if (row + i >= mineblaster.field.rows_number) continue;
				if (column + j < 0) continue;
				if (column + j >= mineblaster.field.cols_number) continue;
				if (i == 0 && j == 0) continue;
				if (mineblaster.field.open_cells[row + i][column + j] == 1) continue;

				// Do cell opening
				if (mineblaster.field.marked_cells[row + i][column + j] != "M")
				{
					mineblaster.field.open_cell(row + i, column + j, 1);	// Stack start from 1 because at level 0 it calls flip. Instead is going to be called here
				}
			}
		}
	}
	
	mineblaster.field.flip_open_cells();
}