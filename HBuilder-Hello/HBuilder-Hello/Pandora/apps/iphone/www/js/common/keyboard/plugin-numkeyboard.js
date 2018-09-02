
/**
 * 打开密码键盘
 * 
 * openKeyboard (Argus, successCallback, errorCallback) ;
 * openKeyboardSync (Argus) ; 
 * 
 * 
 */

document.addEventListener( "plusready",  function()
{
 var _BARCODE = 'pluginNumKeyBoard',
 B = window.plus.bridge;
 var pluginNumKeyBoard =
 {
    openNumKeyboard: function(Argus1,successCallback, errorCallback)
    {
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
        return B.exec(_BARCODE,"openNumKeyboard",[callbackID, Argus1]);
    },
    closeNumKeyboard: function(successCallback, errorCallback)
    {
        var success = typeof successCallback !== 'function' ? null : function(args)
        {
        successCallback(args);
        },
        fail = typeof errorCallback !== 'function' ? null : function(code)
        {
        	mui.alert("_E");
        };
        var callbackID = B.callbackId(success, fail);
        return B.exec(_BARCODE,"closeNumKeyboard",[callbackID]);
    }
 };
    
 window.plus.pluginNumKeyBoard = pluginNumKeyBoard;
    
}, true);