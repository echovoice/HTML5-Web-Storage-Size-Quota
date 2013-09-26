function checkWebStorageSizeQuota(storageTypes)
{
	//house the results
	this.storageResults = new Object();    
    
    //array of the types of Web Storage
    this.storage_types = storageTypes || ["localStorage", "sessionStorage", "globalStorage"];
    var that = this;
    
    var test = function()
    {
        //remaining space is only available in MSIE
        isIE = localStorage.remainingSpace !== 'undefined';
        
        //create the array of different sized objects. hold the length to prevent costly calls to array length property
        var arr = buildArray(); 
        var length = arr.length;
        
        //check for web storage
        for (i = 0; i < that.storage_types.length; i++)
        {
            //verify the browser supports this form of web storage
            if (supportsStorage(that.storage_types[i]))
            {
                //clear everything from web storage before starting
                window[that.storage_types[i]].clear();
                
                //iterate to find the maximum amount of data that can be stored
                checkSize(that.storage_types[i], arr, length);
                
                //store the results 
                that.storageResults[that.storage_types[i]] = storageSize(that.storage_types[i]);
                                
                //clear everything from web storage before starting on next test (Firefox fix)
                window[that.storage_types[i]].clear();
            }
            else
            {
                //not supported, -1 Byte capacity
                that.storageResults[that.storage_types[i]] = -1;
            }
        }
        return that.storageResults;	
    }   
    
	var checkSize = function(type, arr, length)
	{
		//create a key for each storage entry
		var iterator = 0;
		
		//count the iterations for each entry, this will be used for the "unlimited" cases, which would cause an infinite loop
		//the iterator counter eliminates the need to stringify the entire storage on each iteration and will break at ~20MB
		var arr_iterator = 0;
		
		//iterate over the array, from largest object to smallest
		for (j = length - 1; j >= 0; j--)
		{
			//reset array iterator
			arr_iterator = 0;
            			
			//iterate until the data can no longer be added to the the web storage
			while (addData(type, iterator++, arr[j]))
			{
				//increment the iterator
				arr_iterator++;
				
				//if we have added ~20MB, then this is considered "unlimited"
				if (j == length - 1 && arr_iterator >= 2)
					return;
			}
		}
	}
	
	var supportsStorage = function(type)
	{
		try
		{
			return (type in window && window[type] !== null);
		}
		catch (e) { console.log(e.stack); }
		return false;
	}
	
	var buildArray = function()
	{
		//build array, these will be the values that will be added to the web storage
		var b1 = "0";
		var b10 = increaseLength(b1, 10);
		var b100 = increaseLength(b10, 10);
		var kb1 = increaseLength(b100, 10);
		var kb10 = increaseLength(kb1, 10);
		var kb100 = increaseLength(kb10, 10);
		var mb1 = increaseLength(kb100, 10);
		var mb10 = increaseLength(mb1, 10);
		
		//return array of various sizes, ordered smallest to largest
		return [b1, b10, b100, kb1, kb10, kb100, mb1, mb10];
	}
		
	var increaseLength = function(string, times)
	{
		var temp = [];
		while (times--)
			temp.push(string);
		return temp.join('');    
	}    
	
	var addData = function(type, key, data)
	{
		//add data to new key, or replace value if the key already exists with new data
		try
		{
			//error isn't thrown in MSIE
			if (isIE)
			{
				if (getRemainingSpace(type) - data.length <= 0)
					return false;
			}
	
			//add the value to the key, equivalent to localStorage.setItem('key', 'value')
			window[type][key] = data;
			return true;
		}
		catch (e)
		{
			return false;
		}
	} 
	
	var getRemainingSpace = function(type)
	{
		//return the number of bytes still available in localStorage
		if (isIE)
			//only IE supports this function
			return window[type].remainingSpace; 
	}
	
	var storageSize = function(type)
	{
		//use stringify to determine the size of the web storage object
		return JSON.stringify(window[type]).length;
	}	
    
    this.prettyPrint = function()
    {
        var a = "";
        if (that.storageResults !== 'undefined')
        {
            for (i = 0; i < that.storage_types.length; i++)
            {
                if (that.storageResults.hasOwnProperty(that.storage_types[i]))
                    a += '<p>' + that.storage_types[i] + ': ' + that.storageResults[that.storage_types[i]] + ' Bytes</p>';	
            }
        }
        return a;
    }
	
	test();
}