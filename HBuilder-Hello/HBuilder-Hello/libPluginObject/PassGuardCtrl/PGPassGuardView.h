//
//  PGPassGuardView.h
//  HBuilder-Hello
//
//  Created by guoxd on 16/6/6.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import "PGPlugin.h"
#import "PGMethod.h"
#import "PassGuardViewController.h"
@interface PGPassGuardView : PGPlugin<instertWebviewTextDelegate,UIWebViewDelegate,BarDelegate,DoneDelegate>

////MD5
//-(void)openMD5Keyboard:(PGMethod *)commends;
////AES
//-(void)openAESKeyboard:(PGMethod *)commends;
//RSAAES
-(void)openRSAAESKeyboard:(PGMethod *)commends;

//注册隐藏键盘的回调
//-(void)registerHideKeyBoardCallBack:(PGMethod *)commends;

//隐藏键盘
-(NSData *)hideKeyboard:(PGMethod *)commends;
//检测当前输入框内容是否符合m_strInput2所设置的正则规则
-(NSData *)checkMatch:(PGMethod *)commends;
//清除输入框（空方法）
-(NSData *)clearKeyboard:(PGMethod *)commends;
//返回键盘高度
//-(NSData *)getKeyboardHeight:(PGMethod *)commends;
@end
