//
//  PGPassGuardView.m
//  HBuilder-Hello
//
//  Created by guoxd on 16/6/6.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import "PGPassGuardView.h"
#import "JZYHDictionary.h"
#import "PassGuardViewController.h"
@interface PGPassGuardView()<BarDelegate>{
    BOOL isNumKeyBoard;
    
    NSMutableDictionary *dicInputText;
    
    
}

@property (nonatomic,strong)PassGuardViewController *pgvc;

@property(nonatomic,copy)NSString *identifier;//bundleID

@property(nonatomic,copy)NSString *string;//www的上一级目录

@property (copy, nonatomic) NSString *cipherText;

@property(copy,nonatomic) NSString *md5Txt;


@property (nonatomic,strong)NSString *callBackID;


@property (nonatomic,strong)NSString *hideCallBackID;



@property (nonatomic,strong) NSString *encryptionType;//加密方式

@property (nonatomic,strong) NSString *inputID;//每个控件的唯一表示

@end

@implementation PGPassGuardView

-(void)getLicenseString
{
    self.identifier = [[NSBundle mainBundle]bundleIdentifier];
    NSArray *arr = [self ArrayOfIdentifier:self.identifier];
    self.string = [arr lastObject];
    NSLog(@"_string = %@",self.string);
    NSString *path1 = [NSString stringWithFormat:@"%@%@",self.string,@"/www/yuconfig.json"];
    NSString *path= [[[NSBundle mainBundle] bundlePath] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@/%@", @"Pandora/apps",path1]];
    
    NSData *data = [[NSData alloc]initWithContentsOfFile:path];
    
    NSLog(@"datadata = %@",data);
    
    NSDictionary *dicti = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:nil];
    NSDictionary *licenseDic = [dicti objectForKey:@"keyboard"];
    NSString *licenseString = [licenseDic objectForKey:@"keyboard-license"];
    [[self.pgvc m_tf] setM_license:licenseString];
    NSLog(@"licenseString == %@",licenseString);
}

-(NSArray *)ArrayOfIdentifier:(NSString *)identiferStr
{
    NSArray *array = [[NSArray alloc]init];
    array = [identiferStr componentsSeparatedByString:@"."];
    return array;
}



//-(void)registerHideKeyBoardCallBack:(PGMethod *)commends{
//
//    if (commends) {
//        self.hideCallBackID=[commends.arguments objectAtIndex:0];
//
//
//    }
//}






-(void)openRSAAESKeyboard:(PGMethod *)commends
{
    
    if (commends) {
        
        
        if(!dicInputText){
            
            dicInputText =[NSMutableDictionary new];
        }
        //  self.pgvc = nil;
        self.encryptionType = @"rsaaes";
        self.callBackID = [commends.arguments objectAtIndex:0];
        self.inputID=[commends.arguments objectAtIndex:1];
        
        isNumKeyBoard = [[commends.arguments objectAtIndex:2]boolValue];
        int confuse = [[commends.arguments objectAtIndex:3]intValue];
        int maxLength = [[commends.arguments objectAtIndex:4]intValue];
        BOOL showEditText = [[commends.arguments objectAtIndex:5]boolValue];
        BOOL watchOutside = [[commends.arguments objectAtIndex:6]boolValue];
        BOOL buttonPress = [[commends.arguments objectAtIndex:7]boolValue];
        NSString *random = [commends.arguments objectAtIndex:10];
        NSString *publicKey = [commends.arguments objectAtIndex:11];
        //密码设置的正则表达式
        NSString *regex = [commends.arguments objectAtIndex:8];
        //设置键盘输入正则规则
        NSString *inputregex = [commends.arguments objectAtIndex:9];
        
        if([dicInputText objectForKey:self.inputID]){//已经创建过了
            self.pgvc=[dicInputText objectForKey:self.inputID];
            
        }
        else{
            self.pgvc = [[PassGuardViewController alloc] init];
            [dicInputText setObject:self.pgvc forKey:self.inputID];
            
        }
        [[self.pgvc m_tf] setWebdelegate:self];
        
        [self.pgvc setDelegate:self];
        [self.pgvc setM_isDispearWithTouchOutside:watchOutside];
        [[self.pgvc m_tf] setM_mode:false];
        [self getLicenseString];
        self.pgvc.m_bshowtoolbar = showEditText;
        [[self.pgvc m_tf] setM_uiapp:[UIApplication sharedApplication]];
        
        
        [[self.pgvc m_tf] setM_ikeyordertype:confuse];
        
        [[self.pgvc m_tf]setM_iMaxLen:maxLength];
        
        [[self.pgvc m_tf]setM_hasstatus:buttonPress];//键盘是否选中提示
        
        //设置随机字符串，用来产生AES密钥（需要与解密端字符串同步）
        [[self.pgvc m_tf]setM_strInput1:random];
        //设置RSA加密公钥。
        [[self.pgvc m_tf]setM_strInput2:publicKey];
        
        [[self.pgvc m_tf] setM_strInput3:[[NSString alloc] initWithFormat:@"%s", "!@^&*JI"]]; //设置随机字符串
        
        
        if (regex) {
            [[self.pgvc m_tf]setM_strInputR2:regex];
        }
        if (inputregex) {
            
            [[self.pgvc m_tf]setM_strInputR1:inputregex];
        }
        
        if (isNumKeyBoard) {
            
            [self.pgvc m_tf].keyboardType = UIKeyboardTypeNumberPad;
        }
        else
        {
            [self.pgvc m_tf].keyboardType = UIKeyboardTypeDefault;
        }
        
        
        
        [self.pgvc show];
        
        
        //添加个返回高度的修改
        [self getKeyboardHeight:commends];
        
        
    }
    
}

