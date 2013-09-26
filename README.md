HTML5-Web-Storage-Size-Quota
============================
Teddy Garland
Echovoice
9/24/2013
v1.0


Purpose
============================
Check a browser's size quota for each type of Web Storage. This is designed to be a very fast test, one that can be run when a user comes to a site that requires Web Storage. 

Since browsers are inconsistent with the amount of Web Storage, and there are so many versions in the wild, cached results are not the best indication of the Web Storage capacity.

This test has taken under 200ms on my computer for all browsers tested. 

Usage
============================
Call ```checkWebStorageSizeQuota()``` and pass in the types of Web Storage that you would like to check, by default they will all be checked. 

There are three flavors of Web Storage.

1. localStorage: persists beyond the current session
2. sessionStorage: persists during the life of the current tab
3. globalStorage: largely deprecated, use localStorage instead


The response object contains the total number of Bytes that are available for each type of Web Storage specified in the ```checkWebStorageSizeQuota()``` constructor. 

If a Web Storage type is not available, it will return -1. If the Web Storage capacity is 'unlimited' it will return 20000015.

Sample API call:
```javascript
var storageResults = new checkWebStorageSizeQuota();
```

Sample response object:
```javascript
storageResults: Object
globalStorage: -1
localStorage: 2621549
sessionStorage: 2621549
```

Performance
============================
Performance will vary based on the computer and browser. Some sample times from my computer are:

```
Storage Type          Chrome 29   Firefox 24    IE10    Safari 5

localStorage            189ms       23ms        55ms      0ms
sessionStorage          156ms       22ms        45ms      0ms
globalStorage           0ms         0ms         0ms       0ms
```

globalStorage is 0ms since it is not supported, Safari is not reporting accurately.

Methods
============================
The constructor ```new checkWebStorageSizeQuota()``` will handle the running of the test. 

The ```prettyPrint()``` method will return HTML containing the results for each Web Storage type tested.
