# Deployment

## 0. Letsencrypt

아래 명령어를 통해 letsencrypt를 설치

```bash
sudo apt-get update
sudo apt-get install letsencrypt
```



아래 명령어를 통해 도메인의 인증서를 발급 받음

```bash
sudo letsencrypt certonly --standalone -d 도메인 
```

"Congratulation"으로 시작하는 문구가 보여야 발급 완료



발급된 인증서는 아래 처럼 저장됨(나중에 nginx 설정에서 사용되기 때문에 다른 곳으로 임의로 이동 X)

```
/etc/letsencrypt/live/도메인/fullchain.pem
/etc/letsencrypt/live/도메인/privkey.pem
```

![image-20220214174333286](https://raw.githubusercontent.com/rudy0103/save-image-repo/master/img/image-20220214174333286.png)





## 1. OpenVidu 서버 배포

```bqsh
sudo su
cd /opt	
```

```bash
curl https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_latest.sh | bash
```



### /opt/openvidu/.env 파일 설정

OpenVidu 서버 도메인과 Secret을 설정하고

https를 위한 인증서 타입을 설정한다.

인증서 타입은 letsencrypt로 하였음

```
# Domain name. If you do not have one, the public IP of the machine.
# For example: 198.51.100.1, or openvidu.example.com
DOMAIN_OR_PUBLIC_IP=도메인

# OpenVidu SECRET used for apps to connect to OpenVidu server and users to access to OpenVidu Dashboard
OPENVIDU_SECRET=시크릿

# Certificate type:
# - selfsigned:  Self signed certificate. Not recommended for production use.
#                Users will see an ERROR when connected to web page.
# - owncert:     Valid certificate purchased in a Internet services company.
#                Please put the certificates files inside folder ./owncert
#                with names certificate.key and certificate.cert
# - letsencrypt: Generate a new certificate using letsencrypt. Please set the
#                required contact email for Let's Encrypt in LETSENCRYPT_EMAIL
#                variable.
CERTIFICATE_TYPE=letsencrypt

# If CERTIFICATE_TYPE=letsencrypt, you need to configure a valid email for notifications
LETSENCRYPT_EMAIL=이메일
```



### /opt/openvidu/docker-compose.override.yml 설정

기존에 openvidu서버에서 제공하는 app의 포트 번호를 5442 말고 다른 포트로 변경한다.

(실행시킨 후 도커 컨테이너를 stop하고 프론트엔트를 배포 해도 된다. 5442포트 안겹치게)

```
version: '3.1'

services:
    # --------------------------------------------------------------
    #
    #   Change this if your want use your own application.
    #   It's very important expose your application in port 5442
    #   and use the http protocol.
    #
    #   Default Application
    #
    #   Openvidu-Call Version: 2.20.0
    #
    # --------------------------------------------------------------
    app:
        image: openvidu/openvidu-call:2.20.0
        restart: on-failure
        network_mode: host
        environment:
            - SERVER_PORT=5442-->5442이외 다른 포트로
            - OPENVIDU_URL=http://localhost:5443
            - OPENVIDU_SECRET=${OPENVIDU_SECRET}
            - CALL_OPENVIDU_CERTTYPE=${CERTIFICATE_TYPE}
        logging:
            options:
                max-size: "${DOCKER_LOGS_MAX_SIZE:-100M}"
```



```bash
s./openvidu start
```



---------------------------------

## 2. 프론트엔드 배포

깃을 클론한 후 FE디렉터리로 이동



```bash
cd FE
```

.env파일 수정

```
vi .env
```

아래에 URL과 SECRET을 넣어준다(/opt/openvidu/.env 파일에서 넣은 도메인과 시크릿)

```.env
REACT_APP_BACKEND_URL="https://i6c202.p.ssafy.io:8443"
REACT_APP_OPENVIDU_SERVER_URL="https://i6c202.p.ssafy.io"
REACT_APP_OPENVIDU_SERVER_SECRET="HOMELAND"
```



Dockerfile을 통해 이미지를 빌드하고 컨테이너를 실행

```bash
sudo docker build -t react_img .
```

```bash
sudo docker run -it -d --network="host" --name homeland_react react_img
```

컨테이너 로그 확인 하기

```bash
sudo docker logs -f homeland_react
```





## 3. 백엔트 배포



### 백엔드를 배포하기 전에 mySql 설정을 해야한다.

application.properties에 맞는 계정,비밀번호,database가 있어야한다.

```
계정 ssafy
비밀번호 ssafy
db명 ssafy_web_db	
```



```
create user 'ssafy'@'%' identified by 'ssafy';
grant all privileges on *.* to 'ssafy'@'%';
```

-----------------------------------------------

### 백엔드 배포 전에 예전에 만들어 놓은 letsencrypt 인증서를 p12로 바꿔야한다.



```bash
sudo su
cd cd /etc/letsencrypt/live/도메인/
```



```bash
openssl pkcs12 -export -in fullchain.pem -inkey privkey.pem -out keystore.p12 -CAfile chain.pem -caname root
```

변환한 key를 resources/keystore에 복사

```
cp keystore.p12 /home/ubuntu/S06P12C202/homeland/src/main/resources/keystore/keystore.p12
```





인증서 관련 정보 application.properties 설정에서도 변경

![image-20220215003202450](https://raw.githubusercontent.com/rudy0103/save-image-repo/master/img/image-20220215003202450.png)



openvidu 서버 관련 properties 저장 (application.properties)

![image-20220217192349453](https://raw.githubusercontent.com/rudy0103/save-image-repo/master/img/image-20220217192349453.png)

OPENVIDUAPP:오픈비두서버시크릿(/opt/openvidu/.env파일에서 설정했었음)



백엔드 프로젝트 루트 디렉터리로 이동

```bash
cd homeland
```

Dockerfile을 통해 이미지 생성

```
sudo docker build -t spring_img .
```



생성한 이미지를 백그라운드 모드로 실행

```bash
sudo docker run -it -d --network="host" --name homeland_spring spring_img
```

-----------------------



도커 컨테이너 로그 확인

```
sudo docker logs -f homeland_spring 
```





## 최종 도커 컨테이너

![image-20220215001345272](https://raw.githubusercontent.com/rudy0103/save-image-repo/master/img/image-20220215001345272.png)

openvidu_app_1은 stop해도 상관 없다.
