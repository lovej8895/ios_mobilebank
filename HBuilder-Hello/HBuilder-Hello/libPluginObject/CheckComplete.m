//
//  CheckComplete.m
//  HBuilder-Hello
//
//  Created by guoxd on 16/1/7.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import "CheckComplete.h"

@interface CheckComplete()
@property (nonatomic,assign) NSInteger index;

@end
@implementation CheckComplete

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.filePathList = [[NSMutableArray alloc]init];
        self.fileNameList = [[NSMutableArray alloc]init];
        self.mutableArray = [[NSMutableArray alloc]init];
        self.index = 0;
        self.checkComplete = [[CompleteCheck alloc]init];
    }
    return self;
}
-(void)fileIntegrityCheck:(NSString *)string {
    
    [self.checkComplete getParamValue];
    [self loadData:string];
}
-(void)loadData:(NSString *)string{
    NSArray *array = [string componentsSeparatedByString:@","];
    NSLog(@"array == %@",array);
    for(NSString *path in array){
        NSString *loadpath = [[[NSBundle mainBundle] bundlePath] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@/%@/www", @"Pandora/apps",self.checkComplete.string]];
        NSLog(@"loadpath---%@",loadpath);
        NSString *filepath = [loadpath stringByAppendingString:[NSString stringWithFormat:@"/%@",path]];
        NSLog(@"filepath ---- %@",filepath);
        //判断文件是否存在
        NSFileManager *manager = [NSFileManager defaultManager];
        if ([manager fileExistsAtPath:filepath]) {
            [self.mutableArray addObject:filepath];
            [self.filePathList addObject:[NSString stringWithFormat:@"www/%@",path]];
            if([manager contentsAtPath:filepath]){
                NSString *pathString = [filepath lastPathComponent];
                NSLog(@"pathString == %@",pathString);
                [self.fileNameList addObject:pathString];
            }
        }
        else{
            NSLog(@"文件不存在---%@",path);
            self.index = self.index+1;
        }
    }
    if (self.index == array.count) {
        UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"文件都不存在" message:@"需要检测的文件都不存在" delegate:self cancelButtonTitle:nil otherButtonTitles:@"确定", nil];
        [alert show];
        return;
    }
    NSMutableArray *listArr = [[NSMutableArray alloc]init];
    for(int i=0;i<[self.fileNameList count];i++){
        NSString *MD5String = [NSString fileMD5:[self.mutableArray objectAtIndex:i]];
        NSString *fileName = [self.fileNameList objectAtIndex:i];
        NSString *filePath = [self.filePathList objectAtIndex:i];
        NSString *resFullname = [filePath substringFromIndex:4];
        NSMutableDictionary *listDic = [NSMutableDictionary dictionary];
        listDic[@"resName"] = fileName;
        listDic[@"resFullname"] = resFullname;
        listDic[@"resHash"] = MD5String;
        [listArr addObject:listDic];
    }
    NSMutableDictionary *paramsDic = [NSMutableDictionary dictionaryWithObjectsAndKeys:self.checkComplete.identifier,@"appId",self.checkComplete.mainVersonStr,@"appMajor",self.checkComplete.bulderVersonStr,@"appVersionCode",self.checkComplete.versonStr,@"appVersion",listArr,@"list",nil];
    
    //与服务器进行连接
    
    static BOOL bHavSend = NO; //只发送一次
    if(!bHavSend)
    {
        bHavSend = YES;
        __weak typeof(self) selfSX = self;
        [self.checkComplete requestwithUrl:[self.checkComplete.xmlInfoArray objectAtIndex:0] param:paramsDic tag:101 timeOutSeconds:10 andBlock:^(ReturnResultType type) {
            [selfSX returnResult:type];
        }];
    }
 
   
}
-(void)returnResult:(ReturnResultType)type{
    NSLog(@"type == %d",type);
    switch (type) {
        case SXLoginSuccess:
            self.ResultString = @"2";
            break;
        case SXLoginFailure:
            self.ResultString = @"1";
            break;
        case SXLoginServerLink:
            self.ResultString = @"0";
            break;
        default:
            break;
    }
    NSLog(@"self.ResultString == %@",self.ResultString);
    [[NSNotificationCenter defaultCenter]postNotificationName:@"showResult" object:nil];
}

@end
