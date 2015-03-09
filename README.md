# cordova-filestorage
by [Christian Cook](http://twitter.com/cookie_cookson)

##Description

Cordova File Storage is a JavaScript library which mimics the functionality of HTML5 Local Storage but avoids storage-based limits of the browser. As the File API is asynchronous the response is returned in a callback function upon completion. The data is stored as JSON files inside your App's binary, allowing you to store large arrays with minimal effort. If on a Desktop browser, the data will be stored within the Persistent Storage; this makes it useful for Desktop development and testing. If Persistent Storage is not supported, the library will fall back to Local Storage.

## Installation
```
cordova plugin add org.apache.cordova.file
```
This library requires the Cordova File plugin to operate. Also copy across filestorage.js to your www directory and get started!

## Usage

```
fileStorage.setItem(key:String, value:Object, callback:Function)
```
This sets a key with a value and returns a success boolean into the callback function.

```
fileStorage.getItem(key:String, callback:Function)
```
This retrieves the value of a key and returns the data into the callback function.

```
fileStorage.removeItem(key:String, callback:Function)
```
This removes the key and returns a success into the callback function.

## Notes

Due to the nature of reading/writing to the device, this method is significantly slower than using HTML5 Local Storage.

##Licence

[The MIT License (MIT)](http://www.opensource.org/licenses/mit-license.html)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
