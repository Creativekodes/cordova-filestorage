var fileStorage = {};

// Use Persistent data storage for Desktop support
fileStorage.fileSystemType = 1;

// Set the data storage maximum size for Desktop support (default: 10mb)
fileStorage.size = 10 * 1024 * 1024;

fileStorage.getItem = function(key, callback) {
    // Cordova Implementation
    if (typeof cordova !== "undefined") window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fs) {
        fileStorage.getItemHandler(fs.filesystem, key, callback);
    });
    // Webkit Implementation
    else if (window.webkitRequestFileSystem) window.webkitRequestFileSystem(
        fileStorage.fileSystemType,
        fileStorage.size,
        function(fs) {
            fileStorage.getItemHandler(fs, key, callback)
        }
    );
    // Non-webkit Implementation
    else if (window.requestFileSystem) window.requestFileSystem(
        fileStorage.fileSystemType,
        fileStorage.size,
        function(fs) {
            fileStorage.getItemHandler(fs, key, callback)
        }
    );
    // localStorage Fallback
    else {
        console.warn("requestFileSystem not supported on this device, getting from localStorage");
        if (callback !== undefined) callback(localStorage.getItem(key));
    }
};

fileStorage.setItem = function(key, value, callback) {
    // Cordova Implementation
    if (typeof cordova !== "undefined") window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fs) {
        fileStorage.setItemHandler(fs.filesystem, key, value, callback);
    });
    // Webkit Implementation
    else if (window.webkitRequestFileSystem) window.webkitRequestFileSystem(
        fileStorage.fileSystemType,
        fileStorage.size,
        function(fs) {
            fileStorage.setItemHandler(fs, key, value, callback);
        }
    );
    // Non-webkit Implementation
    else if (window.requestFileSystem) window.requestFileSystem(
        fileStorage.fileSystemType,
        fileStorage.size,
        function(fs) {
            fileStorage.setItemHandler(fs, key, value, callback);
        }
    );
    // localStorage Fallback
    else {
        console.warn("requestFileSystem not supported on this device, storing in localStorage");
        if (callback !== undefined) callback(localStorage.setItem(key, value));
    }
};

fileStorage.removeItem = function(key, callback) {
    // Cordova Implementation
    if (typeof cordova !== "undefined") window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fs) {
        fileStorage.removeItemHandler(fs.filesystem, key, callback);
    });
    // Webkit Implementation
    else if (window.webkitRequestFileSystem) window.webkitRequestFileSystem(
        fileStorage.fileSystemType,
        fileStorage.size,
        function(fs) {
            fileStorage.removeItemHandler(fs, key, callback);
        }
    );
    // Non-webkit Implementation
    else if (window.requestFileSystem) window.requestFileSystem(
        fileStorage.fileSystemType,
        fileStorage.size,
        function(fs) {
            fileStorage.removeItemHandler(fs, key, callback);
        }
    );
    // localStorage Fallback
    else {
        console.warn("requestFileSystem not supported on this device, removing from localStorage");
        if (callback !== undefined) callback(localStorage.removeItem(key));
    }
};

fileStorage.getItemHandler = function(fs, key, callback) {
    fs.root.getFile(key+'.txt', {}, function(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(fileContents) {
                if (callback !== undefined) callback(fileContents?JSON.parse(this.result):null);
            };
            reader.readAsText(file);
        }, function(error) {
            if (error.code !== 1) console.log("fileStorage.getItem.getFile.file: error", error);
            if (callback !== undefined) callback(null);
        });

    }, function(error) {
        if (error.code !== 1) console.log("fileStorage.getItem.getFile: error", error);
        if (callback !== undefined) callback(null);
    });
};

fileStorage.setItemHandler = function(fs, key, value, callback) {
    fs.root.getFile(key+".txt", {create: true}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            var truncated = false;
            fileWriter.onwriteend = function(end) {
                if (!truncated) {
                    truncated = true;
                    this.truncate(this.position);
                    if (callback !== undefined) callback(true);
                }
            };
            fileWriter.onerror = function(error) {
                console.log("fileStorage.setItem.createWriter: error", error);
                if (callback !== undefined) callback(false);
            };
            var blob = new Blob([JSON.stringify(value)], {type: 'text/plain'});
            fileWriter.write(blob);
        }, function(error) {
            console.log("fileStorage.setItem.createWriter: error", error);
            if (callback !== undefined) callback(false);
        });
    }, function(error) {
        console.log("fileStorage.getItem.getFile: error",error);
        if (callback !== undefined) callback(false);
    });
};

fileStorage.removeItemHandler = function(fs, key, callback) {
    fs.root.getFile(key+'.txt', {}, function(fileEntry) {
        fileEntry.remove(function(file) {
            if (callback !== undefined) callback(true);
        }, function(error) {
            console.log("fileStorage.removeItem.removeItem: error deleting the file " + error.code);
            if (callback !== undefined) callback(false);
        });
    }, function(error) {
        if (error.code !== 1) console.log("fileStorage.removeItem.getFile: error", error);
        if (callback !== undefined) callback(false);
    });
};

fileStorage.getStorageUsage = function() {
    if (window.webkitRequestFileSystem) {
        if (navigator.webkitPersistentStorage) navigator.webkitPersistentStorage.queryUsageAndQuota(
            function(usage){
                window.webkitStorageInfo.requestQuota(fileStorage.fileSystemType, fileStorage.size * 1024 * 1024, function(capacity) {
                    console.log(usage/1024 + "/" + capacity/1024 + " kb")
                }, function(error) {
                    console.log('fileStorage.getStorageUsage.requestQuota: error', error);
                });
            }
        );
        else console.warn("webkitPersistentStorage not supported on this device: cannot return usage");
    } else if (window.requestFileSystem) {
        if (navigator.persistentStorage) navigator.persistentStorage.queryUsageAndQuota(
            function(usage){
                window.storageInfo.requestQuota(fileStorage.fileSystemType, fileStorage.size * 1024 * 1024, function(capacity) {
                    console.log(usage/1024 + "/" + capacity/1024 + " kb")
                }, function(error) {
                    console.log('fileStorage.getStorageUsage.requestQuota: error', error);
                });
            }
        );
        else console.warn("persistentStorage not supported on this device: cannot return usage");
    } else {
        var x, log=[], total = 0;
        for (x in localStorage) {
            log.push(x + " = " +  ((localStorage[x].length * 2)/1024/1024).toFixed(2) + " MB");
            total += localStorage[x].length * 2;
        };
        log.push("Total = " + (total/1024/1024).toFixed(2)+ " MB");
        console.log(log.join("\n"));
    }
};
