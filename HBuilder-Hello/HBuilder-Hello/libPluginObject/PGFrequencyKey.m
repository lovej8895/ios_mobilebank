//
//  PGFrequencyKey.m
//  HBuilder-Hello
//
//  Created by LiYuan on 2017/3/22.
//  Copyright © 2017年 DCloud. All rights reserved.
//

#import "PGFrequencyKey.h"
#import "FTKeyInterface.h"
#import "JZYHDictionary.h"
#import "MBProgressHUD+NJ.h"
#import "JTAlertView.h"

typedef enum  {
    FrequencyKeyConnectFail,
    FrequencyKeyConnectSuc,
    FrequencyKeyConnectOperationFailed,
} FrequencyKeyConnect;

//typedef enum  {
//    FrequencyKeyReverse,
//    FrequencyKeyGetsn,
//    FrequencyKeyEnumCert,
//    FrequencyKeyGetCert,
//    FrequencyKeyChangePin,
//    FrequencyKeyCertSign,
//    FrequencyKeyDestroy,
//} FrequencyKey;

@interface PGFrequencyKey() <FTKeyEventsDelegate, FTFunctionDelegate>
    {
        FT_Cert_Info myCertInfo[20];
    }

    @property (nonatomic,copy) NSString *cbId;
    
    @property (nonatomic,assign) BOOL isInit;
    @property (nonatomic, strong) MBProgressHUD *hud;
    @property(nonatomic, strong) UIAlertView *alertView;
    @property(nonatomic, strong) UIAlertView *alertViewSuc;
//    @property (nonatomic,assign) FrequencyKey index;

@end

@implementation PGFrequencyKey

-(UIAlertView *)alertView:(NSString *)str
{
    if(!_alertView){
        _alertView = [[JTAlertView alloc]initWithTitle:nil message:str delegate:self cancelButtonTitle:nil otherButtonTitles:@"翻转屏幕", nil];
        _alertView.tag = 1;
    }
    return _alertView;
}

-(UIAlertView *)alertViewSuc:(NSString *)str
{
    if(!_alertViewSuc){
        _alertViewSuc = [[JTAlertView alloc]initWithTitle:nil message:str delegate:self cancelButtonTitle:@"OK" otherButtonTitles: nil];
        _alertViewSuc.tag = 0;
    }
    return _alertViewSuc;
}

+ (void)load {
    PGFrequencyKey *KeySelf = [[PGFrequencyKey alloc] init];
    [FTKeyInterface FTSetTransmitType:0];
    [FTKeyInterface FTSetKeyEventsDelegate:KeySelf];
}
    
-(void)reverseFrequencyKey:(PGMethod *)commonds {
    
    if (!self.isInit) {
        [FTKeyInterface FTSetTransmitType:0];
        [FTKeyInterface FTSetKeyEventsDelegate:self];
        self.isInit = YES;
        
    }
    
    
        self.cbId = [commonds.arguments objectAtIndex:0];
        
        NSInteger ret = [FTKeyInterface FTTurnOverKeyScreenState];
        
        if(ret != FT_SUCCESS) {
            
            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:[NSString stringWithFormat:@"%ld", ret] withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectFail]];
            
            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
            
            if(ret == FT_DEVICE_BUSY) {
                return;
            }
            
        }else {
            
            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:nil withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectSuc]];
            
            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
            
        }

}
  
-(void)getsnFrequencyKey:(PGMethod *)commonds {
    
    if (!self.isInit) {
        [FTKeyInterface FTSetTransmitType:0];
        [FTKeyInterface FTSetKeyEventsDelegate:self];
        self.isInit = YES;
    }
    
    self.cbId = [commonds.arguments objectAtIndex:0];
    
    NSString *mySN = nil;
    NSInteger ret = [FTKeyInterface FTReadSN:&mySN];
    
    if(ret != FT_SUCCESS) {
        
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:[NSString stringWithFormat:@"%ld", ret] withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectFail]];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        
        if(ret == FT_DEVICE_BUSY) {
            return;
        }
        
    }else {
        
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:mySN withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectSuc]];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        
    }
    
}
    
