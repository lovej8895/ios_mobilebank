
/**
 * 打开密码键盘
 * 
 * openKeyboard (Argus, successCallback, errorCallback) ;
 * openKeyboardSync (Argus) ; 
 * 
 * 
 */

//document.addEventListener("plusready",  function()
//{
//                          
//    var _BARCODE = 'pluginKeyBoard',
//    B = window.plus.bridge;
//    var pluginKeyBoard =
//    {
//        encryptSync : function()
//        {
//            return B.execSync(_BARCODE, "encryptSync");
//        },
//        encrypt : function(successCallback, errorCallback)
//        {
//            var success = typeof successCallback !== 'function' ? null : function(args)
//            {
//                successCallback(args);
//            },
//            fail = typeof errorCallback !== 'function' ? null : function(code)
//           {
//            errorCallback(code);
//           };
//            callbackID = B.callbackId(success, fail);
//            return B.exec(_BARCODE, "encrypt", [callbackID]);
//        }
//    };
//    window.plus.pluginKeyBoard = pluginKeyBoard;
//}, true );

document.addEventListener( "plusready",  function()
{
 var _BARCODE = 'pluginKeyBoard',
 B = window.plus.bridge;
 var pluginKeyBoard =
 {
    openKeyboard: function(Argus1, successCallback, errorCallback)
    {
                          //           mui.alert("5_E");
                          
                          //if (_deviceReady)
                          //{
                          //            var jsonData={
                          //                "showValueID":showValueID,
                          //                "hiddenID":hiddenID
                          //            };
        var success = typeof successCallback !== 'function' ? null : function(args)
        {
        successCallback(args);
        },
        fail = typeof errorCallback !== 'function' ? null : function(code)
        {
        mui.alert("_E");
        };
        //                          mui.alert("_E");
        var callbackID = B.callbackId(success, fail);
        return B.exec(_BARCODE,"openKeyboard",[callbackID, Argus1]);
                          //}
        
    },
    PluginTestFunction : function (Argus1, Argus2, Argus3, Argus4, successCallback, errorCallback )
    {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
            successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
            errorCallback(code);
            };
            callbackID = B.callbackId(success, fail);
            
            return B.exec(_BARCODE, "PluginTestFunction", [callbackID, Argus1, Argus2, Argus3, Argus4]);
    },
    PluginTestFunctionArrayArgu : function (Argus, successCallback, errorCallback )
    {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
            successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
            errorCallback(code);
            };
            callbackID = B.callbackId(success, fail);
            return B.exec(_BARCODE, "PluginTestFunctionArrayArgu", [callbackID, Argus]);
    },
    PluginTestFunctionSync : function (Argus1, Argus2, Argus3, Argus4)
    {
            return B.execSync(_BARCODE, "PluginTestFunctionSync", [Argus1, Argus2, Argus3, Argus4]);
    },
    PluginTestFunctionSyncArrayArgu : function (Argus)
    {
        return B.execSync(_BARCODE, "PluginTestFunctionSyncArrayArgu", [Argus]);
    }
 };
    
 window.plus.pluginKeyBoard = pluginKeyBoard;
    
}, true);