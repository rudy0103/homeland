# Exception Handler

현업에서는 모든 이슈를 자동으로 수집한다.

개발자가 매번 서버 로그를 뒤져볼 수는 없기 떄문.

매일 아침 출근하면 살펴보는 것이 바로 이 Exception들이다.

회사에 없는 상태라도 이슈를 바로 확인할 수 있다...



How to use

@ExceptionHandler같은 경우는 @Controller, @RestController가 적용된 Bean 내에서 발생하는 예외를 잡아서 하나의 메서드에서 처리해주는 기능을 한다.



@ControllerAdvice

모든 @Controller 즉, 전역에서 발생할 수 있는 예외를 잡아서 처리해주는 Annotation



전역 =>

어떤 경우라도 다 잡아낼 수도?

정신건강을 위해 ControllerAdvice를 쓰자...

MM으로 보내자



사용법:

https://girawhale.tistory.com/2?category=947729



