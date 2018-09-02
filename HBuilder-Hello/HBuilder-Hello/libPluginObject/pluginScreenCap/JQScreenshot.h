//
//  FingerprintPlugin.h
//  hubeicfc
//
//  Created by 陈君祁 on 2018/07/02.
//  Copyright © 2017年 DCloud. All rights reserved.
//

#import "PGPlugin.h"
#import "PGMethod.h"

@interface  JQScreenshot: PGPlugin

//根据业务需求进行修改提示内容
#define alertTile @"安全提醒";
#define alertContent @"为保障资金安全,请不要截图并分享给他人。";

/**
 打开截屏通知，修改与安卓统一方法名称
 */
//-(void) openScreenshot:(PGMethod *)commonds;
-(void) forBidScreenCap:(PGMethod *)commonds;

/**
 关闭截屏通知,保持与安卓统一，暂时不集成
 */
//-(void) closeScreenshot:(PGMethod *)commonds;

@end
