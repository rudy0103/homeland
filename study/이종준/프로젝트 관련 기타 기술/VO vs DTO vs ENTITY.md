# VO vs DTO vs ENTITY

VO

Value Object

"값" 객체

값이라는 표현을 기억하면 좋다.

1. VO는 값의 비교를 위해서 사용함.

값 비교를 위해서 equals와 hashCode를 오버라이드해서 사용한다.

오버라이드의 결과로 VO는 값이 동일하다면 같은 객체라고 본다.

2. Immutable한 불변 객체로 사용된다.

따라서 Setter는 존재하지 않고 Getter만 존재한다.

VO에는 lombok으로 @Data 어노테이션을 달아서는 안된다.



DTO

흔히 JSON 형태의 데이터를 통신을 위해서 Serialize해서 쓰게 되는 것이 DTO

Controller에서 리턴할 때 DTO를 쓰게 됨.



ENTITY

실제 DB 테이블과 매칭이 되는 클래스

Service layer에서 사용, 표현 계층의 로직을 가져서는 안 됨.

원칙적으로 Controller에서는 Entity를 **Parameter로 받거나** 리턴해서는 안 된다.

Entity와 DTO를 분리하는 이유

Layer별로 역할 분리, 엔티티의 영속성을 지켜주기 위해서임

Controller에서 Param으로 Entity를 받을 경우 DB가 아닌 Client로부터 Entity가 영속성을 주입받게 된다

기본 생성자가 필수이다.

final 클래스, enum, interface, inner 클래스에는 사용할 수 없다.

저장할 필드에 final을 쓰면 안된다.

하지만, 이론적으로는 DTO와 Entity를 분리하는 것이 맞지만

실무적으로 간단한 CRUD를 만들 때 Entity를 그대로 리턴하기도 한다.

DB 테이블과 View에서 사용하는 객체가 완전히 동일하다면 매번 DTO를 만드는 로직이 낭비일 수도 있기 때문이다.(그럼에도 불구하고 분리를 권장함)

