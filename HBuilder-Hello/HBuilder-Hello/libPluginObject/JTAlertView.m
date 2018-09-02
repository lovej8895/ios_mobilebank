//
//  JTAlertView.m
//  HBuilder-Hello
//
//  Created by 姬婷婷 on 2017/8/1.
//  Copyright © 2017年 DCloud. All rights reserved.
//

#import "JTAlertView.h"

@implementation JTAlertView

/*
 // Only override drawRect: if you perform custom drawing.
 // An empty implementation adversely affects performance during animation.
 - (void)drawRect:(CGRect)rect {
 // Drawing code
 }
 */
- (void)dismissWithClickedButtonIndex:(NSInteger)buttonIndex animated:(BOOL)animated
{
    if (self.tag == 0) {
        [super dismissWithClickedButtonIndex:buttonIndex animated:animated]; // 消失
    }else{
    // ...
    // 不消失
    }
}
@end
