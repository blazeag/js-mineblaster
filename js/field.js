// Field data arrays initialization
// ---------------------------------------------------------------------
function generate_field()
{
	var i, j;
	
	var random = Math.floor(Math.random() * background_colors.length);

	$('body').css('background-color', background_colors[random]);
	
	// Row by row
	for (i = 0; i < rows_number; i++)
	{
		field[i] = new Array();
		open_cells[i] = new Array();
		marked_cells[i] = new Array();

		// Column by column
		for (j = 0; j < cols_number; j++)
		{
			field[i][j] = "";
			open_cells[i][j] = 0;
			marked_cells[i][j] = "";
		}
	}
}



// Field drawing procedure
// ---------------------------------------------------------------------
function draw_field()
{
	var i, j;			// Counters
	var field = $('#field');	// Field HTML element
	var field_string = '';		// Empty HTML field string


	// Empty field
	field.html('');

	// Fraw field into a HTML table
	field_string += '<table>';

	// Row by row
	for (i = 0; i < rows_number; i++)
	{
		field_string += '<tr>';

		// Column by column
		for (j = 0; j < cols_number; j++)
		{
			field_string += '<td id="row' + i + 'col' + j + '"></td>';
		}

		field_string += '</tr>';
	}

	field_string += '</table>';

	// Insert HTML field string into field HTML element
	field.append(field_string);
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
						if (i + k < 0) continue;			// Skip if above row is out of the field
						if (i + k >= rows_number) continue;		// Skip if below row is out of the field
						if (j + w < 0) continue;			// Skip if left column is out of the field
						if (j + w >= cols_number) continue;		// Skip if right column is out of the field
						if (k == 0 && w == 0) continue;			// Don't compare a cell with itself

						// If current cell contains a mine, increase adjacent mines counter for this cell
						if ( field[i+k][j+w] == "*" )		
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
