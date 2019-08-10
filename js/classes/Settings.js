class Settings
{

	// Cookie loading
	// ---------------------------------------------------------------------
	load()
	{
		var i;
		var ca;

		this.vibration = true;
		this.animations = true;

		this.field = {};
		this.field.rows_number = 10;
		this.field.cols_number = 10;
		this.field.mine_number = 10;

		ca = document.cookie.split(';');

		// Parse cookies and get settings
		for (i = 0; i < ca.length; i++)
		{
			var c = ca[i];

			// Remove all leading spaces
			while (c.charAt(0) == ' ')
			{
				c = c.substring(1);
			}

			// Cookies
			// ---------------

			// Rows number
			if (c.indexOf('rows_number') == 0)
			{
				this.field.rows_number = c.substring(12, c.length);
			}

			// Columns number
			if (c.indexOf("cols_number") == 0)
			{
				this.field.cols_number = c.substring(12, c.length);
			}

			// Mines number
			if (c.indexOf("mine_number") == 0)
			{
				this.field.mine_number = c.substring(12, c.length);
			}

			// Vibration flag
			if (c.indexOf("vibration") == 0)
			{
				this.vibration = (c.substring(10, c.length) === 'true') ? true : false;
			}

			// Animations flag
			if (c.indexOf("animations") == 0)
			{
				this.animations = (c.substring(11, c.length) === 'true') ? true : false;
			}
		}


		// Copy values in parameters textfields
		$('#rows_number').val(this.field.rows_number);
		$('#cols_number').val(this.field.cols_number);
		$('#mine_number').val(this.field.mine_number);
		$('#vibration').prop('checked', this.vibration);
		$('#animations').prop('checked', this.animations);
	}



	// Save ano option to cookie
	// ---------------------------------------------------------------------
	save_to_cookie(name, value)
	{
	    var d = new Date();
	    var expiration_days = 30;

	    d.setTime(d.getTime() + (expiration_days * 24 * 60 * 60 * 1000));

	    var expires = "expires=" +  d.toUTCString();
	    var cookie_str = name + "=" + value + "; " + expires;

	    document.cookie = cookie_str;
	}
}