//
//  JQEncryprt.m
//  HBuilder
//
//  Created by chenjunqi on 2018/5/3.
//  Copyright © 2018年 DCloud. All rights reserved.
//

#import "JQEncryprt.h"
#import "RYTWebTls.h"

@interface JQEncryprt ()

@property (nonatomic,strong) NSString *callBackId;

@end

@implementation JQEncryprt

-(void)getEncryprtString:(PGMethod *)commonds {

    if(commonds && commonds.arguments.count>0){
        self.callBackId = [commonds.arguments objectAtIndex:0];
        NSString *serverUrl = [commonds.arguments objectAtIndex:1];
        NSString *serverInterface = [commonds.arguments objectAtIndex:2];
        NSString *encryptData = [commonds.arguments objectAtIndex:3];
        
        RYTWebTls *webTools = [[RYTWebTls alloc] init];
        
        NSData *dataJson =  [webTools webEncryprt:serverUrl serverInterface:serverInterface encryptData:encryptData];
        
        NSError *error = nil;
        
        NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:dataJson options:kNilOptions error:&error];
        PDRPluginResult *result = nil;
        if (error) {
            result = [PDRPluginResult resultWithStatus:PDRCommandStatusError messageAsString:[NSString stringWithFormat:@"%d",(int)error.code]];
        }else{
            if (dict[@"token"]) {
                NSDictionary *resultDic = @{@"token":dict[@"token"]};
                
                // 运行Native代码结果和预期相同，调用回调通知JS层运行成功并返回结果
                result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsDictionary:resultDic];
                
                // 通知JS层Native层运行正确结果
                
            }else{
                //没有返回token则执行失败回调
                result = [PDRPluginResult resultWithStatus:PDRCommandStatusError messageAsDictionary:dict];
            }
            
        }
        [self toCallback:self.callBackId withReslut:[result toJSONString]];
    }else{
        PDRPluginResult *errResult = [PDRPluginResult resultWithStatus:PDRCommandStatusError messageAsString:@"获取授权状态失败"];
        // 通知JS层Native层运行结果出错
        [self toCallback:self.callBackId withReslut:[errResult toJSONString]];
        
    }
}

@end
