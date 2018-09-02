//
//  CompleteCheck.h
//  HBuilder-Hello
//
//  Created by guoxd on 16/1/6.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AFNetworking.h"
#import "YRJSONAdapter.h"
#import "UIRootViewController.h"
typedef enum
{
    SXLoginSuccess,//成功
    SXLoginFailure,//失败
    SXLoginServerLink//与服务器连接失败
}ReturnResultType;
typedef void (^SXBlock)(ReturnResultType type);

@interface CompleteCheck : NSObject

@property(nonatomic,copy)NSString *string;//www的上一级目录

@property(nonatomic,copy)NSString *string2;//标志位 off表示需要测试完整性，on表示不需要测试完整性

@property(nonatomic,strong)NSMutableArray *xmlInfoArray;//http地址

@property(nonatomic,copy)NSString *identifier;//bundleID

@property(nonatomic,strong)NSString *versonStr;//版本号

@property(nonatomic,strong)NSString *mainVersonStr;//主版本号

@property(nonatomic,strong)NSString *bulderVersonStr;//bundle值

@property (nonatomic,strong) NSArray *minitypeArr;//规定的文件类型

@property(nonatomic,strong)SXBlock SXblock;

@property (nonatomic,assign)NSInteger index;
- (void)getParamValue;
- (void)requestwithUrl:(NSString *)urlString param:(NSDictionary *)params tag:(NSInteger)tag timeOutSeconds:(NSTimeInterval)seconds andBlock:(SXBlock)SXblock;
@end
