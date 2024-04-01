# 🏫 Chapter 2. 특강 신청 서비스

<p align="center">
  <img src="https://raw.githubusercontent.com/hanghae-plus-backend/yunji-special-lectures/main/db_erd_scheme.svg" alt="ERD" />
</p>

## 요구사항 분석

### 기본 기능

<ol>
  <li>
    <strong>특강 신청:</strong>
    <ol>
      <li>사용자는 수강 신청이 시작된 특정 강의를 신청할 수 있음</li>
      <li>각 강의는 선착순으로 제한된 수의 신청자를 받으며, 정원을 초과하는 신청은 거부됨</li>
    </ol>
  </li>
  <li>
    <strong>특강 목록:</strong>
    <ol>
      <li>특강 전체 목록을 조회할 수 있음</li>
    </ol>
  </li>
  <li>
      <strong>신청 내역 조회:</strong>
    <ol>
      <li>사용자는 특정 강의에 대한 자신의 신청 내역을 조회할 수 있음</li>
      <li>등록 성공/실패 여부 조회 가능</li>
    </ol>
  </li>
</ol>

### 제약 조건

 <ol>
   <li>
      수강 신청 시작 일시가 되지 않으면 해당 강의를 신청할 수 없음
    </li>
    <li>
      동일한 사용자는 한 강의에 대해 한 번만 신청할 수 있음
    </li>
   <li>
      각 강의는 정해진 정원이 있으며, 정원을 초과하는 신청은 실패함
    </li>
   <li>
      동시성 이슈를 고려하여 구현해야 함
    </li>
  </ol>

## DB 스키마

### Users Table

유저 데이터
| Column | Type | Description |
|-----------|---------|--------------|
| id | INT | Primary Key |
| date_created | DATE | 데이터 생성일 |
| name | VARCHAR | |
| email | VARCHAR | |
| phone_number | VARCHAR | |

### Special Lectures Table

특강 데이터
| Column | Type | Description |
|-------------|---------|-----------------|
| id | INT | Primary Key |
| date_created | DATE | 데이터 생성일 |
| title | VARCHAR | 강의 제목 |
| begin_date | DATE | 수강 신청 시작 일시 |
| student_capacity | INT | 최대 수강 정원 |

### Applications Table

특강 신청 내역 데이터

| Column             | Type                                           | Description                           |
| ------------------ | ---------------------------------------------- | ------------------------------------- |
| id                 | INT                                            | Primary Key                           |
| date_created       | DATE                                           | 데이터 생성일                         |
| user_id            | INT                                            | Foreign Key to Users Table            |
| special_lecture_id | INT                                            | Foreign Key to Special Lectures Table |
| status             | ENUM('enrolled', 'wating', 'fail', 'canceled') | 수강 신청 상태                        |

### Students Table

특강 수강 확정자 데이터
| Column | Type | Description |
|------------|---------|--------------------|
| id | INT | Primary Key |
| date_created | DATE | 데이터 생성일 |
| user_id | INT | Foreign Key to Users Table |
| special_lecture_id | INT | Foreign Key to Special Lectures Table |

## API 명세

### 특강 신청 API

- **Endpoint**: `POST /api/special-lectures/apply`
- **Body**:
  ```json
  {
    "userId": "<user-id>",
    "lectureId": "<lecture-id>"
  }
  ```
- **Response**:
  - 성공 (HTTP 200):
   ```json
  {
    "date_created": "2024-03-29T01:37:03.460Z",
    "specialLectureId": 1,
    "userId": 1,
    "status": "enrolled",
    "id": 1
  }
  
  ```
  - 실패 (유효하지 않은 유저 아이디, 유효하지 않은 강의 아이디, 정원 초과 등):

```json
  {
    "message": "<error-message>",
    "error": "Bad Request",
    "statusCode": 400
  }
```

### 특강 목록 조회 API

- **Endpoint**: `GET /api/special-lectures/special-lectures`
- **Response**:
  - 특강 전체 목록 조회 (HTTP 200):
  ```json
  [
    {
      "id": 1,
      "date_created": "2024-03-28T22:20:50.000Z",
      "title": "항해 플러스 토요일 특강",
      "begin_date": "2024-04-20T04:00:00.000Z",
      "student_capacity": 30
     },
    {
      "id": 2,
      "date_created": "2024-03-28T22:21:50.000Z",
      "title": "항해 플러스 일요일 특강",
      "begin_date": "2024-04-21T04:00:00.000Z",
      "student_capacity": 30
    },
    {
      "id": 3,
      "date_created": "2024-03-28T22:20:50.000Z",
      "title": "항해 플러스 금요일 특강",
      "begin_date": "2024-03-28T23:22:00.000Z",
      "student_capacity": 30
    }
  ]

  ````
  - 실패 (유효하지 않은 요청 등):
  ```json
  {
    "message": "<error-message>",
    "error": "Bad Request",
    "statusCode": 400
  }
  ````


###  특강 신청 여부 조회 API

- **Endpoint**: `GET /api/special-lectures/application-status`
- **Query Parameters**: `userId=<user-id>&lectureId=<lecture-id>`
- **Response**:
   - 신청 내역 조회 (HTTP 200):
    ```json
    {
      "id":2,
      "date_created":"2024-03-28T23:35:12.000Z",
      "specialLectureId":3,
      "userId":1,
      "status":"enrolled",
      "specialLecture":{
         "id":3,
         "date_created":"2024-03-28T22:20:50.000Z",
         "title":"항해 플러스 토요일 특강",
         "begin_date":"2024-04-20T04:00:00.000Z",
         "student_capacity":30
      }
   }
    ````
    - 실패 (유효하지 않은 유저 아이디, 신청 내역이 존재하지 않음 등):
    ```json
    {
      "message": "<error-message>",
      "error": "Bad Request",
      "statusCode": 400
     }
    ````