//隐藏键盘的时候调用
- (void) BHideFun:(id)sender{
    
    if(self.pgvc){
        
        NSString *jsonStr = [NSString stringWithFormat:@"{\"textFieldID\":\"%@\"}", self.inputID];
        
        
        NSDictionary *dic = [NSDictionary dictionary];
        
        if (jsonStr) {
            dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:jsonStr withMessage:@"3"];
        } else {
            dic = [JZYHDictionary jzyhDictionaryWithStatus:statusError withResult:nil withMessage:@"0"];
        }
        PDRPluginResult *result;
        
        if (PDRCommandStatusOK) {
            // 运行Native代码结果和预期相同，调用回调通知JS层运行成功并返回结果
            result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsDictionary:dic];
            
        } else {
            // 如果Native代码运行结果和预期不同，需要通过回调通知JS层出现错误，并返回错误提示
            result = [PDRPluginResult resultWithStatus:PDRCommandStatusError messageAsString:@"您的请求出错，请检查后再试！"];
        }
        result.keepCallback = YES;
        
        // 通知JS层Native层运行结果出错
        
        [self toCallback:self.callBackID withReslut:[result toJSONString]];
        
    }
    
    
    
}


- (void) BDoneFun:   (id)sender{
    
}

- (void) BCancelFun: (id)sender{
    
}






