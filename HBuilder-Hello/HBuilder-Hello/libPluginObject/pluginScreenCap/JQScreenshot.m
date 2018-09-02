//
//
//  Created by 陈君祁 on 2017/12/15.
//  Copyright © 2017年 DCloud. All rights reserved.
//

#import "JQScreenshot.h"

@interface JQScreenshot ()
@property (copy, nonatomic) NSString *callBackId;
@end

@implementation JQScreenshot
//  与安卓同步
//-(void)openScreenshot:(PGMethod*)command{
//    if(command && command.arguments.count>0){
//        self.callBackId = [command.arguments objectAtIndex:0];
//
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(alertMe:) name:UIApplicationUserDidTakeScreenshotNotification object:nil];
//        PDRPluginResult *result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsString:@"open"];
//        [self toCallback:self.callBackId withReslut:[result toJSONString]];
//
//    }
//
//
//}


//iOS实现此方法只做提示
-(void)forBidScreenCap:(PGMethod*)command{
    if(command && command.arguments.count>0){
        self.callBackId = [command.arguments objectAtIndex:0];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(alertMe:) name:UIApplicationUserDidTakeScreenshotNotification object:nil];
        PDRPluginResult *result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsString:@"open"];
        [self toCallback:self.callBackId withReslut:[result toJSONString]];
        
    }
    
    
}

-(void)alertMe:(NSNotification *)notification {
    NSString *title = alertTile;
    NSString *content = alertContent;
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title message:content delegate:self cancelButtonTitle:@"确定" otherButtonTitles: nil];
    
    [alert show];
}

//-(void)closeScreenshot:(PGMethod*)command{
//    if(command && command.arguments.count>0){
//        self.callBackId = [command.arguments objectAtIndex:0];
//
//        [[NSNotificationCenter defaultCenter] removeObserver:self];
//        PDRPluginResult *result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsString:@"close"];
//        [self toCallback:self.callBackId withReslut:[result toJSONString]];
//
//    }
//}
@end
