//
//  FTUserProtocol.h
//  FTSTDLib
//
//  Created by liyuelei on 15/1/26.
//  Copyright (c) 2015年 FT. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FTUserMacro.h"

//===============以下为key连接或断开的回调接口，如客户需要可实现==================
@protocol FTKeyEventsDelegate <NSObject>
@optional
/**
 *  需客户实现的连接回调函数
 *
 *  @param 无
 *
 *  @return 无
 */
-(void)FTDidDeviceConnected;

/**
 *  需客户实现的断开连接回调函数
 *
 *  @param 无
 *
 *  @return 无
 */
-(void)FTDidDeviceDisconnected;

/**
 *当连接蓝牙key需要用户按键确认连接时，客户需要实现此方法，提示用户按键
 *
 *@param VerifyWords 用户按键确认时，用以核对的验证码
 *
 *@return 无
 */
-(void)FTShowBLEConnectNeedConfirmView:(NSString *)VerifyWords;

/**
 *当连接蓝牙key需要用户按键确认连接时，客户需要实现此方法，隐藏提示用户按键的界面
 *
 *@param 无
 *
 *@return 无
 */
-(void)FTHideBLEConnectNeedConfirmView;

@end

//=========================以下为具体功能的回调接口，需客户实现
@protocol FTFunctionDelegate <NSObject>
@optional

/**
 *  需客户实现的验证PIN提示按键回调接口
 *
 *  @param PinCanRetrys Pin的剩余可重试次数
 *
 *  @return 无
 */
-(void)FTShowVerifyPinView:(NSInteger)PinCanRetrys;

/**
 *  需客户实现的隐藏验证PIN提示按键回调接口
 *
 *  @param 无
 *
 *  @return 无
 */
-(void)FTHideVerifyPinView;

/**
 *  需客户实现的修改PIN提示按键回调接口
 *
 *  @param PinCanRetrys Pin的剩余可重试次数
 *
 *  @return 无
 */
-(void)FTShowChangePinView:(NSInteger)PinCanRetrys;

/**
 *  需客户实现的隐藏修改PIN提示按键回调接口
 *
 *  @param 无
 *
 *  @return 无
 */
-(void)FTHideChangePinView;

/**
 *  需客户实现的签名过程中的提示按键回调接口
 *
 *  @param  无
 *
 *  @return 无
 */
-(void)FTShowSignView;

/**
 *  需客户实现的隐藏签名过程中的提示按键回调接口
 *
 *  @param  无
 *
 *  @return 无
 */
-(void)FTHideSignView;

/**
 *  需客户实现的显示提示再次按键的回调接口(在一些需求中可能需要两次按键确认,如没有此需求可不实现)
 *
 *  @param  无
 *
 *  @return 无
 */
-(void)FTShowCheckAndPressAgainView;

/**
 *  需客户实现的隐藏提示再次按键的回调接口(在一些需求中可能需要两次按键确认,如没有此需求可不实现)
 *
 *  @param  无
 *
 *  @return 无
 */
-(void)FThideCheckAndPressAgainView;

@end


//=============以下为key厂商实现的功能接口，需厂商实现=============
@protocol FTUserProtocol <NSObject>
@required

/**
 *  获取静态库版本
 *
 *  @param Version 返回的静态库版本
 *
 *  @return 成功：0，失败：错误码
 */
+(NSInteger)FTGetLibVersion:(NSString **)Version;

/**
 *  设置key断开或连接的回调代理
 *
 *  @param delegate key连接或断开的回调代理
 *
 *  @return 无
 */
+(void)FTSetKeyEventsDelegate:(id<FTKeyEventsDelegate>)delegate;


/**
 *  移除key断开或连接的回调代理
 *
 *  注意:在delegate释放前需要调用此方法，否则会导致调用已释放的delegate出现崩溃
 *
 *  @param 无
 *
 *  @return 无
 */
+(void)FTRemoveKeyEventsDelegate;

/**
 * 设置通讯类型
 * @param  Type 通讯类型(0-音频(默认值), 1-蓝牙4.0(BLE))
 * @return 成功-0, 失败-错误码
 */
+(NSInteger)FTSetTransmitType:(NSInteger)Type;

/**
 * 获取通讯类型
 * @param  pType 返回的通讯类型(0-音频,1-蓝牙4.0(BLE))
 * @return 0-成功,失败-错误码
 */
+(NSInteger)FTGetTransmitType:(NSInteger *)pType;

/**
 * 根据Ukey序列号连接蓝牙设备(只适用于BLE)
 * @param  sn 要连接的Ukey的序列号
 * @param  timeout 连接Ukey等待的超时时间(以秒为单位)
 * @return 成功-0，失败-错误码
 */
