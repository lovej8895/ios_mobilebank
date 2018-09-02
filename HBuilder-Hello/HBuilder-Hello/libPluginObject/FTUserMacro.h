//
//  FTUserErrCode.h
//  FTSTDLib
//
//  Created by liyuelei on 15/7/30.
//  Copyright © 2015年 FT. All rights reserved.
//

#ifndef FTUserErrCode_h
#define FTUserErrCode_h

//错误码
#define  FT_SUCCESS                         0x00000000  //操作成功
#define  FT_OPERATION_FAILED                0x00000001  //操作失败
#define  FT_NO_DEVICE                       0x00000002  //设备未连接
#define  FT_DEVICE_BUSY                     0x00000003  //设备忙
#define  FT_INVALID_PARAMETER               0x00000004  //参数错误
#define  FT_PASSWORD_INVALID                0x00000005  //密码错误
#define  FT_USER_CANCEL                     0x00000006  //用户取消操作
#define  FT_OPERATION_TIMEOUT               0x00000007  //操作超时
#define  FT_NO_CERT                         0x00000008  //没有找到证书或对应密钥对
#define  FT_CERT_INVALID                    0x00000009  //证书格式不正确
#define  FT_UNKNOW_ERROR                    0x0000000A  //未知错误
#define  FT_PIN_LOCK                        0x0000000B  //PIN码锁定
#define  FT_OPERATION_INTERRUPT             0x0000000C  //操作被打断（如来电等）
#define  FT_COMM_ERROR                      0x0000000D  //通讯错误
#define  FT_ENERGY_LOW                      0x0000000E  //设备电量不足，不能进行通讯
#define  FT_INVALID_DEVICE_TYPE             0x0000000F  //设备类型不匹配
#define  FT_CERT_EXPIRED                    0x00000010  //证书过期
#define  FT_CERT_NOT_FROM_FUTURE            0x00000011  //证书未生效
#define  FT_MICROPHONE_REFUSE               0x00000012  //麦克风拒绝访问(ios7)
#define  FT_COMM_TIMEOUT                    0x00000013  //通讯超时
#define  FT_SN_NOTMATCH                     0x00000014  //序列号不匹配
#define  FT_SAME_PASSWORD                   0x00000015  //新旧密码相同
#define  FT_PASSWORD_INVALID_LENGTH         0x00000016  //密码长度错误
#define  FT_PASSWORD_DIFFERENT              0x00000017  //新密码与确认密码不一致
#define  FT_PASSWORD_TOO_SIMPLE             0x00000018  //简单密码
#define  FT_CERT_NOTMATCH                   0x00000019  //没有匹配到证书
#define  FT_BLE_APP_NOT_BLE_AUTHORIZE       0x0000001A  //此应用没有得到蓝牙设置的授权
#define  FT_BLE_BLUETOOTH_POWER_OFF         0x0000001B  //蓝牙功能关闭
#define  FT_BLE_PLATFORM_NOT_SUPPORT_BLE    0x0000001C  //此设备不支持蓝牙4.0协议
#define  FT_BLE_CANCEL_CONNECT_DEVICE       0x0000001D  //取消连接设备
#define  FT_SIGN_MESSAGE_ERROR              0x0000001E  //签名报文格式不正确
#define  FT_SIGN_ALG_ERROR                  0x0000001F  //签名算法错误
#define  FT_NEED_PHONE_UNBINDING            0x00000020  //需要用户手动去手机设置解除绑定
#define  FT_NEED_KEY_UNBINDING              0x00000021  //蓝牙Key已与其他设备进行绑定(需要与其他设备解除绑定)
#define  FT_NEED_PHONE_AND_KEY_UNBINDING    0x00000022  //需要用户从手机端和key端双方解除绑定
#define  FT_DO_BINDING_ERROR                0x00000023  //手机与蓝牙绑定失败
#define  FT_PASSWORD_INITIAL_PASSWORD       0x00000024  //PIN是初始PIN

//签名使用的哈希算法
#define  FT_HASH_ALG_SHA1                   0x20000000  //SHA1哈希算法
#define  FT_HASH_ALG_SHA256                 0x20000001  //SHA256哈希算法
#define  FT_HASH_ALG_SHA384                 0x20000002  //SHA384哈希算法
#define  FT_HASH_ALG_SHA512                 0x20000003  //SHA512哈希算法
#define  FT_HASH_ALG_SM3                    0x20000004  //SM3哈希算法

//证书结构体定义
typedef struct
{
    unsigned char bCertType;            //证书类型
    unsigned char bTime[20];            //证书有效期：格式：4位年2位月2位日4位年2位月2位日
    unsigned int dwTimeLen;             //证书有效期数据长度
    unsigned char bIssuerDN[1024];      //证书颁发者DN数据
    unsigned int  dwIssuerDNLen;        //证书颁发者DN数据长度
    unsigned char bSubjectDN[1024];     //证书持有者DN数据
    unsigned int  dwSubjectDNLen;       //证书持有者DN数据长度
    unsigned char bSN[128];             //证书SN数据
    unsigned int  dwSNLen;              //证书SN数据长度
}FT_Cert_Info;

typedef enum {
    FT_CERTTYPE_ALL                        = 0x00000000, // 所有类型证书     获取证书使用
    FT_CERTTYPE_RSA1024_PLAIN,                           // RSA1024普通证书
    FT_CERTTYPE_RSA1024_REEXAMINE,                       // RSA1024复核证书  用来交易签名
    FT_CERTTYPE_RSA1024_MIX,                             // RSA1024混合证书
    FT_CERTTYPE_RSA2048_PLAIN,                           // RSA2048普通证书
    FT_CERTTYPE_RSA2048_REEXAMINE,                       // RSA2048复核证书  用来交易签名
    FT_CERTTYPE_RSA2048_MIX,                             // RSA2048混合证书
    FT_CERTTYPE_SM2_PLAIN,                               // SM2普通证书
    FT_CERTTYPE_SM2_REEXAMINE,                           // SM2复核证书      用来交易签名
    FT_CERTTYPE_SM2_MIX                                  // SM2混合证书
} FTCertType;

#endif /* FTUserErrCode_h */
