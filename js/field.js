// Field data arrays initialization
// ---------------------------------------------------------------------
function generate_field()
{
	var i, j;
	var random;

	just_opened_cells = [];

	do
	{
		random = Math.floor(Math.random() * background_colors.length);
	}
	while (random == current_background);

	current_background = random;

	$('#controls_box').stop().animate({
		'background-color' : background_colors[random]
	});

	// Background color animation
	$('body').stop().animate({
		'background-color' : background_colors[random]
	});

	// Draw field row by row
	for (i = 0; i < rows_number; i++)
	{
		field[i] = new Array();
		open_cells[i] = new Array();
		marked_cells[i] = new Array();

		// Column by column
		for (j = 0; j < cols_number; j++)
		{
			field[i][j] = "";
			marked_cells[i][j] = "";
			open_cells[i][j] = 0;
		}
	}
	
	// Close options
	close_options();
}

// Field drawing procedure
// ---------------------------------------------------------------------
function draw_field()
{
	var i, j; // Counters
	var field = $('#field'); // Field HTML element
	var field_string = ''; // Empty HTML field string

	// Empty field
	field.html('');

	// Draw field into a HTML table
	var cells_container = $('<div id="cells_container">');

	// Row by row
	for (i = 0; i < rows_number; i++)
	{
		// Column by column
		for (j = 0; j < cols_number; j++)
		{
			var cell_id = 'row' + i + 'col' + j;
			var cell = $('<div class="cell_container"><div class="cell" id="' + cell_id + '"><div class="front"></div><div class="back"></div></div></div>');
			
			cells_container.append(cell);
		}
	}

	// Insert HTML field string into field HTML element
	field.append(cells_container);

	// Resize field to fit window width/height
	resize_field();
}

// Resize field cells to fit window size
// ---------------------------------------------------------------------
function resize_field()
{
	var i, j;
	
	// Enable transition effect for cells
	$(".cell").addClass("no_transition");

	// Set field size
	var window_w = $(window).outerWidth();
	var window_h = $(window).outerHeight() - $('#indicators').outerHeight() - 10;

	var cell_w = window_w / cols_number;
	var cell_h = window_h / rows_number;
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

	$("div.cell_container").width(cell_w);
	$("div.cell_container").height(cell_h);

	var field_w = (cell_w * cols_number);
	var field_h = cell_h * rows_number;

	$('#cells_container').width(field_w);
	$('#cells_container').height(field_h);

	font_size = cell_w / 2.5;
	pad_top = cell_w / 4;

	// Trick to vertically center numbers
	$(".cell .front, .cell .back").css({
		fontSize : font_size + 'px',
		paddingTop : pad_top + 'px'
	});

	// Center horizontally
	var offset_x = ($(window).outerWidth() - $('#field').outerWidth()) / 2;
	$('#field').css({
		'left' : offset_x + 'px'
	});

	// Center vertically
	var controls_height = $('#indicators').outerHeight() + 10;
	var field_y = (($(window).outerHeight() - controls_height - $('#field').outerHeight()) / 2);
	
	if (field_y < 0) field_y = 0;
	
	var offset_y = controls_height + field_y;
	$('#field').css({
		'top' : offset_y + 'px'
	});
	
	for (i = 0; i < rows_number; i++)
	{
		for (j = 0; j < cols_number; j++)
		{
			var cell = $('#row' + i + 'col' + j);
			
			var y = i * cell_h;
			var x = j * cell_w;
			
			cell.parent().css({top: y, left: x});
		}
	}

	// Enable transition effect for cells
	$(".cell").removeClass("no_transition");

	// Centers message, if open
	center_message();
}

// Cell value calculation
// ---------------------------------------------------------------------
function calculate_cells_values()
{
	var adjacent_mines;
	var i, j, k, w;

	// Row by row
	for (i = 0; i < rows_number; i++)
	{
		// Column by column
		for (j = 0; j < cols_number; j++)
		{
			// Set cell adjacent mines number to zero
			adjacent_mines = 0;

			// Calculate only if cell is not mined
			if (field[i][j] != "*")
			{
				// From one line above to one line below
				for (k = -1; k < 2; k++)
				{
					// From one column to the left to one column to the right
					for (w = -1; w < 2; w++)
					{
						if (i + k < 0) continue; // Skip if above row is out of the field
						if (i + k >= rows_number) continue; // Skip if below row is out of the field
						if (j + w < 0) continue; // Skip if left column is out of the field
						if (j + w >= cols_number) continue; // Skip if right column is out of the
						if (k == 0 && w == 0) continue; // Don't compare a cell with itself

						// If current cell contains a mine, increase adjacent
						// mines counter for this cell
						if (field[i + k][j + w] == "*")
						{
							adjacent_mines++;
						}
					}
				}

				// Insert found value into cell value
				field[i][j] = adjacent_mines;
			}
		}
	}

}

// Mine positioning
// ---------------------------------------------------------------------
function plant_mines()
{
	var i;
	var random_row, random_column;

	// Distribute required mines number
	for (i = 0; i < mine_number; i++)
	{
		// Search for a random non-mined cell
		do
		{
			random_row = Math.floor(Math.random() * rows_number);
			random_column = Math.floor(Math.random() * cols_number);
		}
		while (field[random_row][random_column] == "*");

		// Found a free cell, flag it as mined
		field[random_row][random_column] = "*";
	}
}