-(void)enumCertFrequencyKey:(PGMethod *)commonds {
    
    if (!self.isInit) {
        [FTKeyInterface FTSetTransmitType:0];
        [FTKeyInterface FTSetKeyEventsDelegate:self];
        self.isInit = YES;
    }
    
    self.cbId = [commonds.arguments objectAtIndex:0];
    
    memset(myCertInfo, 0, sizeof(myCertInfo));
    NSInteger myCertInfoCount = 20;

    NSInteger ret = [FTKeyInterface FTGetCertList:myCertInfo CertInfoCount:&myCertInfoCount];

    if(ret != FT_SUCCESS) {

        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:[NSString stringWithFormat:@"%ld", ret] withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectFail]];

        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];

        if(ret == FT_DEVICE_BUSY) {
            return;
        }

    } else {

        NSMutableDictionary *fTUserCertInfoMsgs = [NSMutableDictionary dictionary];

        for (int i = 0; i < myCertInfoCount; ++i) {

            NSString *snStr = [self stringFromHexData:myCertInfo[i].bSN length:myCertInfo[i].dwSNLen];

            NSDictionary *dic = [NSDictionary dictionaryWithObjectsAndKeys:snStr, @"SN", [NSString stringWithFormat:@"%s", myCertInfo[i].bIssuerDN], @"IssuerDN", [NSString stringWithFormat:@"%s", myCertInfo[i].bTime], @"Time", [NSString stringWithFormat:@"%s", myCertInfo[i].bSubjectDN], @"SubjectDN", nil];

            [fTUserCertInfoMsgs setValue:dic forKey:[NSString stringWithFormat:@"fTUserCertInfoMsg%d", i]];
        }

        
        NSDictionary *dic = [JZYHDictionary jzyhDictionaryWithStatus:statusOK withResult:fTUserCertInfoMsgs withMessage:[NSString stringWithFormat:@"%ld", myCertInfoCount]];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        
    }
    
    
    
}
    
-(void)getCertFrequencyKey:(PGMethod *)commonds {
    
    if (!self.isInit) {
        [FTKeyInterface FTSetTransmitType:0];
        [FTKeyInterface FTSetKeyEventsDelegate:self];
        self.isInit = YES;
    }
    
    self.cbId = [commonds.arguments objectAtIndex:0];
    int certIndex = [[commonds.arguments objectAtIndex:1] intValue];
    
    NSString *cert = nil;
    
    NSInteger ret = [FTKeyInterface FTReadCertValueByCertInfo:myCertInfo[certIndex] CertValue:&cert];
    
    if(ret != FT_SUCCESS) {
        
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:[NSString stringWithFormat:@"%ld", ret] withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectFail]];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        
        if(ret == FT_DEVICE_BUSY) {
            return;
        }
        
    } else {
        
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:cert withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectSuc]];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        
    }
}
    
-(void)changePinFrequencyKey:(PGMethod *)commonds {
   _hud = [MBProgressHUD showMessage:@"正在修改密码..."];
    if (!self.isInit) {
        [FTKeyInterface FTSetTransmitType:0];
        [FTKeyInterface FTSetKeyEventsDelegate:self];
        self.isInit = YES;
    }
    
    self.cbId = [commonds.arguments objectAtIndex:0];
    NSString *PinOldText = [commonds.arguments objectAtIndex:1];
    NSString *PinNewText = [commonds.arguments objectAtIndex:2];
    
    unsigned int pinTimes = 0;
    
    NSInteger ret = [FTKeyInterface FTChangePIN:PinOldText newPIN:PinNewText PinRemainTimes:&pinTimes delegate:self];
    
    if(ret != FT_SUCCESS) {
        [MBProgressHUD hideHUD];
        if(ret == FT_PASSWORD_INVALID) {
            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:[NSString stringWithFormat:@"密码错误，剩余次数为%d次。", pinTimes] withMessage:@"0"];
            
            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        }
        
        if(ret == FT_NO_DEVICE) {
            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:@"设备未连接" withMessage:@"0"];
            
            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
            return;
        }
        
        if(ret == FT_USER_CANCEL) {
            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:@"用户取消操作" withMessage:@"0"];
            
            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
            return;
        }
        
        NSString *stringMg = [self retToString:ret];
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:stringMg withMessage:@"0"];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        
        if(ret == FT_DEVICE_BUSY) {
            return;
        }
        
    } else {
        
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:@"成功" withMessage:@"1"];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        
    }
    
}
    
