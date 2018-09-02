//
//  PGCommon.m
//  HBuilder-Hello
//
//  Created by LiYuan on 16/1/7.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import "PGCommon.h"
#import "JZYHDictionary.h"
#import "CrashHelper.h"
@implementation PGCommon

void uncaughtExceptionHandler(NSException *exception){
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSLog(@"infoDictionary==%@",infoDictionary.description);
    
    // app名称
    NSString *app_Name = [infoDictionary objectForKey:@"CFBundleName"];
    NSLog(@"app_Name==%@",app_Name);
    
    // app版本
    
    NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
    NSLog(@"app_Version==%@",app_Version);
    
    // app build版本
    
    NSString *app_build = [infoDictionary objectForKey:@"CFBundleVersion"];
    NSLog(@"app_build==%@",app_build);
    
    //异常堆栈信息
    NSArray *stackArray = [exception callStackSymbols];
    
    // 出现异常的原因
    NSString *reason = [exception reason];
    
    // 异常名称
    NSString *name = [exception name];
    
    //userInfor
    NSDictionary *userInfor = [exception userInfo];
    
    NSString *exceptionInfo = [NSString stringWithFormat:@"Exception name == %@\nException reason == %@\nException stack == %@\nUserInfor == %@",name, reason, stackArray, userInfor.description];
    
    NSLog(@"exceptionInfo ：%@", exceptionInfo);
    
    NSMutableArray *tmpArr = [NSMutableArray arrayWithObject:exceptionInfo];
    
    [tmpArr insertObject:reason atIndex:0];    //保存到本地  --  当然你可以在下次启动的时候，上传这个log
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"yyyyMMddHHmmss"];
    NSString *dateTime = [formatter stringFromDate:[NSDate date]];
    
    
    
    
    
       
    
    
    
    
    if([CrashHelper createCrashLog:exceptionInfo fileName:dateTime]){
       
        
        
     
        
        NSLog(@"崩溃日志生成成功");
        //先不传，下次启动再穿
        //[CrashHelper updateAsynToServer];
    }
    
    
    
    NSLog(@"数据执行完毕!!!");
    
}



+ (void) initialize {
    NSSetUncaughtExceptionHandler(&uncaughtExceptionHandler);
}

  + (void) load {
     NSSetUncaughtExceptionHandler(&uncaughtExceptionHandler);    
}

- (void)toCallbackWithCallBackId:(NSString*)callbackId ResultDic:(NSDictionary*)dic andIskeepCallback:(BOOL)iskeepCallback {
    
    PDRPluginResult *result = [[PDRPluginResult alloc] init];
    
    if (PDRCommandStatusOK) {
        // 运行Native代码结果和预期相同，调用回调通知JS层运行成功并返回结果
        result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsDictionary:dic];
        
    } else {
        // 如果Native代码运行结果和预期不同，需要通过回调通知JS层出现错误，并返回错误提示
        result = [PDRPluginResult resultWithStatus:PDRCommandStatusError messageAsString:@"您的请求出错，请检查后再试！"];
        
    }
    result.keepCallback = iskeepCallback;
    //    NSLog(@"[result toJSONString] == %@",[result toJSONString]);
    //         通知JS层Native层运行结果出错
    [self toCallback:callbackId withReslut:[result toJSONString]];
    
}

- (void)toCallbackWithCallBackId:(NSString*) callbackId ResultStr:(NSString*)resultStr andIskeepCallback:(BOOL)iskeepCallback {
    
    NSDictionary *dic = [NSDictionary dictionary];
    
    if (resultStr) {
        dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:resultStr withMessage:nil];
    } else {
        dic = [JZYHDictionary jzyhStringWithStatus:statusError withResult:nil withMessage:@"失败"];
    }
    
    PDRPluginResult *result = [[PDRPluginResult alloc] init];
    
    if (PDRCommandStatusOK) {
        // 运行Native代码结果和预期相同，调用回调通知JS层运行成功并返回结果
        result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsDictionary:dic];
        
    } else {
        // 如果Native代码运行结果和预期不同，需要通过回调通知JS层出现错误，并返回错误提示
        result = [PDRPluginResult resultWithStatus:PDRCommandStatusError messageAsString:@"您的请求出错，请检查后再试！"];
        
    }
    result.keepCallback = iskeepCallback;
    //    NSLog(@"[result toJSONString] == %@",[result toJSONString]);
    //         通知JS层Native层运行结果出错
    [self toCallback:callbackId withReslut:[result toJSONString]];
    
}

- (void)toCallbackWithCallBackId:(NSString*) callbackId ResultStr:(NSString*)resultStr Message:(NSString *)message andIskeepCallback:(BOOL)iskeepCallback {
    
    NSDictionary *dic = [NSDictionary dictionary];
    
    if (resultStr) {
        dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:resultStr withMessage:nil];
    } else {
        dic = [JZYHDictionary jzyhStringWithStatus:statusError withResult:nil withMessage:message];
    }
    
    PDRPluginResult *result = [[PDRPluginResult alloc] init];
    
    if (PDRCommandStatusOK) {
        // 运行Native代码结果和预期相同，调用回调通知JS层运行成功并返回结果
        result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsDictionary:dic];
        
    } else {
        // 如果Native代码运行结果和预期不同，需要通过回调通知JS层出现错误，并返回错误提示
        result = [PDRPluginResult resultWithStatus:PDRCommandStatusError messageAsString:@"您的请求出错，请检查后再试！"];
        
    }
    result.keepCallback = iskeepCallback;
//    NSLog(@"[result toJSONString] == %@",[result toJSONString]);
    //         通知JS层Native层运行结果出错
    [self toCallback:callbackId withReslut:[result toJSONString]];
    
}

@end