-(void)openMD5Keyboard:(PGMethod *)commends
{
    //    if (commends) {
    //       // self.pgvc = nil;
    //        self.callBackID = [commends.arguments objectAtIndex:0];
    //
    //
    //        /*
    //         pwdId, "false", 0,10,"true","true","false","^(?![^a-zA-Z]+$)(?!\\D+$).{6,16}$","",
    //
    //         "abcdefghijklmnopqrstuvwxyz123456",
    //
    //
    //         "3081890281810092d9d8d04fb5f8ef9b8374f21690fd46fdbf49b40eeccdf416b4e2ac2044b0cfe3bd67eb4416b26fd18c9d3833770a526fd1ab66a83ed969af74238d6c900403fc498154ec74eaf420e7338675cad7f19332b4a56be4ff946b662a3c2d217efbe4dc646fb742b8c62bfe8e25fd5dc59e7540695fa8b9cd5bfd9f92dfad009d230203010001"
    //
    //
    //
    //         */
    //
    //        //设置键盘是数字键盘还是全键盘
    //        isNumKeyBoard = [[commends.arguments objectAtIndex:2]boolValue];
    //
    //
    //
    //
    //
    //        //设置键盘是否乱序
    //        int confuse = [[commends.arguments objectAtIndex:3]intValue];
    //        //设置键盘可输入的最大长度
    //        int maxLength = [[commends.arguments objectAtIndex:4]intValue];
    //        //键盘是否显示edittext
    //        BOOL showEditText = [[commends.arguments objectAtIndex:5]boolValue];
    //        //点击空白区域关闭密码键盘
    //        BOOL watchOutside = [[commends.arguments objectAtIndex:6]boolValue];
    //        //键盘按下效果
    //        BOOL buttonPress = [[commends.arguments objectAtIndex:7]boolValue];
    //        //密码设置的正则表达式
    //        NSString *regex = [commends.arguments objectAtIndex:8];
    //        //设置键盘输入正则规则
    //        NSString *inputregex = [commends.arguments objectAtIndex:9];
    //
    //        self.encryptionType = @"md5";
    //
    //        if (self.pgvc == nil) {
    //
    //            self.pgvc = [[PassGuardViewController alloc] init];
    //
    //            [[self.pgvc m_tf] setWebdelegate:self];
    //
    //            [self.pgvc setDelegate:self];
    //
    //            [self.pgvc setM_isDispearWithTouchOutside:watchOutside];
    //        }
    //
    //        [[self.pgvc m_tf] setM_mode:false];
    //
    //       [self getLicenseString];
    ////
    //        self.pgvc.m_bshowtoolbar = showEditText;
    ////
    //        [[self.pgvc m_tf] setM_uiapp:[UIApplication sharedApplication]];
    //
    //        //        [[self.pgvc m_tf] setM_bsupportrotate:false];
    //        //
    //        //        [self.pgvc m_tf].m_isResignFirstRes = false;
    //
    //        [[self.pgvc m_tf] setM_ikeyordertype:confuse];
    //
    //        [[self.pgvc m_tf]setM_iMaxLen:maxLength];
    //
    //        [[self.pgvc m_tf]setM_hasstatus:buttonPress];
    //
    //        if (regex) {
    //            [[self.pgvc m_tf]setM_strInputR2:regex];
    //        }
    //        if (inputregex) {
    //
    //            [[self.pgvc m_tf]setM_strInputR1:inputregex];
    //        }
    //
    //       // [[self.pgvc m_tf] Clean];
    //
    //        if (isNumKeyBoard) {
    //
    //            [self.pgvc m_tf].keyboardType = UIKeyboardTypeNumberPad;
    //        }
    //        else
    //        {
    //            [self.pgvc m_tf].keyboardType = UIKeyboardTypeDefault;
    //        }
    //
    //        [self.pgvc show];
    //    }
    
}

-(void)openAESKeyboard:(PGMethod *)commends
{
    //    if (commends) {
    //     //   self.pgvc = nil;
    //        self.encryptionType = @"aes";
    //        self.callBackID = [commends.arguments objectAtIndex:0];
    //        isNumKeyBoard = [[commends.arguments objectAtIndex:2]boolValue];
    //        int confuse = [[commends.arguments objectAtIndex:3]intValue];
    //        int maxLength = [[commends.arguments objectAtIndex:4]intValue];
    //        BOOL showEditText = [[commends.arguments objectAtIndex:5]boolValue];
    //        BOOL watchOutside = [[commends.arguments objectAtIndex:6]boolValue];
    //        BOOL buttonPress = [[commends.arguments objectAtIndex:7]boolValue];
    //        //密码设置的正则表达式
    //        NSString *regex = [commends.arguments objectAtIndex:8];
    //
    //        NSString *random = [commends.arguments objectAtIndex:10];
    //
    //        //设置键盘输入正则规则
    //        NSString *inputregex = [commends.arguments objectAtIndex:9];
    //
    //        if (self.pgvc == nil) {
    //
    //            self.pgvc = [[PassGuardViewController alloc] init];
    //
    //            [[self.pgvc m_tf] setWebdelegate:self];
    //
    //            [self.pgvc setDelegate:self];
    //
    //            [self.pgvc setM_isDispearWithTouchOutside:watchOutside];
    //        }
    //
    //        [[self.pgvc m_tf] setM_mode:false];
    //
    //        [self getLicenseString];
    //
    //        self.pgvc.m_bshowtoolbar = showEditText;
    //
    //        [[self.pgvc m_tf] setM_uiapp:[UIApplication sharedApplication]];
    //
    //        //        [[self.pgvc m_tf] setM_bsupportrotate:false];
    //        //
    //        //        [self.pgvc m_tf].m_isResignFirstRes = false;
    //
    //        [[self.pgvc m_tf] setM_ikeyordertype:confuse];
    //
    //        [[self.pgvc m_tf]setM_iMaxLen:maxLength];
    //
    //        [[self.pgvc m_tf]setM_hasstatus:buttonPress];
    //
    //        [[self.pgvc m_tf]setM_strInput1:random];
    //
    //        if (regex) {
    //            [[self.pgvc m_tf]setM_strInputR2:regex];
    //        }
    //        if (inputregex) {
    //
    //            [[self.pgvc m_tf]setM_strInputR1:inputregex];
    //        }
    //
    //      //  [[self.pgvc m_tf] Clean];
    //
    //        if (isNumKeyBoard) {
    //
    //            [self.pgvc m_tf].keyboardType = UIKeyboardTypeNumberPad;
    //        }
    //        else
    //        {
    //            [self.pgvc m_tf].keyboardType = UIKeyboardTypeDefault;
    //        }
    //
    //        [self.pgvc show];
    //    }
    
}

