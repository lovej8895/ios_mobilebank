//
//  UIRootViewController.m
//  HBuilder-Hello
//
//  Created by Lu_jh on 15/8/24.
//  Copyright (c) 2015年 DCloud. All rights reserved.
//

#import "UIRootViewController.h"
#import "AFNetworkReachabilityManager.h"
#import "ViewController.h"
#import "NSString+YX.h"
#import "YRJSONAdapter.h"
#import "CompleteCheck.h"
#import "licenseList.h"
@interface UIRootViewController ()
@property (nonatomic, strong) AFNetworkReachabilityManager *internetReach;
@property (nonatomic, assign) AFNetworkReachabilityStatus networkStatus;
@property (nonatomic,strong) CompleteCheck *checkComplete;
@property (nonatomic,strong) NSMutableArray *fileNameList;//file文件名
@property (nonatomic,strong) NSMutableArray *filePathList;//file路径
@property (nonatomic,strong) NSMutableArray *mutableArray;//带相对路径的文件全名
@property (nonatomic,strong) licenseList *license;
@property (nonatomic,strong) NSString *name;
@property (nonatomic,strong) NSArray *nameArray;
@end

@implementation UIRootViewController

- (instancetype)init
{
    self = [super init];
    if (self) {
        
    }
    return self;
}
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
- (void)viewDidLoad
{
    // Do any additional setup after loading the view.
    UIImageView *backImageView=[[UIImageView alloc]initWithFrame:self.view.bounds];
    
    CGFloat greaterPixelDimension = (CGFloat) fmaxf(((float)[[UIScreen mainScreen]bounds].size.height),
                                                    ((float)[[UIScreen mainScreen]bounds].size.width));
    switch ((NSInteger)greaterPixelDimension) {
        case 480:
        backImageView.image=[UIImage imageNamed:@"Default"];
        break;
        case 568:
        backImageView.image=[UIImage imageNamed:@"Default-568h@2x"];
        break;
        case 667:
        backImageView.image=[UIImage imageNamed:@"Default-667h@2x"];
        break;
        case 736:
        backImageView.image=[UIImage imageNamed:@"Default-736h@3x"];
        break;
        default:
        backImageView.image=[UIImage imageNamed:@"Default-736h@3x"];
        break;
    }
    
    [self.view addSubview:backImageView];

    self.fileNameList = [[NSMutableArray alloc] initWithCapacity:1];
    self.filePathList = [[NSMutableArray alloc] initWithCapacity:1];
    //[self startDownload:nil withLocalPath:nil];
    //监测网路
    self.internetReach = [AFNetworkReachabilityManager sharedManager];
    
    [self.internetReach startMonitoring];
    
    [self.internetReach setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
        self.networkStatus = status;
        NSLog(@"status == %ld",self.networkStatus);
        switch (status) {
            case AFNetworkReachabilityStatusReachableViaWWAN:
            {
                NSLog(@"其他网络");
                [self xmlParser];
                NSLog(@"fileList == %@",self.fileNameList);
            }
                break;
            case AFNetworkReachabilityStatusReachableViaWiFi:
            {
                NSLog(@"WiFi网络");
                [self xmlParser];
                NSLog(@"fileList == %@",self.fileNameList);
            }
                break;
            default:
            {
                NSLog(@"无网络");
                [self xmlParser];
            }
                break;
        }
    }];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

}
- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
//    [[NSNotificationCenter defaultCenter] removeObserver:self name:yx_kReachabilityChangedNotification object:nil];
}
-(void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

}
- (void)xmlParser
{
    if (self.networkStatus != AFNetworkReachabilityStatusNotReachable) {
        self.checkComplete = [[CompleteCheck alloc]init];
        [self.checkComplete getParamValue];
        //license文件检测
        self.license = [[licenseList alloc]init];
        NSString *returnResult = [licenseList checkJsonStringOfProjectLicense:@"yuxinlicense"];
    
        NSLog(@"returnResult == %@",returnResult);
        
        if ([returnResult isEqualToString:@"检验成功"]) {

            if ([self.checkComplete.string2 isEqualToString:@"on"]) {
                static BOOL bHavSend = NO; //只发送一次
                if(!bHavSend)
                {
                    bHavSend = YES;
                    [self findAllFiles];
                }
            }
            else
            {
                [self showHomeVC];
            }
            
        }
        else{
            
            UIAlertView *alertView=[[UIAlertView alloc]initWithTitle:@"验签没有通过" message:@"验签没有通过" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
            alertView.tag = 1004;
            [alertView show];
        }
    }
    else
    {
        UIAlertView *alertView=[[UIAlertView alloc]initWithTitle:@"提示" message:@"无网络" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
        alertView.tag = 1003;
        [alertView show];
    }
}
//遍历所有文件
- (void)findAllFiles
{
    NSFileManager *fileManager = [NSFileManager defaultManager];
    //在这里获取应用程序Documents文件夹里的文件及文件夹列表
    NSError *error = nil;
    NSString *filesPath = [[[NSBundle mainBundle] bundlePath] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@%@",@"Pandora/apps/",self.checkComplete.string]];//所有folder文件夹都被当做资源放在bundlePath目录下，所以[NSBundle mainBundle] bundlePath] 是根目录
    //fileList便是包含有该文件夹下所有文件的文件名及文件夹名的数组
    NSArray *contentOfFolder = [fileManager contentsOfDirectoryAtPath:filesPath error:&error];
//    NSLog(@"contentOfFolder == %@",contentOfFolder);
    [self readContentArray:contentOfFolder currentPath:filesPath];
    //保存后发送
    [self checkTamperresist]; 
}
//保存所有文件名
- (void)readContentArray:(NSArray *)contentOfFolder currentPath:(NSString *)stPath
{
    for (NSString *aPath in contentOfFolder) {
        //NSLog(@"apath: %@", aPath);
        NSString * fullPath = [stPath stringByAppendingPathComponent:aPath];
        BOOL isDir;
        [[NSFileManager defaultManager] fileExistsAtPath:fullPath isDirectory:&isDir];
        if(isDir)
        {
            //如果是文件夹递归
            NSError *error = nil;
            NSArray *contentOfFolder = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:fullPath error:&error];
            [self readContentArray:contentOfFolder currentPath:fullPath];
        }
        else
        {
            for(NSString *type in self.checkComplete.minitypeArr){
                NSString *exestr = [aPath pathExtension];
                if ([type isEqualToString:exestr]) {
                    NSRange range = [fullPath rangeOfString:@"www"];
                    NSString *relativePath = [fullPath substringFromIndex:range.location];
                    //只是文件名
                    [self.fileNameList addObject:aPath];
                    //_filePathList带根路径的文件的全名
                    [self.filePathList addObject:relativePath];
                }
            }
        }
    }
    //    NSLog(@"_fileNameList == %@",_fileNameList);
}

//监测文件完整性
- (void)checkTamperresist
{
//    NSLog(@"##### %d",self.networkStatus);
    if(self.fileNameList.count <=0 || self.filePathList.count <=0 || self.fileNameList.count !=self.filePathList.count)
    {//如果没有文件
        NSLog(@"fileNameList.count = %ld",self.fileNameList.count);
        NSLog(@"_filePathList = %ld",self.filePathList.count);
        
        UIAlertView *alertView=[[UIAlertView alloc]initWithTitle:@"提示" message:@"文件不完整" delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
        alertView.tag = 1004;
        [alertView show];
    }
    else
    {
        //添加loading标志 tag == 10000
        UIActivityIndicatorView *activityIndicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
        activityIndicatorView.tag=10000;
        activityIndicatorView.backgroundColor=[UIColor clearColor];
        activityIndicatorView.activityIndicatorViewStyle=2;
        activityIndicatorView.frame = CGRectMake(0,0, self.view.frame.size.width,self.view.frame.size.height);
        [self.view addSubview:activityIndicatorView];
        [activityIndicatorView startAnimating];
        
        //组包
        NSMutableArray *listArr = [NSMutableArray arrayWithCapacity:1];
        
        for(int i=0;i<self.fileNameList.count;i++)
        {
            NSString *fileName = [self.fileNameList objectAtIndex:i];
            NSString *filePath = [self.filePathList objectAtIndex:i];
            NSString *resFullname = [filePath substringFromIndex:4];
//            NSLog(@"filePath == %@",filePath);
            NSString *path = [[[[NSBundle mainBundle] bundlePath] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@%@",@"Pandora/apps/",self.checkComplete.string]]stringByAppendingString:[NSString stringWithFormat:@"/%@",filePath]];
//            NSLog(@"path == %@",path);
            NSString *fielMd5 = [NSString fileMD5:path];
            NSMutableDictionary *itemDic = [NSMutableDictionary dictionaryWithObjectsAndKeys:fileName,@"resName",resFullname,@"resFullname",fielMd5,@"resHash", nil];
            [listArr addObject:itemDic];
        }
        NSMutableDictionary *paramsDic = [NSMutableDictionary dictionaryWithObjectsAndKeys:self.checkComplete.identifier,@"appId",self.checkComplete.mainVersonStr,@"appMajor",self.checkComplete.bulderVersonStr,@"appVersionCode",self.checkComplete.versonStr,@"appVersion",listArr,@"list",nil];
        NSLog(@"[self.checkComplete.xmlInfoArray objectAtIndex:0] == %@",[self.checkComplete.xmlInfoArray objectAtIndex:0]);
        [self.checkComplete requestwithUrl:[self.checkComplete.xmlInfoArray objectAtIndex:0] param:paramsDic tag:102 timeOutSeconds:15 andBlock:nil];
        NSLog(@"##########%@",paramsDic);
    }
}

#pragma mark -跳转页面
-(void)showHomeVC
{
    ViewController *viewCtrol = [[ViewController alloc] init];
    if (![[UIApplication sharedApplication].delegate.window.rootViewController isKindOfClass:[ViewController class]]) {
        [UIApplication sharedApplication].delegate.window.rootViewController = viewCtrol;
    }
}

#pragma mark -removeView
-(void)removeViewLaterOfRequest{
    UIView *view=[self.view viewWithTag:10000];
    if (view!=nil) {
        [view removeFromSuperview];
    }
}

#pragma mark -UIAlertView
- (void)alertView:(UIAlertView *)alertView didDismissWithButtonIndex:(NSInteger)buttonIndex
{
    if(1002 == alertView.tag)
    {
        [self showHomeVC];
    }
    else if(1003 == alertView.tag)
    {
        [self showHomeVC];
    }
    else if (1004 == alertView.tag){
        exit(-1);
    }
}

@end
