package com.ssafy.homeland.api.request.member;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("UserChangePasswordRequest")
public class UserChangePwReq {
    @ApiModelProperty(name="유저 New Password", example="your_new_password")
    String password;
}
