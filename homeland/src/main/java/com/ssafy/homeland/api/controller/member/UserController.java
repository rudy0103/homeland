package com.ssafy.homeland.api.controller.member;

import com.ssafy.homeland.api.request.member.UserRegisterPostReq;
import com.ssafy.homeland.api.response.member.UserRes;
import com.ssafy.homeland.api.service.member.UserService;
import com.ssafy.homeland.common.auth.SsafyUserDetails;
import com.ssafy.homeland.common.model.response.BaseResponseBody;
import com.ssafy.homeland.db.entity.User;
import com.ssafy.homeland.db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import springfox.documentation.annotations.ApiIgnore;

import java.util.HashMap;
import java.util.Map;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/users")
public class UserController {
	
	@Autowired
	UserService userService;

	@Autowired
	UserRepository userRepository;

	@Autowired
	PasswordEncoder passwordEncoder;
	
	@PostMapping()
	@ApiOperation(value = "회원 가입", notes = "<strong>아이디와 패스워드</strong>를 통해 회원가입 한다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 401, message = "인증 실패"),
        @ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserRegisterPostReq registerInfo) {
		System.out.println("왔음왔음왔음왔음왔음왔음왔음왔음왔음");

		User user = userService.createUser(registerInfo);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
	
	@GetMapping("/me")
	@ApiOperation(value = "회원 본인 정보 조회", notes = "로그인한 회원 본인의 정보를 응답한다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 401, message = "인증 실패"),
        @ApiResponse(code = 404, message = "사용자 없음"),
        @ApiResponse(code = 500, message = "서버 오류")
    })

	public Map<String, Object> getUserInfo(@ApiIgnore Authentication authentication) {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */
		System.out.println("마이페이지 정보 옴!");
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		String userId = userDetails.getUsername();
		User user = userService.getUserByUserId(userId);
		Map<String, Object> obj = new HashMap<>();
		obj.put("id", user.getUserId());
		obj.put("email", user.getEmail());
		obj.put("nickname", user.getNickname());
		obj.put("authority", user.getAuthority());
		
		return obj;
	}

	@PutMapping("/edit")
	public Map<String, Object> editUserInfo(Authentication authentication, @RequestBody Map<String,Object> body) {
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		String userId = userDetails.getUsername();
		User user = userService.getUserByUserId(userId);
		user.setNickname(body.get("nickname").toString());
		user.setEmail(body.get("email").toString());
		userRepository.save(user);
		return Map.of("message", "정보 수정 성공");

	}

	@PutMapping("/edit-password")
	public Map<String, Object> editPassword(Authentication authentication, @RequestBody Map<String,Object> body) {
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		String userId = userDetails.getUsername();
		User user = userService.getUserByUserId(userId);
		user.setPassword(passwordEncoder.encode(body.get("password").toString()));
		userRepository.save(user);
		return Map.of("message", "비밀번호 수정 성공");
	}




}
