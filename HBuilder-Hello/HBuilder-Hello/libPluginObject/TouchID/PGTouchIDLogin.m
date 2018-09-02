//
//  PGTouchIDLogin.m
//  HBuilder-Hello
//
//  Created by guoxd on 15/10/27.
//  Copyright © 2015年 DCloud. All rights reserved.
//

#import "PGTouchIDLogin.h"
#import "JZYHDictionary.h"
#import <LocalAuthentication/LocalAuthentication.h>
#import "licenseList.h"

@interface PGTouchIDLogin()

@property(nonatomic,copy)NSString *callID;

@property(nonatomic,strong)LAContext *lacontext;

@end

@implementation PGTouchIDLogin

-(void)TouchIDLogin:(PGMethod *)commonds
{
    if (commonds) {
        self.callID = [commonds.arguments objectAtIndex:0];
       // if ([[self checkJsonOfLicense]isEqualToString:@"插件检验成功"]) {
            
            [self OpenTouchID];
        //}
    }
}

-(void)OpenTouchID
{

    self.lacontext = [[LAContext alloc]init];
    NSError *error = nil;
    self.lacontext.localizedFallbackTitle = @"";
    
    __unsafe_unretained typeof(self) weakSelf = self;
    if([self.lacontext canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error])
    {
        [weakSelf.lacontext evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics localizedReason:@"请验证已有的指纹" reply:^(BOOL success,NSError *error){//指纹不匹配  
            if (success) {
                // 成功
                
                [weakSelf toCallbackWithCallBackId:weakSelf.callID ResultStr:@"1" Message:nil andIskeepCallback:YES];
            }
            else
            {
                
                [weakSelf toCallbackWithCallBackId:weakSelf.callID ResultStr:@"0" Message:nil andIskeepCallback:YES];
                
                switch (error.code) {
                    case LAErrorUserCancel:
                    {// 用户取消
                        
                        break;
                    }
//                    case LAErrorUserFallback:
//                    {// 输入密码
//                        break;
//                    }
                    
                    case LAErrorAuthenticationFailed:{
                        // 指纹校验失败
                        break;
                        
                        
                    }
                    
                    case LAErrorTouchIDLockout:{
                        NSError *error = nil;
                        if([weakSelf.lacontext canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:&error])
                        {
                            [weakSelf.lacontext evaluatePolicy:LAPolicyDeviceOwnerAuthentication localizedReason:@"请验证已有的指纹" reply:^(BOOL success, NSError * _Nullable error) {
                                if (success) {
                                    [self OpenTouchID];
                                } else {
                                    if (error.code == LAErrorUserCancel) {
                                        // 用户取消
                                    } else {
                                        
                                    }
                                    
                                }
                            }];
                        }
                        break;
                        

                    }
                    
                    case LAErrorSystemCancel:{// 应用进入后台时，授权失败 电话/点击后台
                        
                        break;
                        
                    }
                    
                    case LAErrorAppCancel:{// 在验证中被其他app中断
                        
                        break;
                        
                    }
                    
                    default:
                    {//LAErrorInvalidContext LAContext对象被释放掉了
                        
                        break;
                    }
                }
                
            }
        }];
        
        
    }
    else
    {
        [weakSelf toCallbackWithCallBackId:weakSelf.callID ResultStr:@"0" Message:nil andIskeepCallback:YES];
        
        switch (error.code) {
            
            
            case LAErrorTouchIDNotAvailable:
            {
                dispatch_async(dispatch_get_main_queue(), ^{
                    UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"用户设备不支持TouchID" message:nil delegate:nil cancelButtonTitle:@"取消" otherButtonTitles:nil];
                    [alert show];
                    
                    
                });
                break;
            }
            
            case LAErrorTouchIDNotEnrolled:
            {// 没有打开指纹使用
                dispatch_async(dispatch_get_main_queue(), ^{
                    UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"用户未设置TouchID" message:nil delegate:nil cancelButtonTitle:@"取消" otherButtonTitles:nil];
                    [alert show];
                    
                    
                });
                break;
            }
            case LAErrorPasscodeNotSet:
            {
                dispatch_async(dispatch_get_main_queue(), ^{
                    UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"用户未设置TouchID" message:nil delegate:nil cancelButtonTitle:@"取消" otherButtonTitles:nil];
                    [alert show];
                    
                    
                });
                break;
            }
            
            case LAErrorTouchIDLockout:{
                
                NSError *error = nil;
                if([weakSelf.lacontext canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:&error])
                {
                    [weakSelf.lacontext evaluatePolicy:LAPolicyDeviceOwnerAuthentication localizedReason:@"请验证已有的指纹" reply:^(BOOL success, NSError * _Nullable error) {
                        if (success) {
                            [self OpenTouchID];
                        } else {
                            if (error.code == LAErrorUserCancel) {
                                // 用户取消
                            } else {
                                
                            }
                            
                        }
                    }];
                }
                break;
                
                
            }
            
            default:
            {//LAErrorInvalidContext LAContext对象被释放掉了
                
                break;
            }
        }
        
        
        
        
    }
    
}

-(NSString *)checkJsonOfLicense
{
    NSString *string = [[NSString alloc] init];
    
    NSString *fileName = @"yuxintouchidlicense";
    
    if ([[licenseList checkJsonStringOfProjectLicense:fileName] isEqualToString:@"检验成功"]) {
        
        NSDictionary *dictionary = [licenseList DecryptionStringOfLicenseFile:fileName];
        
        if ([dictionary[@"pluginid"] isEqualToString:@"plugintouchid"]) {
            
            if ([[dictionary objectForKey:@"model"]isEqualToString:@"test"]) {
                UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"提醒" message:@"此license为测试版本" preferredStyle:UIAlertControllerStyleAlert];
                
                // __weak typeof(alert) weakAlert = alert;
                [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
                    
                }]];
                [alert addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction *action) {
                    
                }]];
                
                [self presentViewController:alert animated:YES completion:nil];
                
            }
            
            string = @"插件检验成功";
            
        } else {
            string = @"插件检验失败";
        }
    }
    
    return string;
}


@end