+(NSInteger)FTConnectBLEDevice:(NSString *)sn timeout:(float)timeout;

/**
 * 取消连接蓝牙设备
 * @param 无
 * @return 成功-0，失败-错误码
 */
+(NSInteger)FTCancelConnectBLEDevice;


/**
 *断开已经连接的蓝牙设备(只适用于BLE)
 *@param 无
 *
 *@return 成功-0，失败-错误码
 *
 */
+(NSInteger)FTDisconnectBLEDevice;

/**
 *打开手机的设置界面方便用户解除蓝牙key的绑定(只适用于BLE)
 *@param 无
 *
 *@return 成功-0，失败-错误码
 *
 */
+(NSInteger)FTUnBindingBLEDevice;

/**
 *用户已确认在手机蓝牙设置中忽略设备(只适用于BLE),调用此函数才会清空内部标志，避免再次提示解除绑定错误码
 *@param 无
 *
 *@return 成功-0，失败-错误码
 *
 */
+(NSInteger)FTConfirmUnbindingBLEDevice;

/**
 *  翻转Ukey屏显内容
 *
 *  @param 无
 *
 *  @return 成功-0，失败-错误码
 */
+(NSInteger)FTTurnOverKeyScreenState;

/**
 *  读取序列号
 *
 *  @param SN 返回的序列号
 *
 *  @return 成功-0，失败-错误码
 */
+(NSInteger)FTReadSN:(NSString **)SN;

/**
 *  读取证书列表（当有多证书时，为获取指定证书做准备）
 *
 *  @param CertInfoList 证书信息列表(这里是一个结构体列表最好是10个结构体)
 *  @param CertInfoCount 返回的有效证书信息的个数(初始化值是外部分配的证书信息结构体个数)
 *
 *  @return 成功-0，失败-错误码
 */
+(NSInteger)FTGetCertList:(FT_Cert_Info *)CertInfoList CertInfoCount:(NSInteger *)CertInfoCount;

/**
 *  按照指定证书信息去读取证书内容
 *
 *  @param CertInfo     要读取证书内容的证书信息结构体
 *  @param CertValue    返回的证书信息(base64编码)
 *
 *  @return 成功-0，失败-错误码
 */
+(NSInteger)FTReadCertValueByCertInfo:(FT_Cert_Info)CertInfo CertValue:(NSString **)CertValue;

/**
 *  校验pin码
 *
 *  @param Pin PIN码
 *  @param PinRemainTimes 功能执行后的PIN的可重试次数
 *  @param delegate 当key需要用户按键时，会调用delegate的实现的回调方法
 *
 *  @return 成功-0，失败-错误码
 */
+(NSInteger)FTVerifyPIN:(NSString*)Pin PinRemaintimes:(unsigned int *)PinRemainTimes delegate:(id<FTFunctionDelegate>)delegate;

/**
 *  修改pin码
 *
 *  @param oldPIN 原PIN码
 *  @param newPIN 新PIN码
 *  @param PinRemainTimes 功能执行后的PIN的可重试次数
 *  @param delegate 当key需要用户按键时，会调用delegate的实现的回调方法
 *
 *  @return 成功-0，失败-错误码
 */
+(NSInteger)FTChangePIN:(NSString *)oldPIN newPIN:(NSString *)newPIN PinRemainTimes:(unsigned int *)PinRemainTimes delegate:(id<FTFunctionDelegate>)delegate;

/**
 *  复核签名
 *
 *  @param signData 签名原文
 *  @param SignResult   签名结果(base64编码)
 *  @param hashAlg      哈希算法（sha1 - 0 ,sha256 - 1,sha384 - 2,sha512 - 3）
 *  @param theCertInfo  签名使用的证书信息
 *  @param isP7Data     是否返回P7格式的签名结果
 *  @param delegate     当key需要用户按键时，会调用delegate的实现的回调方法
 *
 *  @return 成功-0，失败-错误码
 */
+(NSInteger)FTSign:(NSString *)signData retData:(NSString **)SignResult hashAlg:(NSInteger)hashAlg byCertInfo:(FT_Cert_Info)theCertInfo isRetP7Data:(BOOL)isP7Data delegate:(id<FTFunctionDelegate>)delegate;

/**
 * 检测是否为初始PIN
 * @param  无
 * @return 是-36, 否-0, 失败-错误码
 */
+(NSInteger)FTIsInitialPassword;

/**
 *  获取keyPIN码剩余次数
 *
 *  @param pinTimes 用于返回key当前Pin码剩余次数
 *
 *  @return 成功-0，失败-错误码
 */
+(NSInteger)FTGetPinRemainTimes:(NSString **)pinTimes;


@end
