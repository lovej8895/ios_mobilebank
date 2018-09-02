//
//  UIRootViewController.h
//  HBuilder-Hello
//
//  Created by Lu_jh on 15/8/24.
//  Copyright (c) 2015年 DCloud. All rights reserved.
//

#import <UIKit/UIKit.h>
@class CompleteCheck;
@interface UIRootViewController : UIViewController
//加密的key
@property (nonatomic, strong) NSString *keyToken;
-(void)removeViewLaterOfRequest;
-(void)showHomeVC;
@end