-(NSData *)hideKeyboard:(PGMethod *)commends
{
    NSString *pResultString;
    if (self.pgvc.isShow) {
        
        pResultString = @"1";
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.pgvc dismiss];
        });
    }
    else{
        pResultString = @"0";
    }
    return [self resultWithString: pResultString];
}

-(NSData *)checkMatch:(PGMethod *)commends
{
    
    NSString* txtID = [commends.arguments objectAtIndex:0];
    PassGuardViewController *pgvcNeed;
    if([dicInputText objectForKey:txtID]){//已经创建过了
        pgvcNeed=[dicInputText objectForKey:txtID];
        // 按照字符串方式返回结果
        return [self resultWithBool:[[pgvcNeed m_tf]isMatch]];
        
        
    }
    else{//校验通过
        return [self resultWithBool:YES];
    }
    
}


-(void)getKeyboardHeight:(PGMethod *)commends
{
    if(self.pgvc){
        double height=0;
        
        NSString* txtID = [commends.arguments objectAtIndex:1];
        PassGuardViewController *pgvcNeed;
        if([dicInputText objectForKey:txtID]){
            pgvcNeed=[dicInputText objectForKey:txtID];
            
            height= [pgvcNeed.m_tf getKeyboardHeight];
            
            
            
        }
        else{
            if(dicInputText&&dicInputText.count>0){
                
                
                pgvcNeed=[[dicInputText allValues] objectAtIndex:0];
                
                height= [pgvcNeed.m_tf getKeyboardHeight];
                
            }
        }
        
        
        NSString *jsonStr = [NSString stringWithFormat:@"%f", height];
        NSDictionary *dic = [NSDictionary dictionary];
        
        if (jsonStr) {
            dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:jsonStr withMessage:@"1"];
        } else {
            dic = [JZYHDictionary jzyhDictionaryWithStatus:statusError withResult:nil withMessage:@"0"];
        }
        PDRPluginResult *result;
        
        if (PDRCommandStatusOK) {
            // 运行Native代码结果和预期相同，调用回调通知JS层运行成功并返回结果
            result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsDictionary:dic];
            
        } else {
            // 如果Native代码运行结果和预期不同，需要通过回调通知JS层出现错误，并返回错误提示
            result = [PDRPluginResult resultWithStatus:PDRCommandStatusError messageAsString:@"您的请求出错，请检查后再试！"];
        }
        result.keepCallback = YES;
        
        // 通知JS层Native层运行结果出错
        
        [self toCallback:self.callBackID withReslut:[result toJSONString]];
    }
}





