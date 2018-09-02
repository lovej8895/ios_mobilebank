//
//  CheckComplete.h
//  HBuilder-Hello
//
//  Created by guoxd on 16/1/7.
//  Copyright © 2016年 DCloud. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NSString+YX.h"
#import "YRJSONAdapter.h"
#import "CompleteCheck.h"

@interface CheckComplete : NSObject
@property(nonatomic,strong)NSString *result;
@property(nonatomic,strong)NSMutableArray *filePathList;
@property(nonatomic,strong)NSMutableArray *fileNameList;
@property(nonatomic,strong)NSMutableArray *mutableArray;//带相对路径的文件全名
@property (nonatomic,strong) CompleteCheck *checkComplete;
@property(nonatomic,strong)NSString *ResultString;
-(void)fileIntegrityCheck:(NSString *)string;
@end
