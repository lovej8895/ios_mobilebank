//
//  PGWriteLog.m
//  HBuilder-Hello
//
//  Created by LiYuan on 16/2/17.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import "PGWriteLog.h"
#import "CrashHelper.h"
@interface PGWriteLog(){

}
@property (nonatomic,strong) NSString *callBackId;
@end
@implementation PGWriteLog

- (void)writelog:(PGMethod*)commands {
    
    if(commands && commands.arguments.count >= 1){
       
        
                
               
        
       // NSSetUncaughtExceptionHandler(&uncaughtExceptionHandler);

        [[NSArray array] objectAtIndex:1];
        
        //CallBackId 异步方法回调id,h5+会根据回调ID通知js层运行结果或者失败
        NSString *commestsId = [commands.arguments objectAtIndex:0];
        
        [self toCallbackWithCallBackId:commestsId ResultStr:@"1" andIskeepCallback:NO];
        
    }
    
}
-(void)updateWriteLog:(PGMethod*)commands {
   
    if(commands && commands.arguments.count >= 1){
        //CallBackId 异步方法回调id,h5+会根据回调ID通知js层运行结果或者失败
        self.callBackId = [commands.arguments objectAtIndex:0];
        __weak typeof(self) weakSelf = self;
        //开始上传崩溃日志
        [CrashHelper updateAsynToServerComplete:^{
        
           [weakSelf toCallbackWithCallBackId:self.callBackId ResultStr:@"1" andIskeepCallback:NO];
        
        } fail:^(NSError *error){
            [weakSelf toCallbackWithCallBackId:self.callBackId ResultStr:nil andIskeepCallback:NO];
        }];
        
        
        
    }


}

- (void)getLog:(PGMethod*)commands{
    if(commands && commands.arguments.count >= 1){
        //CallBackId 异步方法回调id,h5+会根据回调ID通知js层运行结果或者失败
        NSString *commestsId = [commands.arguments objectAtIndex:0];
        NSString *path = [CrashHelper getCrashLog];
      
        if (path&&path.length>0) {
//            NSData *data = [path dataUsingEncoding:NSUTF8StringEncoding];
//            NSString *pathBase = [data base64Encoding];
//            [self toCallbackWithCallBackId:commestsId ResultStr:path Message:nil andIskeepCallback:NO];
//            NSString *stringcontent = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
            NSString *stringcontent =path;

            [self toCallbackWithCallBackId:commestsId ResultStr:stringcontent Message:nil andIskeepCallback:NO];
            
        }else{
           [self toCallbackWithCallBackId:commestsId ResultStr:@"0" Message:nil andIskeepCallback:NO];
        }
        
    }
}

- (void)deleteLog:(PGMethod*)commands{
    
    if(commands && commands.arguments.count >= 1){
        //CallBackId 异步方法回调id,h5+会根据回调ID通知js层运行结果或者失败
        NSString *commestsId = [commands.arguments objectAtIndex:0];
        [CrashHelper deleteCrashLog];
        BOOL number = [CrashHelper carshLogNumber];
        if (number) {
            [self toCallbackWithCallBackId:commestsId ResultStr:@"1" Message:@"1" andIskeepCallback:NO];
        }else{
            [self toCallbackWithCallBackId:commestsId ResultStr:@"0" Message:nil andIskeepCallback:NO];
        }
        
    }
}






@end
