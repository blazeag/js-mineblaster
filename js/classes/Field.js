class Field
{

	constructor(mineblaster, settings, gui)
	{
		this.mineblaster = mineblaster;
		this.settings = settings;
		this.gui = gui;

		this.rows_number = 10;		// Field rows number
		this.cols_number = 10;		// Field columns number
		this.mine_number = 10;		// Field mines number
		this.timeouts = [];		// Timeout container
	}


	// Field initialization
	// ---------------------------------------------------------------------
	initialize(self)
	{
		// Parameters check
		if (! self.check_parameters())
		{
			return false;
		};


		this.cells = [];	// Array containing mines and cells values
		this.open_cells_number = 0;		// Open cells counter
		this.marked_mines_number = 0;	// Mine-marked cells number
		this.just_opened_cells = [];	// List of just opened cells

		for (var i = 0; i < self.timeouts.length; i++)
		{
			clearTimeout(self.timeouts[i]);
		}

		self.gui.message.hide(self.settings.animations);

		// Change background color and then call field rebuilding
		self.gui.change_background(function() { self.rebuild(self); });

		// Close options, if open
		self.gui.menu.close(self.settings.animations);
	}



	// Parameters check
	// ---------------------------------------------------------------------
	check_parameters()
	{
		// Get highest row and column value
		var max_rows_number = $('#rows_number').attr("max");
		var max_cols_number = $('#cols_number').attr("max");

		// Get and check all field parameters
		var rows_number = parseInt($("#rows_number").val());
		var cols_number = parseInt($("#cols_number").val());
		var mine_number = parseInt($("#mine_number").val());

		// Parameters check
		if (rows_number < 1 || rows_number > max_rows_number)
		{
			this.gui.message.show("Max rows number is " + max_rows_number + "!", 300, this.settings.animations);
			$('#rows_number').val(max_rows_number);
			return false;
		}

		if (cols_number < 1 || cols_number > max_cols_number)
		{
			this.gui.message.show("Max columns number is " + max_cols_number + "!", 300, this.settings.animations);
			$('#cols_number').val(max_cols_number);
			return false;
		}

		if (mine_number <= 0)
		{
			this.gui.message.show("Put at least one mine in the field!", 300, this.settings.animations);
			return false;
		}

		if (mine_number > (rows_number * cols_number) - 1)
		{
			var max_mines = (rows_number * cols_number) - 1;
			this.gui.message.show("Mines saturate field!<br />Please decrease number of mines to a maximum of " + max_mines, 300, this.settings.animations);
			$("#mine_number").val(max_mines);
			return false;
		}


		// Store data to local vars
		this.rows_number = rows_number;
		this.cols_number = cols_number;
		this.mine_number = mine_number;

		// Set cookies
		this.settings.save_to_cookie('rows_number', this.rows_number);
		this.settings.save_to_cookie('cols_number', this.cols_number);
		this.settings.save_to_cookie('mine_number', this.mine_number);

		return true;
	}



	// Rebuild field
	// ---------------------------------------------------------------------
	rebuild(self)
	{
		// Field disposition
		self.generate();
		self.plant_mines();
		self.calculate_cells_values();
		self.draw();

		self.gui.update_indicators(self);

		// Unbind all previously associated cells listeners
		$(".cell").off();

		// Associate new events to cells
		$(".cell").on("click", function(e) { self.cell_click(e, self); });				// Cell opening listener
		$(".cell").on("dblclick", function(e) { self.open_surrounding_cells(e, self) });		// Surrounding cells opening listener
		$(".cell").on("mousedown", function(e) { self.right_mouse_button(e, self); });			// Cell marking listener
		$("#field").on("contextmenu", function (e) { e.preventDefault(); });	// Avoid cells contextual menu on right mouse button click

	}



	// Field data arrays initialization
	// ---------------------------------------------------------------------
	generate()
	{
		this.just_opened_cells = [];

		// Draw field row by row
		for (var i = 0; i < this.rows_number; i++)
		{
			this.cells[i] = [];

			// Column by column
			for (var j = 0; j < this.cols_number; j++)
			{
				this.cells[i][j] = new Cell();
			}
		}
	}



	// Mine positioning
	// ---------------------------------------------------------------------
	plant_mines()
	{
		// Distribute required mines number
		for (var i = 0; i < this.mine_number; i++)
		{
			// Search for a random non-mined cell
			do
			{
				var random_row = Math.floor(Math.random() * this.rows_number);
				var random_column = Math.floor(Math.random() * this.cols_number);
			}
			while (this.cells[random_row][random_column].mined == true);

			// Found a free cell, flag it as mined
			this.cells[random_row][random_column].mined = true;
		}
	}



	// Cell value calculation
	// ---------------------------------------------------------------------
	calculate_cells_values()
	{
		var adjacent_mines;
		var i, j, k, w;

		// Row by row
		for (i = 0; i < this.rows_number; i++)
		{
			// Column by column
			for (j = 0; j < this.cols_number; j++)
			{
				// Set cell adjacent mines number to zero
				adjacent_mines = 0;

				// Calculate only if cell is not mined
				if (this.cells[i][j].mined == false)
				{
					// From one line above to one line below
					for (k = -1; k < 2; k++)
					{
						// From one column to the left to one column to the right
						for (w = -1; w < 2; w++)
						{
							if (i + k < 0) continue; // Skip if above row is out of the field
							if (i + k >= this.rows_number) continue; // Skip if below row is out of the field
							if (j + w < 0) continue; // Skip if left column is out of the field
							if (j + w >= this.cols_number) continue; // Skip if right column is out of the
							if (k == 0 && w == 0) continue; // Don't compare a cell with itself

							// If current cell contains a mine, increase adjacent
							// mines counter for this cell
							if (this.cells[i + k][j + w].mined == true)
							{
								adjacent_mines++;
							}
						}
					}

					// Insert found value into cell value
					this.cells[i][j].adjacent_mines = adjacent_mines;
				}
			}
		}

	}



	// Field drawing procedure
	// ---------------------------------------------------------------------
	draw()
	{
		var field_el = $('#field'); // Field HTML element
		var field_string = ''; // Empty HTML field string

		// Unbind events and empty field
		field_el.off();
		field_el.empty();

		var field_str = "";

		// Row by row
		for (var i = 0; i < this.rows_number; i++)
		{
			// Column by column
			for (var j = 0; j < this.cols_number; j++)
			{
				field_str += '<div class="cell" data-row="' + i + '" data-col="' + j + '"><div class="front"></div><div class="back"></div></div>';
			}
		}

		// Insert HTML field string into field HTML element
		field_el.append(field_str);

		// Resize field to fit window width/height
		this.resize(this);
	}



	// Cell click listener callback
	// ---------------------------------------------------------------------
	cell_click(e, self)
	{
		// Get pressed cell row and column number
		var el = $(e.target).parent();

		var row = el.data('row');
		var column = el.data('col');

		// Manage cell opening
		self.open_cell(row, column, 0);
	}



	// Cell opening procedure
	// ---------------------------------------------------------------------
	open_cell(row, column, stack_level)
	{
		var self = this;

		// Cell HTML element
		var cell = $("[data-row='" + row + "'][data-col='" + column + "']");

		// If cell doesn't contain a mine, and it is not an alreay opened cell, increase open cells counter
		if (this.cells[row][column].mined == false && this.cells[row][column].open == false)
		{
			this.open_cells_number++;
		}

		// Update visual indicators
		this.gui.update_indicators(this);

		// Flag cell as opened
		this.cells[row][column].open = true;
		this.just_opened_cells.push([row, column]);

		// Remove any cell flags and markers
		this.cells[row][column].marker = '';

		// If cell has a numeric value, apply suited class
		cell.addClass("mine_" + this.cells[row][column].adjacent_mines);

		// If a mined cell was pressed, you're dead
		if (this.cells[row][column].mined == true)
		{
			cell.children(".back").addClass("mine");		// Apply mined CSS class
			setTimeout(function() { self.gui.message.show("You're dead :(", 500, self.settings.animations, true, self); }, 1000);		// Warn of death
			this.mineblaster.game_over();			// Call end of game function

			return;
		};

		// If remaining unopened cells number is 0, win
		if (this.open_cells_number == (this.rows_number * this.cols_number) - this.mine_number)
		{
			setTimeout(function() { self.gui.message.show("You win! :)", 500, self.settings.animations, true, self); }, 1000);		// Warn of victory
			$('#remaining_cells, #remaining_mines').html('0');
			this.mineblaster.game_over();			// Call end of game function
			return;
		}

		// If cell has zero value, recursively open all surrounding cells
		if (this.cells[row][column].adjacent_mines == 0)
		{
			for (var i = -1; i < 2; i++)
			{
				for (var j = -1; j < 2; j++)
				{
					if (row + i < 0) continue;
					if (row + i >= this.rows_number) continue;
					if (column + j < 0) continue;
					if (column + j >= this.cols_number) continue;
					if (i == 0 && j == 0) continue;
					if (this.cells[row + i][column + j].open == true) continue;

					this.open_cell(row + i, column + j, stack_level + 1);
				}
			}
		}

		if (stack_level == 0)
		{
			this.flip_open_cells();
		}

	}



	// Perpetrate cell opening
	// ---------------------------------------------------------------------
	flip_open_cells()
	{
		var delay = 0;

		// Flip all just opened cells in the same order they where opened
		for (var i = 0; i < this.just_opened_cells.length; i++)
		{
			if (i == 0 && navigator.vibrate && this.settings.vibration)
			{
				navigator.vibrate(30);
			}

			var row = this.just_opened_cells[i][0];
			var column = this.just_opened_cells[i][1];

			if (this.cells[row][column].open == true)
			{
				var func = "$(\"[data-row='" + row + "'][data-col='" + column + "']\").addClass('open_cell');";

				// If animations are enabled, queue them
				if (this.settings.animations)
				{
					this.timeouts.push(setTimeout(func, 20 + delay));
				}

				// If animations are disabled, don't start them
				else
				{
					$("[data-row='" + row + "'][data-col='" + column + "']").addClass('open_cell');
				}

				// 10ms delay between cells opening
				delay += 20;
			}
		}

		// Empty just opened cells array
		this.just_opened_cells = [];
	}



	// If double click on opened cell, if it has a satisfied mine number,
	// open all surrounding cells, except for mine-flagged ones
	// ---------------------------------------------------------------------
	open_surrounding_cells(e, self)
	{
		var marked_mines_number = 0;

		var el = $(e.target).parent();
		var row = el.data("row");
		var column = el.data("col");

		// If cell is not open, skip (it shouldn't be a possible case)
		if (self.cells[row][column].open == false)
		{
			return false;
		}

		// Row by row
		for (var i = -1; i < 2; i++)
		{
			// Column by column
			for (var j = -1; j < 2; j++)
			{
				if (row + i < 0) continue;
				if (row + i >= self.rows_number) continue;
				if (column + j < 0) continue;
				if (column + j >= self.cols_number) continue;
				if (i == 0 && j == 0) continue;
				if (self.cells[row + i][column + j].open == true) continue;

				if (self.cells[row + i][column + j].marker == "M") marked_mines_number++;
			}
		}

		// If marked mines is greater or equal to cell value,
		// open all non-market surrounding ones
		if (marked_mines_number >= self.cells[row][column].adjacent_mines)
		{
			// Row by row
			for (var i = -1; i < 2; i++)
			{
				// Column by column
				for (var j = -1; j < 2; j++)
				{
					if (row + i < 0) continue;
					if (row + i >= self.rows_number) continue;
					if (column + j < 0) continue;
					if (column + j >= self.cols_number) continue;
					if (i == 0 && j == 0) continue;
					if (self.cells[row + i][column + j].open == true) continue;

					// Do cell opening
					if (self.cells[row + i][column + j].marker != "M")
					{
						self.open_cell(row + i, column + j, 1);	// Stack start from 1 because at level 0 it calls flip. Instead is going to be called here
					}
				}
			}
		}

		self.flip_open_cells();
	}



	// Right mouse click listener, for cell marking capability
	// ---------------------------------------------------------------------
	right_mouse_button(e, self)
	{
		// 3 is right mouse button value
		if (e.which === 3)
		{
			// Get pressed cell row and column number
			var el = $(e.target).parent();

			var row = el.data("row");
			var column = el.data("col");

			// If cell is already open, do nothing
			if (self.cells[row][column].open == 1)
			{
				return false;
			}

			// Jump between cell possible states
			if (self.cells[row][column].marker == "")
			{
				self.cells[row][column].marker = "M";
				el.addClass('mined');
			}
			else if (self.cells[row][column].marker == "M")
			{
				self.cells[row][column].marker = "?";
				el.removeClass('mined');
				el.addClass('unknown');
			}
			else if (self.cells[row][column].marker == "?")
			{
				self.cells[row][column].marker = "";
				el.removeClass('unknown');
			}


			// Vibrate on mobile devices
			if (navigator.vibrate && self.settings.vibration)
			{
				navigator.vibrate(30);
			}




			// If cell assumes mied state, remove opening cell listener
			if (self.cells[row][column].marker == "M")
			{
				el.off("click");
			}

			// If cell is de-marked, reapply click-to-open listener
			if (self.cells[row][column].marker == "")
			{
				el.on("click", function(e) { self.cell_click(e, self); });
			}

			// Update visual indicators
			self.gui.update_indicators(self);
		}
	}



	// Resize field cells to fit window size
	// ---------------------------------------------------------------------
	resize(self)
	{
		// Disable transition effect for cells
		$(".cell").addClass("no_transition");

		// Set field size
		var window_w = $(window).outerWidth();
		var window_h = $(window).outerHeight() - $('#indicators').outerHeight() - 10;

		var cell_w = window_w / this.cols_number;
		var cell_h = window_h / this.rows_number;
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

		var field_w = (cell_w * this.cols_number);
		var field_h = cell_h * this.rows_number;

		$('#field').width(field_w);
		$('#field').height(field_h);

		// Center field horizontally
		var offset_x = ($(window).outerWidth() - $('#field').outerWidth()) / 2;
		$('#field').css({
			'left' : offset_x + 'px'
		});

		// Center field vertically
		var controls_height = $('#indicators').outerHeight();
		var field_y = (($(window).outerHeight() - controls_height - $('#field').outerHeight()) / 2);

		if (field_y < 0) field_y = 0;

		var offset_y = controls_height + field_y;
		$('#field').css({'top' : offset_y + 'px'});

		// Re-enable transition effect for cells
		$(".cell").removeClass("no_transition");

		// Centers message, if open
		self.gui.message.center();
	}
}