-(void)certSignFrequencyKey:(PGMethod *)commonds {
    
    if (!self.isInit) {
        [FTKeyInterface FTSetTransmitType:0];
        [FTKeyInterface FTSetKeyEventsDelegate:self];
        self.isInit = YES;
    }
    
    self.cbId = [commonds.arguments objectAtIndex:0];
    int certNo = [[commonds.arguments objectAtIndex:1] intValue];
    NSString *strPin = [commonds.arguments objectAtIndex:2];
    NSInteger signAlgMsg = [[commonds.arguments objectAtIndex:3] integerValue];
    NSString *signData = [commonds.arguments objectAtIndex:4];
    NSString *strLoad = [commonds.arguments objectAtIndex:5];
    NSString *strSuccess = [commonds.arguments objectAtIndex:6];
    BOOL p7 = [[commonds.arguments objectAtIndex:7] boolValue];
    
    
    _hud = [MBProgressHUD showMessage:strLoad];
    [self alertView:strSuccess];
    
    NSString *strSuc = @"签名成功！";
    [self alertViewSuc:strSuc];
    
    memset(myCertInfo, 0, sizeof(myCertInfo));
    NSInteger myCertInfoCount = 20;
    
    NSInteger ret1 = [FTKeyInterface FTGetCertList:myCertInfo CertInfoCount:&myCertInfoCount];
    
    if(ret1 != FT_SUCCESS) {
        [MBProgressHUD hideHUD];
        
        if(ret1 == FT_NO_DEVICE) {
            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:@"设备未连接" withMessage:@"0"];
            
            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
            return;
        }
        NSString *stringMg = [self retToString:ret1];
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:stringMg withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectFail]];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        
        return;
        
    }
    
    
    
    NSInteger signAlg;
    switch (signAlgMsg) {
        case 1:
            signAlg = FT_HASH_ALG_SHA1;
            break;
        case 2:
            signAlg = FT_HASH_ALG_SHA256;
            break;
        case 3:
            signAlg = FT_HASH_ALG_SHA384;
            break;
        case 4:
            signAlg = FT_HASH_ALG_SHA512;
            break;
        case 5:
            signAlg = FT_HASH_ALG_SM3;
            break;
            
        default:
            signAlg = FT_HASH_ALG_SHA1;
            break;
    }
    
    unsigned int PinTimes = 0;
    
    NSString *SignRet = nil;
    self.alertView.tag = 1;

    NSInteger ret = [FTKeyInterface FTVerifyPIN:strPin PinRemaintimes:&PinTimes delegate:self];
    if(ret != FT_SUCCESS) {
        [MBProgressHUD hideHUD];
        if(FT_PASSWORD_INVALID == ret) {
            
            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:[NSString stringWithFormat:@"密码错误，剩余次数为%d次。", PinTimes] withMessage:nil];
            
            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        }
        
//        if(ret == FT_DEVICE_BUSY) {
//            return;
//        }
        NSString *stringMg = [self retToString:ret];
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:stringMg withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectFail]];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        
        return;
    }
    
    ret = [FTKeyInterface FTSign:signData retData:&SignRet hashAlg:signAlg byCertInfo:myCertInfo[certNo] isRetP7Data:p7 delegate:self];
    
    if(ret != FT_SUCCESS) {
        [MBProgressHUD hideHUD];
        self.alertView.tag = 0;
        [self.alertView dismissWithClickedButtonIndex:0 animated:YES];
        
        if(ret == FT_USER_CANCEL) {
            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:@"用户取消操作" withMessage:@"0"];
            
            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
            return;
        }
        
//        if(ret == FT_DEVICE_BUSY) {
//            return;
//        }
        NSString *stringMg = [self retToString:ret];
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:stringMg withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectFail]];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        
    } else {

//        [self.alertViewSuc show];
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:SignRet withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectSuc]];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
        
    }
}

