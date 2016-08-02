mineblaster.gui.menu = new Object();

mineblaster.gui.menu.opened = true;



// Open options menu
// --------------------------------------------------------
mineblaster.gui.menu.open = function ()
{
	if (mineblaster.animations)
	{
		$('#controls_box').animate({'top': '0px'});
	}
	else
	{
		$('#controls_box').css({'top': '0px'});
	}
	mineblaster.gui.menu.opened = true;
}



// Close options menu
// --------------------------------------------------------
mineblaster.gui.menu.close = function ()
{
	var controls_h = $('#controls_box').outerHeight();
	var indicators_h = $('#indicators').outerHeight();

	if (mineblaster.animations)
	{
		$('#controls_box').animate({'top': "-" + (controls_h - indicators_h) + 'px'});
	}
	else
	{
		$('#controls_box').css({'top': "-" + (controls_h - indicators_h) + 'px'});
	}

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