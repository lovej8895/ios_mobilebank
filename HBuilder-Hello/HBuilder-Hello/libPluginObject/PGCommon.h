//
//  PGCommon.h
//  HBuilder-Hello
//
//  Created by LiYuan on 16/1/7.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import "PGPlugin.h"
#import "PGMethod.h"

@interface PGCommon : PGPlugin

- (void)toCallbackWithCallBackId:(NSString*)callbackId ResultDic:(NSDictionary*)dic andIskeepCallback:(BOOL)iskeepCallback;

/**
 *  异步回调方法
 *
 *  @param callbackId     callbackId
 *  @param resultStr      处理后需要回调的字符串
 *  @param iskeepCallback 是否持续回调
 */
- (void)toCallbackWithCallBackId:(NSString*) callbackId ResultStr:(NSString*)resultStr andIskeepCallback:(BOOL)iskeepCallback;

/**
 *  异步回调方法
 *
 *  @param callbackId     callbackId
 *  @param resultStr      处理后需要回调的字符串
 *  @param iskeepCallback 是否持续回调
 */
- (void)toCallbackWithCallBackId:(NSString*) callbackId ResultStr:(NSString*)resultStr Message:(NSString *)message andIskeepCallback:(BOOL)iskeepCallback;

@end