-(void)destroyFrequencyKey:(PGMethod *)commonds {
    
    self.cbId = [commonds.arguments objectAtIndex:0];

    [FTKeyInterface FTRemoveKeyEventsDelegate];
    [FTKeyInterface FTRemoveKeyEventsDelegate];
    self.isInit = NO;
    
    NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:nil withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectSuc]];
    
    [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
}

-(void)isDefaultFrequencyKey:(PGMethod *)commonds{
    
    self.cbId = [commonds.arguments objectAtIndex:0];
    NSInteger ret = [FTKeyInterface FTIsInitialPassword];
    
    if (ret != FT_SUCCESS) {
        if (ret == FT_DEVICE_BUSY) {
            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusError withResult:@"设备忙" withMessage:nil];
            
            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
            return;
        }
        if (ret == FT_PASSWORD_INITIAL_PASSWORD) {
//            [self setConnectLBTextOnMain:@"PIN码是初始PIN"];
            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:@"PIN码是初始PIN" withMessage:@"1"];
            
            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
            return;
        }
        
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusError withResult:@"检测PIN失败" withMessage:nil];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
//        [self setConnectLBTextOnMain:[NSString stringWithFormat:@"%@:%d", @"检测PIN失败", (unsigned int)ret]];
    }
    else{

        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:@"PIN码已经被修改" withMessage:@"0"];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
//        [self setConnectLBTextOnMain:@"PIN码已经被修改"];
    }
}

-(void)remainCountFrequencyKey:(PGMethod *)commonds{
    
    self.cbId = [commonds.arguments objectAtIndex:0];
    NSString *pinTimes = nil;
    
    NSInteger ret = [FTKeyInterface FTGetPinRemainTimes:&pinTimes];
    
    
    if (ret == FT_SUCCESS) {
        NSLog(@"%@", pinTimes);
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:[NSString stringWithFormat:@"%@", pinTimes] withMessage:@"1"];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
//        [self setConnectLBTextOnMain:[NSString stringWithFormat:@"%@:%@", @"PIN码剩余次数", pinTimes]];
    } else {
        NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:@"获取PIN剩余次数失败" withMessage:@"0"];
        
        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
//        [self setConnectLBTextOnMain:[NSString stringWithFormat:@"%@:%d", @"获取PIN剩余次数失败", (unsigned int)ret]];
    }
}

-(NSString *)stringFromHexData:(unsigned char *)pbHexData length:(NSInteger)length
{
    char strData[128] = {0};
    unsigned int index = 0;
    
    for (int i = 0; i < length; ++i) {
        
        if(i == 0) {
            sprintf(&strData[index], "{0x%02X,", pbHexData[i]);
        }else if(i == length - 1) {
            sprintf(&strData[index], " 0x%02X}", pbHexData[i]);
        }else {
            sprintf(&strData[index], " 0x%02X,", pbHexData[i]);
        }
        
        index += 6;
        
    }
    
    return [NSString stringWithFormat:@"%s", strData];
}
    
/**
 *  需客户实现的连接回调函数
 */
-(void)FTDidDeviceConnected {
    
    self.isInit = YES;
    
}
    
/**
 *  需客户实现的断开连接回调函数
 */
-(void)FTDidDeviceDisconnected {
    
    self.isInit = NO;
    
    NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusError withResult:@"设备未连接" withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectFail]];

    if ([self respondsToSelector:@selector(toCallbackWithCallBackId:ResultDic:andIskeepCallback:)]) {
//        [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];

    } else
        NSLog(@"-------------hehe");
//    [self toCallbackWithCallBackId:self.cbId ResultStr:@"123" Message:@"456" andIskeepCallback:YES];
}

-(void)FTShowChangePinView:(NSInteger)PinCanRetrys{
    _hud.labelText = nil;
    _hud.detailsLabelText = @"正在修改PIN码，如确认请按“OK”键，否则按“C”键取消。";
    NSLog(@"======FTShowChangePinView:(NSInteger)PinCanRetrys");
}