//-(NSData *)getKeyboardHeight:(PGMethod *)commends
//{
//
//
//    NSString* txtID = [commends.arguments objectAtIndex:0];
//    PassGuardViewController *pgvcNeed;
//    if([dicInputText objectForKey:txtID]){
//        pgvcNeed=[dicInputText objectForKey:txtID];
//
//       double height= [pgvcNeed.m_tf getKeyboardHeight];
//
//        return [self resultWithDouble:height];
//
//    }
//    else{
//        if(dicInputText&&dicInputText.count>0){
//
//            double height= [[[dicInputText allValues] objectAtIndex:0] getKeyboardHeight];
//
//            return [self resultWithDouble:height];
//
//        }
//
//       return [self resultWithDouble:0];
//    }
//
//}







-(NSData *)clearKeyboard:(PGMethod *)commends
{
    NSString* txtID = [commends.arguments objectAtIndex:0];
    PassGuardViewController *pgvcNeed;
    if([dicInputText objectForKey:txtID]){//已经创建过了
        pgvcNeed=[dicInputText objectForKey:txtID];
        [[pgvcNeed m_tf] Clean];
    }
    
    
    return [self resultWithBool:YES];
}




//输入文本之后调用这个
-(void)instertWText{
    
    [self getPDRPluginResult];
    
}

- (void)getPDRPluginResult {
    
    if ([self.encryptionType isEqualToString:@"md5"]) {
        
        if (!([self.pgvc m_tf].text.length == 0)) {
            
            self.cipherText = [[self.pgvc m_tf]getOutput2];
        }
        else{
            self.cipherText = @"";
        }
    }
    if ([self.encryptionType isEqualToString:@"aes"]) {
        
        if (!([self.pgvc m_tf].text.length == 0)) {
            self.cipherText = [[self.pgvc m_tf]getOutput1];
        }
        else{
            self.cipherText = @"";
        }
        
    }
    if ([self.encryptionType isEqualToString:@"rsaaes"]) {
        
        if (!([self.pgvc m_tf].text.length == 0)) {
            
            if(isNumKeyBoard){//纯数字键盘
                
                //NSString *ftr=[[self.pgvc m_tf]getOutput5:0];
                
                self.cipherText = [[self.pgvc m_tf]getOutput5:0];
                
                
                
            }
            else{
                self.cipherText = [[self.pgvc m_tf]getOutput4];
            }
            
            self.md5Txt=[[self.pgvc m_tf]getOutput2];
            
        }
        else{
            self.cipherText = @"";
            self.md5Txt=@"";
        }
        
        
        
        
    }
    
    
    
    NSLog(@"=============================[pgvc m_tf].text]=%@",[self.pgvc m_tf].text);
    
    
    
    
    
    
    NSString *jsonStr = [NSString stringWithFormat:@"{\"cipherText\":\"%@\", \"md5\":\"%@\"  , \"text\":\"%@\"}", self.cipherText,self.md5Txt,[self.pgvc m_tf].text];
    
    
    // NSLog(@"=================%@",jsonStr);
    
    
    
    
    NSDictionary *dic = [NSDictionary dictionary];
    
    if (jsonStr) {
        dic = [JZYHDictionary jzyhStringWithStatus:statusOK withResult:jsonStr withMessage:@"2"];
    } else {
        dic = [JZYHDictionary jzyhDictionaryWithStatus:statusError withResult:nil withMessage:@"0"];
    }
    PDRPluginResult *result;
    
    if (PDRCommandStatusOK) {
        // 运行Native代码结果和预期相同，调用回调通知JS层运行成功并返回结果
        result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsDictionary:dic];
        
    } else {
        // 如果Native代码运行结果和预期不同，需要通过回调通知JS层出现错误，并返回错误提示
        result = [PDRPluginResult resultWithStatus:PDRCommandStatusError messageAsString:@"您的请求出错，请检查后再试！"];
    }
    result.keepCallback = YES;
    
    NSLog(@"[result toJSONString] == %@",[result toJSONString]);
    // 通知JS层Native层运行结果出错
    [self toCallback:self.callBackID withReslut:[result toJSONString]];
    
}

- (void) CancelFun: (id)sender
{
    NSLog(@"className == %s",__func__);
    
}
- (void) HideFun:(id)sender
{
    NSLog(@"className == %s",__func__);
    
}
-(void)DoneFun:(id)sender{
    
    NSLog(@"className == %s",__func__);
}

@end
