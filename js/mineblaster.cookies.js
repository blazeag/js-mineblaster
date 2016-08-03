mineblaster.cookies = new Object();



// Cookie loading
// ---------------------------------------------------------------------
mineblaster.cookies.load = function ()
{
	var i;
	var ca;
	
	mineblaster.vibration = true;
	mineblaster.animations = true;
	mineblaster.field.rows_number = 10;
	mineblaster.field.cols_number = 10;
	mineblaster.field.mine_number = 10;
	
    ca = document.cookie.split(';');
    
    for(i = 0; i < ca.length; i++)
    {
        var c = ca[i];
        
        while (c.charAt(0) == ' ')
        {
            c = c.substring(1);
        }
        
        if (c.indexOf('rows_number') == 0)
        {
        	mineblaster.field.rows_number = c.substring(12, c.length);
        }
        
        if (c.indexOf("cols_number") == 0)
        {
        	mineblaster.field.cols_number = c.substring(12, c.length);
        }
        
        if (c.indexOf("mine_number") == 0)
        {
        	mineblaster.field.mine_number = c.substring(12, c.length);
        }
        
        if (c.indexOf("vibration") == 0)
        {
        	mineblaster.vibration = (c.substring(10, c.length) === 'true') ? true : false;
        }
        
        if (c.indexOf("animations") == 0)
        {
        	mineblaster.animations = (c.substring(11, c.length) === 'true') ? true : false;
        }
    }
    
    
    // Set values in parameters textfields
	$('#rows_number').val(mineblaster.field.rows_number);
	$('#cols_number').val(mineblaster.field.cols_number);
	$('#mine_number').val(mineblaster.field.mine_number);
	$('#vibration').prop('checked', mineblaster.vibration);
	$('#animations').prop('checked', mineblaster.animations);
	
	//document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
}



// Set a cookie
// ---------------------------------------------------------------------
mineblaster.cookies.set = function (name, value)
{
    var d = new Date();
    var expiration_days = 30;
    
    d.setTime(d.getTime() + (expiration_days * 24 * 60 * 60 * 1000));
    
    var expires = "expires="+ d.toUTCString();
    
    var cookie_str = name + "=" + value + "; " + expires;
    
    document.cookie = cookie_str;
}
