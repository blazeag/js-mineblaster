// Cell click listener callback
// ---------------------------------------------------------------------
function cell_click(e)
{
	var id;
	var row, column;

	// Get pressed cell row and column number
	id = $(this).attr('id');

	row = parseInt(id.substring(3, id.indexOf('col')));
	column = parseInt(id.substring(id.indexOf('col') + 3));

	// Manage cell opening
	open_cell(row, column, 0);
}



// Cell opening procedure
// ---------------------------------------------------------------------
function open_cell(row, column, stack_level)
{
	var i, j;
	var cell;
	
	// Cell HTML element
	cell = $("#row" + row + "col" + column);

	// If cell doesn't contain a mine, and it is not an alreay opened cell, increase open cells counter
	if (field[row][column] != "*" && open_cells[row][column] == 0)
	{
		open_cells_number++;
	}

	// Update visual indicators
	update_indicators();

	// Flag cell as opened
	open_cells[row][column] = 1;
	just_opened_cells.push([row, column]);

	// Remove any cell flags and markers
	marked_cells[row][column] = "";

	// If cell isn't empty, show cell value
	if (field[row][column] != 0) cell.children('.back').html(field[row][column]);
	else cell.children(".back").html("");

	// If cell has a numeric value, apply suited class
	for (i = 1; i <= 8; i++)
	{
		if (field[row][column] == i) cell.addClass("mine_" + i);
	}

	// If a mined cell was pressed, you're dead
	if (field[row][column] == "*")
	{
		cell.children(".back").html('').addClass("mine");		// Apply mined CSS class
		message("You're dead :(")		// Warn of death 
		game_over();			// Call end of game function
		
		return;
	};

	// If remaining unopened cells number is 0, I win
	if (open_cells_number == (rows_number * cols_number) - mine_number)
	{
		message("You win! :)");		// Warn of victory
		game_over();			// Call end of game function
		return;
	}
	
	// If cell has zero value, recursively open all surrounding cells
	if (field[row][column] == 0)
	{
		for (i= -1; i < 2; i++)
		{
			for (j = -1; j < 2; j++)
			{
				if (row + i < 0) continue;
				if (row + i >= rows_number) continue;
				if (column + j < 0) continue;
				if (column + j >= cols_number) continue;
				if (i == 0 && j == 0) continue;
				if (open_cells[row + i][column + j] == 1) continue;

				open_cell(row + i, column + j, stack_level + 1);
			}
		}
	}
	
	if (stack_level == 0)
	{
		flip_open_cells();
	}

}


// Perpetrate cell opening
// ---------------------------------------------------------------------
function flip_open_cells()
{
	var i, j, delay;
	delay = 0;

	// Flip all just opened cells in the same order they where opened
	for (i = 0; i < just_opened_cells.length; i++)
	{
		if (i == 0 && navigator.vibrate && vibration)
		{
			navigator.vibrate(30);
		}
		
		var row = just_opened_cells[i][0];
		var column = just_opened_cells[i][1];
		
		if (open_cells[row][column] == 1)
		{
			func = "$('#row" + row + "col" + column + "').addClass('open_cell');";

			timeouts.push(setTimeout(func, 20 + delay));
			
			// 10ms delay between cells opening
			delay += 20;
		}
	}

	// Empty just opened cells array
	just_opened_cells = [];
}