-(void)FTHideChangePinView{
    [MBProgressHUD hideHUD];
    NSLog(@"======FTHideChangePinView");
}

-(void)FTShowSignView{
    [MBProgressHUD hideHUD];
    [self.alertView show];
    NSLog(@"======FTShowSignView");
}
-(void)FTHideSignView{
    //点击key上的确认件走到这里
    self.alertView.tag = 0;
    [self.alertView dismissWithClickedButtonIndex:0 animated:YES];
    NSLog(@"======FTHideSignView");
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    
    if(alertView.tag == 1){
        
        if (!self.isInit) {
            [FTKeyInterface FTSetTransmitType:0];
            [FTKeyInterface FTSetKeyEventsDelegate:self];
            self.isInit = YES;
            
        }
        
        NSInteger ret = [FTKeyInterface FTTurnOverKeyScreenState];
        
        if(ret != FT_SUCCESS) {
            
            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:[NSString stringWithFormat:@"%ld", ret] withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectFail]];
            
            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
            
            if(ret == FT_DEVICE_BUSY) {
                return;
            }
            
        }else {
            
//            NSDictionary *dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:nil withMessage:[NSString stringWithFormat:@"%d", FrequencyKeyConnectSuc]];
//            
//            [self toCallbackWithCallBackId:self.cbId ResultDic:dic andIskeepCallback:NO];
            
        }
        
        
        
    }else{
        
    }
}

- (NSString*)retToString:(NSInteger)codeNum{
    NSString *codeString = nil;
    
    switch (codeNum) {
        case 1:
            codeString = @"操作失败";
            break;
        case 2:
            codeString = @"设备未连接";
            break;
        case 3:
            codeString = @"设备忙";
            break;
        case 4:
            codeString = @"参数错误";
            break;
        case 5:
            codeString = @"密码错误";
            break;
        case 6:
            codeString = @"用户取消操作";
            break;
        case 7:
            codeString = @"操作超时";
            break;
        case 8:
            codeString = @"没有找到证书或对应密钥对";
            break;
        case 9:
            codeString = @"证书格式不正确";
            break;
        case 10:
            codeString = @"未知错误";
            break;
        case 11:
            codeString = @"PIN码锁定";
            break;
        case 12:
            codeString = @"操作被打断";
            break;
        case 13:
            codeString = @"通讯错误";
            break;
        case 14:
            codeString = @"设备电量不足，不能进行通讯";
            break;
        case 15:
            codeString = @"设备类型不匹配";
            break;
        case 16:
            codeString = @"证书过期";
            break;
        case 17:
            codeString = @"证书未生效";
            break;
        case 18:
            codeString = @"麦克风拒绝访问";
            break;
        case 19:
            codeString = @"通讯超时";
            break;
        case 20:
            codeString = @"序列号不匹配";
            break;
        case 21:
            codeString = @"新旧密码相同";
            break;
        case 22:
            codeString = @"密码长度错误";
            break;
        case 23:
            codeString = @"新密码与确认密码不一致";
            break;
        case 24:
            codeString = @"简单密码";
            break;
        case 25:
            codeString = @"没有匹配到证书";
            break;
        case 26:
            codeString = @"此应用没有得到蓝牙设置的授权";
            break;
        case 27:
            codeString = @"蓝牙功能关闭";
            break;
        case 28:
            codeString = @"此设备不支持蓝牙4.0协议";
            break;
        case 29:
            codeString = @"取消连接设备";
            break;
        case 30:
            codeString = @"签名报文格式不正确";
            break;
        case 31:
            codeString = @"签名算法错误";
            break;
        case 32:
            codeString = @"需要用户手动去手机设置解除绑定";
            break;
        case 33:
            codeString = @"蓝牙Key已与其他设备进行绑定";
            break;
        case 34:
            codeString = @"需要用户从手机端和key端双方解除绑定";
            break;
        case 35:
            codeString = @"手机与蓝牙绑定失败";
            break;
        case 36:
            codeString = @"PIN是初始PIN";
            break;
            
        default:
            break;
    }
    
    return codeString;
}

@end
