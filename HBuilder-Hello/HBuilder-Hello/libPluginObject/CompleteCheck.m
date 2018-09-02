//
//  CompleteCheck.m
//  HBuilder-Hello
//
//  Created by guoxd on 16/1/6.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import "CompleteCheck.h"
#import "CheckComplete.h"
@interface CompleteCheck()
@property(nonatomic,strong)UIRootViewController *rootViewController;
@end
@implementation CompleteCheck
- (instancetype)init
{
    self = [super init];
    if (self) {
        self.xmlInfoArray = [[NSMutableArray alloc]init];
        self.rootViewController = [[UIRootViewController alloc]init];
        self.minitypeArr = [[NSArray alloc]init];
    }
    return self;
}
-(void)getParamValue{
    NSDictionary *dict1 = [messageDic objectForKey:@"integrity"];
    NSString *string1 = [dict1 objectForKey:@"server-path"];
    self.string2 = [dict1 objectForKey:@"in-use"];
    NSString *miniTypeString = [dict1 objectForKey:@"mini-type"];
    self.minitypeArr = [miniTypeString componentsSeparatedByString:@","];
    NSLog(@"minitypeArr == %@",self.minitypeArr);
    [self.xmlInfoArray addObject:string1];//string1表示的是服务器的地址，存储到_xmlInfoArray中
    NSLog(@"string2 = %@",self.string2);
    
    self.versonStr = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
    self.mainVersonStr = [[self.versonStr componentsSeparatedByString:@"."] objectAtIndex:0];
    self.bulderVersonStr = [[NSBundle mainBundle]objectForInfoDictionaryKey:@"CFBundleVersion"];
}

-(NSArray *)ArrayOfIdentifier:(NSString *)identiferStr
{
    NSArray *array = [[NSArray alloc]init];
    array = [identiferStr componentsSeparatedByString:@"."];
    return array;
}
/**
 *  与服务器进行连接
 *
 *  @param urlString 连接地址
 *  @param params    传给服务器的参数
 *  @param tag       request的tag值
 *  @param seconds   延迟的时间
 */
- (void)requestwithUrl:(NSString *)urlString param:(NSDictionary *)params tag:(NSInteger)tag timeOutSeconds:(NSTimeInterval)seconds andBlock:(SXBlock)SXblock{
    self.SXblock = SXblock;
    NSLog(@"urlString = %@",urlString);
    
    AFHTTPSessionManager *sessionManager = [AFHTTPSessionManager manager];
    
    [sessionManager.requestSerializer setTimeoutInterval:seconds];
    __weak typeof(self) selfYX = self;
    [sessionManager POST:urlString parameters:params progress:^(NSProgress * _Nonnull uploadProgress) {
        
        NSLog(@"progress == %@",uploadProgress);
        
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSLog(@"连接成功");
        if (task.taskIdentifier == 1) {
            if (selfYX.SXblock) {
                NSLog(@"PPLoginSuccess");
                selfYX.SXblock(SXLoginSuccess);
            }
            else{
                selfYX.SXblock(SXLoginFailure);
            }
        }
        else
        {
            [self.rootViewController removeViewLaterOfRequest];
            NSLog(@"request111==%@",responseObject);
            NSDictionary *dataDic = [responseObject objectFromJSONString];
            NSLog(@"dic == %@",dataDic);
            if([[dataDic objectForKey:@"status"] boolValue])
            {
                dispatch_async(dispatch_get_main_queue(), ^{
                    [self.rootViewController showHomeVC];
                });
            }
            else
            {
                UIAlertView *alertView=[[UIAlertView alloc]initWithTitle:@"提示" message:@"文件不完整" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
                alertView.tag = 1003;
                [alertView show];
            }
        }
        
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        
        
        if (task.taskIdentifier == 1) {
            NSLog(@"连接失败-----%@,task-----%@",error,task);
            if (self.SXblock) {
                self.SXblock(SXLoginServerLink);
            }
        }
        else if (task.taskIdentifier == 2)
        {
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.rootViewController removeViewLaterOfRequest];
                UIAlertView *alertView=[[UIAlertView alloc]initWithTitle:@"提示" message:@"网络异常" delegate:self cancelButtonTitle:@"知道了" otherButtonTitles:nil, nil];
                alertView.tag = 1003;
                [alertView show];
            });
        }
    }];
}

- (void)alertView:(UIAlertView *)alertView didDismissWithButtonIndex:(NSInteger)buttonIndex
{
    if(1002 == alertView.tag)
    {
        [self.rootViewController showHomeVC];
    }
    else if(1003 == alertView.tag)
    {
        exit(-1);
    }
}

@end