// If double click on opened cell, if it has a satisfied mine number,
// open all surrounding cells, except for mine-flagged ones
// ---------------------------------------------------------------------
function open_surrounding_cells()
{
	var i, j, marked_mines_number;
	var id;
	var row, column;

	// Get pressed cell row and column number
	id = $(this).attr("id");

	row = parseInt(id.substring(3, id.indexOf("col")));
	column = parseInt(id.substring(id.indexOf("col") + 3));

	// If cell is not open, skip (it shouldn't be a possible case)
	if (open_cells[row][column] == 0)
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
			if (row + i >= rows_number) continue;
			if (column + j < 0) continue;
			if (column + j >= cols_number) continue;
			if (i == 0 && j == 0) continue;
			if (open_cells[row + i][column + j] == 1) continue;

			if (marked_cells[row + i][column + j] == "M") marked_mines_number++;
		}
	}

	// If marked mines is greater or equal to cell value,
	// open all non-market surrounding ones
	if (marked_mines_number >= field[row][column])
	{
		// Row by row
		for (i = -1; i < 2; i++)
		{
			// Column by column
			for (j = -1; j < 2; j++)
			{
				if (row + i < 0) continue;
				if (row + i >= rows_number) continue;
				if (column + j < 0) continue;
				if (column + j >= cols_number) continue;
				if (i == 0 && j == 0) continue;
				if (open_cells[row + i][column + j] == 1) continue;

				// Do cell opening
				if (marked_cells[row + i][column + j] != "M")
				{
					open_cell(row + i, column + j, 1);	// Stack start from 1 because at level 0 it calls flip. Instead is going to be called here
				}
			}
		}
	}
	
	flip_open_cells();

}



// End of game procedures
// ---------------------------------------------------------------------
function game_over()
{
	var i, j;

	// Game over, remove all cells listeners
	$(".cell").unbind();

	// Show all mines position except the exploded one
	for (i = 0; i < rows_number; i++)
	{
		for (j = 0; j < cols_number; j++)
		{
			// Show wrong marked mine
			if (marked_cells[i][j] == "M" && field[i][j] != "*")
			{
				$("#row" + i + "col" + j + " .front").addClass("wrong_mine");
			}

			// Show non-marked mines
			if (field[i][j] == "*" && open_cells[i][j] == 0)
			{
				$("#row" + i + "col" + j + " .front").addClass("demined");
			}
		}
	}
	
	flip_open_cells();
}



// Update visual indicators (remaining cells, mines, etc)
// ---------------------------------------------------------------------
function update_indicators()
{
	var i, j;
	var remaining_cells = (rows_number * cols_number) - mine_number - open_cells_number;

	// Update remaining non-opened cells indicator
	$("#remaining_cells").html(remaining_cells.toString());

	// Update remaining mines indicator
	marked_mines_number = 0;

	for (i = 0; i < rows_number; i++)
	{
		for (j = 0; j < cols_number; j++)
		{
			if (marked_cells[i][j] == "M")
			{
				marked_mines_number++;
			}
		}
	}
	
	var remaining_mines = mine_number - marked_mines_number;

	$("#remaining_mines").html(remaining_mines.toString());
}



// Right mouse click listener, for cell marking capability
// ---------------------------------------------------------------------
function right_mouse_button(e)
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
		if (open_cells[row][column] == 1)
		{
			return false;
		}

		// Jump between cell possible states
		if (marked_cells[row][column] == "") marked_cells[row][column] = "M";
		else if (marked_cells[row][column] == "M") marked_cells[row][column] = "?";
		else if (marked_cells[row][column] == "?") marked_cells[row][column] = "";
		
		// Vibrate on mobile devices
		if (navigator.vibrate && vibration)
		{
			navigator.vibrate(30);
		}



		// Write value into displayed cell
		$("#row" + row + "col" + column + " .front").html(marked_cells[row][column]);

		// If cell assumes mied state, remove opening cell listener
		if (marked_cells[row][column] == "M")
		{
			$("#row" + row + "col" + column).unbind("click");
		}

		// If cell is de-marked, reapply click-to-open listener
		if (marked_cells[row][column] == "")
		{
			$("#row" + row + "col" + column).click(cell_click);
		}

		// Update visual indicators
		update_indicators();
	}
}



// Toggle options menu
// --------------------------------------------------------
function toggle_options()
{
	if (! options_opened)
	{
		open_options();
	}
	
	else
	{
		close_options();
	}
}



// Open options menu
// --------------------------------------------------------
function open_options()
{
	$('#controls_box').animate({'top': '0px'});
	options_opened = true;
}



// Close options menu
// --------------------------------------------------------
function close_options()
{
	var controls_h = $('#controls_box').outerHeight();
	var indicators_h = $('#indicators').outerHeight();

	$('#controls_box').animate({'top': "-" + (controls_h - indicators_h) + 'px'});

	options_opened = false;
}